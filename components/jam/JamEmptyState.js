import { PlusIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';

export default function JamEmptyState({ onAddClick }) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
      {/* Main empty state content */}
      <div className="flex flex-col items-center py-8 px-4 sm:py-16 mt-24">
        <div className="flex flex-col items-center space-y-6 w-full max-w-sm">

          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No songs yet - add some tunes!</h3>
            <p className="text-base text-gray-600">
              Use the search bar above to find and add songs to your jam session. Search by title or artist name.
            </p>
          </div>

          <Button onClick={onAddClick} className="inline-flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Add a song
          </Button>
        </div>
      </div>
    </div>
  );
} 