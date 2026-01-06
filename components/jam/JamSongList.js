import { useEffect, useRef, useState } from 'react';
import SongRow from "@/components/SongRowJam";

export default function JamSongList({ 
  songs, 
  nextSongId, 
  onVote, 
  onRemove, 
  onTogglePlayed, 
  onEdit, 
  hideTypeBadge, 
  emptyMessage, 
  groupingEnabled, 
  lastAddedSongId,
  type,
  hostMode = false,
  scrollToSongId,
  onScrollComplete
}) {
  // Add ref for the newly added song
  const lastAddedRef = useRef(null);
  const scrollTargetRef = useRef(null);
  const [highlightedSongId, setHighlightedSongId] = useState(null);

  // Scroll to newly added song when lastAddedSongId changes
  useEffect(() => {
    if (lastAddedSongId && lastAddedRef.current) {
      lastAddedRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [lastAddedSongId]);

  useEffect(() => {
    if (!scrollToSongId) {
      setHighlightedSongId(null);
      return;
    }
    const el = document.getElementById(`jam-song-${scrollToSongId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Set highlight after scroll completes
      setTimeout(() => {
        setHighlightedSongId(scrollToSongId);
        // Clear highlight after 3 seconds
        setTimeout(() => {
          setHighlightedSongId(null);
        }, 3000);
      }, 300);
    }
    onScrollComplete?.();
  }, [scrollToSongId, onScrollComplete]);

  if (songs.length === 0) {
    return (
      <li className="px-4 py-3 text-sm text-gray-500 italic">
        {emptyMessage}
      </li>
    );
  }

  // Handle Enter key to vote on highlighted song (only when not typing in input)
  useEffect(() => {
    if (!highlightedSongId) return;

    const handleKeyDown = (e) => {
      // Only handle Enter if not typing in an input/textarea
      if (e.key === 'Enter' && highlightedSongId && 
          e.target.tagName !== 'INPUT' && 
          e.target.tagName !== 'TEXTAREA' &&
          !e.target.isContentEditable) {
        const highlightedSong = songs.find(s => s._id === highlightedSongId);
        if (highlightedSong && !highlightedSong.played) {
          e.preventDefault();
          e.stopPropagation();
          onVote(highlightedSong._id, 'vote');
          setHighlightedSongId(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [highlightedSongId, songs, onVote]);

  return songs.map((jamSong, index) => {
    // Use lastAddedSongId highlight or the song's own highlight from vote changes
    const willHighlight = jamSong._id === lastAddedSongId ? 'success' : jamSong.highlight;
    const isHighlighted = jamSong._id === highlightedSongId;
    return (
      <li 
        key={`${jamSong.song._id}-${index}`} 
        className="transition-colors duration-200"
        id={`jam-song-${jamSong._id}`}
        ref={
          jamSong._id === lastAddedSongId
            ? lastAddedRef
            : jamSong._id === scrollToSongId
            ? scrollTargetRef
            : null
        }
      >
        <SongRow 
          jamSong={jamSong} 
          onVote={onVote} 
          onRemove={() => onRemove(jamSong)}
          onTogglePlayed={onTogglePlayed}
          onEdit={onEdit}
          isNext={jamSong._id === nextSongId}
          hideType={hideTypeBadge}
          groupingEnabled={groupingEnabled}
          highlight={willHighlight}
          hostMode={hostMode}
          isHighlighted={isHighlighted}
        />
      </li>
    );
  });
} 