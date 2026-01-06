import { useState, useEffect, forwardRef } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { XCircle } from 'lucide-react';
import { AutoComplete } from "@/components/ui/autocomplete";
import Link from 'next/link';

const SongAutocomplete = forwardRef(({ 
  onSelect, 
  onAddNew, 
  onFocusExisting,
  placeholder = "Add or find a song, by song title or artist name...", 
  currentSongs = [],
  maxWidth = "max-w-md",
  autoFocus = false
}, ref) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);

  useEffect(() => {
    const searchSongs = async () => {
      if (!query.trim()) {
        setResults([]);
        setSearchComplete(false);
        return;
      }

      setIsLoading(true);
      setSearchComplete(false);
      try {
        const res = await fetch(`/api/songs/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        
        // Transform the data to match AutoComplete's expected format
        const options = data.map(song => {
          const isDuplicate = currentSongs.some(existingSong => 
            existingSong._id === song._id || // Check direct match
            existingSong.song?._id === song._id // Check nested song match
          );
          return {
            value: song._id,
            label: `${song.title} - ${song.artist}`, // Generic label for base component
            disabled: isDuplicate,
            // Song-specific data
            title: song.title,
            artist: song.artist,
            type: song.type,
            _id: song._id,
            isDuplicate
          };
        });
        setResults(options);
        setSearchComplete(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchComplete(true);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchSongs, 300);
    return () => clearTimeout(debounce);
  }, [query, currentSongs]);

  const renderOption = (option, isSelected) => {
    if (option.isSection) {
      return (
        <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold px-2 py-1 cursor-default">
          {option.label}
        </div>
      );
    }

    if (option.isPlaceholder) {
      return (
        <div className="px-3 py-2 text-sm text-gray-500">
          {option.label}
        </div>
      );
    }

    if (option.isBrowseAll) {
      return (
        <div className="flex items-center text-indigo-600">
          <PlusIcon className="h-5 w-5 flex-shrink-0 text-indigo-600 mr-2" aria-hidden="true" />
          <span className="font-medium">Browse all songs</span>
        </div>
      );
    }

    if (option.isAddNew) {
      return (
        <div className={`flex items-center ${isSelected ? 'text-accent-foreground' : 'text-indigo-600'}`}>
          <PlusIcon className={`h-5 w-5 mr-2 flex-shrink-0 ${isSelected ? 'text-accent-foreground' : 'text-indigo-600'}`} aria-hidden="true" />
          <span>Add "{option.query}" to the jam</span>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between w-full">
        <div>
          <span className="font-medium text-base">{option.title}</span>
          <span className="ml-2 text-gray-500 text-base">{option.artist}</span>
          {option.isDuplicate && (
            <div className="ml-2 inline-flex items-center gap-1">
              <XCircle className="h-3.5 w-3.5 flex-shrink-0 text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">Already added</span>
            </div>
          )}
        </div>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium ${
            option.type === 'banger'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {option.type}
        </span>
      </div>
    );
  };

  const handleValueChange = (option) => {
    if (!option) return;

    // Ignore section headers
    if (option.isSection || option.isPlaceholder) return;

    if (option.isBrowseAll) {
      window.location.assign('/songs');
      return;
    }

    if (option.isInJam) {
      onFocusExisting?.(option.jamSongId);
      setQuery('');
      // Blur the input so Enter key can be used to vote
      if (ref && typeof ref === 'object' && ref.current) {
        ref.current.blur();
      }
      return;
    }

    if (option.isAddNew) {
      onAddNew(option.query);
      setQuery('');
      return;
    }

    if (!option.isDuplicate) {
      onSelect(option);
      setQuery('');
    }
  };

  const normalizedQuery = query.trim().toLowerCase();
  const hasQuery = !!normalizedQuery;

  // Already-in-jam matches
  const inJamMatches = normalizedQuery
    ? currentSongs
        .filter((jamSong) => {
          const title = jamSong.song?.title?.toLowerCase() || '';
          const artist = jamSong.song?.artist?.toLowerCase() || '';
          return title.includes(normalizedQuery) || artist.includes(normalizedQuery);
        })
        .map((jamSong) => ({
          value: jamSong.song._id,
          label: `${jamSong.song.title} - ${jamSong.song.artist}`,
          title: jamSong.song.title,
          artist: jamSong.song.artist,
          type: jamSong.song.type,
          jamSongId: jamSong._id,
          isInJam: true,
        }))
    : [];

  // Combine search results with "Add new" option
  const addNewOption = {
    value: 'add-new',
    label: `Add "${query}" to the jam`,
    isAddNew: true,
    query: query,
    title: query,
    artist: '',
    type: 'banger',
    _id: 'add-new'
  };

  const browseAllOption = {
    value: 'browse-all',
    label: 'Browse all songs',
    isBrowseAll: true,
  };

  const addableResults = (Array.isArray(results) ? results : []).filter(r => !r.isDuplicate);

  const allOptions = [];

  if (hasQuery) {
    // Always show "Already in the Jam" section
    allOptions.push({
      value: 'section-injam',
      label: 'Already in the Jam',
      isSection: true,
    });

    if (inJamMatches.length > 0) {
      allOptions.push(...inJamMatches);
    } else {
      allOptions.push({
        value: 'placeholder-injam',
        label: `No matches for "${query}" in this jam`,
        isPlaceholder: true,
      });
    }

    // Always show "Add a song" section
    allOptions.push({
      value: 'section-add',
      label: 'Add a song to the Jam',
      isSection: true,
    });

    // When loading, we still show the section but keep results minimal
    if (!isLoading || searchComplete) {
      allOptions.push(...addableResults);
    }

    allOptions.push(addNewOption, browseAllOption);
  }

  // Calculate the default highlighted index
  // Priority: 1) in-jam matches, 2) search matches, 3) "Add new" option
  const getDefaultHighlightedIndex = () => {
    if (!hasQuery || isLoading) return null;
    
    // First priority: If there are in-jam matches, highlight the first one
    if (inJamMatches.length > 0) {
      const firstInJamIndex = allOptions.findIndex(opt => 
        opt.isInJam && opt.jamSongId === inJamMatches[0].jamSongId
      );
      if (firstInJamIndex !== -1) {
        return firstInJamIndex;
      }
    }
    
    // Second priority: If there are search matches, highlight the first one
    if (addableResults.length > 0) {
      const firstSearchResultIndex = allOptions.findIndex(opt => 
        opt.value && addableResults.some(r => r.value === opt.value)
      );
      if (firstSearchResultIndex !== -1) {
        return firstSearchResultIndex;
      }
    }
    
    // Third priority: Highlight the "Add new" option
    const addNewIndex = allOptions.findIndex(opt => opt.isAddNew);
    if (addNewIndex !== -1) {
      return addNewIndex;
    }
    
    // Fallback: Find the first selectable item
    for (let i = 0; i < allOptions.length; i++) {
      const option = allOptions[i];
      if (!option.isSection && !option.isPlaceholder && !option.disabled) {
        return i;
      }
    }
    
    return null;
  };

  const defaultHighlightedIndex = getDefaultHighlightedIndex();

  const handleKeyDown = (e) => {
    // When Enter is pressed with a query
    if (e.key === 'Enter' && query.trim() && !e.defaultPrevented) {
      // Check if there are any matches (in-jam or search results)
      const hasInJamMatches = inJamMatches.length > 0;
      const hasSearchMatches = addableResults.length > 0;
      
      // If there are any matches (in-jam or search), let downshift handle Enter
      // to select the highlighted item (which will be the first in-jam match if available,
      // otherwise the first search match)
      // If there are no matches, default to "Add new"
      if (!hasInJamMatches && !hasSearchMatches && !isLoading) {
        e.preventDefault();
        e.stopPropagation();
        // Trigger the "Add new" action
        if (onAddNew) {
          onAddNew(query.trim());
          setQuery('');
        }
      }
      // If there are matches, let the default downshift behavior handle Enter
      // which will select the highlighted item
    }
  };

  return (
    <div className="relative">
      <AutoComplete
        options={allOptions}
        value={null}
        onValueChange={handleValueChange}
        onInputChange={setQuery}
        inputValue={query}
        placeholder={placeholder}
        emptyMessage={isLoading ? "Searching..." : (
          <div className="py-2">
            <p className="text-lg">Type to start searching</p>
            <p className="mt-1">
              or{'  '}
              <Link href="/songs" className="text-primary hover:text-primary/80 underline">
                browse all songs
              </Link>
            </p>
          </div>
        )}
        isLoading={isLoading}
        renderOption={renderOption}
        className=""
        inputClassName="h-12 border border-gray-200 shadow-sm focus:border-primary focus:ring-0"
        disabledText="Already added"
        maxWidth={maxWidth}
        position="auto"
        align="start"
        side="top"
        inputRef={ref}
        autoFocus={autoFocus}
        onKeyDown={handleKeyDown}
        defaultHighlightedIndex={defaultHighlightedIndex}
      />
    </div>
  );
});

SongAutocomplete.displayName = 'SongAutocomplete';

export default SongAutocomplete; 