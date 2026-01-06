import { ChevronDown } from 'lucide-react';
import SongAutocomplete from "@/components/SongAutocomplete";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full border border-gray-300 hover:bg-gray-100"
              >
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setGroupingEnabled(true)}
                className={groupingEnabled ? "bg-accent" : ""}
              >
                Group by banger/ballad
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setGroupingEnabled(false)}
                className={!groupingEnabled ? "bg-accent" : ""}
              >
                No grouping
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
} 