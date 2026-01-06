import { ArrowDownNarrowWide } from 'lucide-react';
import SongAutocomplete from "@/components/SongAutocomplete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function JamToolbar({ 
  songAutocompleteRef, 
  handleSelectExisting, 
  handleAddNew, 
  handleFocusExisting,
  currentSongs, 
  groupingEnabled, 
  setGroupingEnabled 
}) {
  return (
    <div className="sticky top-0 z-10 mb-4 flex items-center justify-between bg-transparent shadow-none rounded-none p-0">
      <div className="flex-1 w-full">
        <SongAutocomplete 
          ref={songAutocompleteRef}
          onSelect={handleSelectExisting} 
          onAddNew={handleAddNew}
          onFocusExisting={handleFocusExisting}
          currentSongs={currentSongs}
          maxWidth="w-full"
          autoFocus
        />
      </div>

      {currentSongs?.length > 0 && (
        <div className="flex items-center space-x-4 ml-4">

          <Select value={groupingEnabled ? 'type' : 'none'} onValueChange={(value) => setGroupingEnabled(value === 'type')}>
            <SelectTrigger className="w-auto border-none text-gray-500 focus:text-gray-900 text-sm focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="type">Group by banger/ballad</SelectItem>
              <SelectItem value="none">No grouping</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
} 