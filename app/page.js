'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Music, Users, ListMusic, ThumbsUp, Plus } from 'lucide-react';
import Link from 'next/link';
import CreateJamModal from '@/components/CreateJamModal';

export default function Home() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateJam = (newJam) => {
    setIsCreateModalOpen(false);
    router.push(`/${newJam.slug}`);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white py-6 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-24 max-w-4xl pt-32 md:pt-48">
        <div className="flex items-center gap-4 mb-3">
          <Music className="h-16 w-16 text-purple-300" />
          <h1 className="text-6xl font-bold drop-shadow-lg">JamVote</h1>
        </div>
        <p className="text-2xl text-purple-200 mb-20">Host live music jams and vote on what to play next.</p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-3">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            size="lg" 
            className="w-full sm:w-auto bg-white hover:bg-gray-100 text-purple-900 rounded-lg px-8 py-3 text-lg font-medium"
          >
            Create a Jam
          </Button>
          
          <Link href="/jams" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10 hover:text-white hover:border-white/80 rounded-lg px-8 py-3 text-lg font-medium">
              Browse Jams
            </Button>
          </Link>
        </div>
        
        <p className="text-purple-200 text-lg mb-24">
          ...or scan a QR code of an existing Jam to quickly join
        </p>
      </div>

      {/* Process Timeline */}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Step 1 */}
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-purple-800 bg-opacity-20 border-2 border-purple-400 border-opacity-40 flex items-center justify-center text-purple-200 font-semibold text-lg flex-shrink-0">
              1
            </div>
            <div className="w-0.5 h-full bg-purple-600 bg-opacity-30 mt-2"></div>
          </div>
          <div className="bg-purple-800 bg-opacity-30 p-6 rounded-lg flex-1">
            <div className="flex items-center mb-4">
              <Music className="w-8 h-8 mr-3 text-purple-300" />
              <h2 className="text-xl font-semibold">Host a Jam</h2>
            </div>
            <p>Create your jam session and invite friends to join the fun</p>
          </div>
        </div>
        
        {/* Step 2 */}
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-6 bg-purple-600 bg-opacity-30 -mt-2"></div>
            <div className="w-12 h-12 rounded-full bg-purple-800 bg-opacity-20 border-2 border-purple-400 border-opacity-40 flex items-center justify-center text-purple-200 font-semibold text-lg flex-shrink-0">
              2
            </div>
            <div className="w-0.5 h-full bg-purple-600 bg-opacity-30 mt-2"></div>
          </div>
          <div className="bg-purple-800 bg-opacity-30 p-6 rounded-lg flex-1">
            <div className="flex items-center mb-4">
              <ListMusic className="w-8 h-8 mr-3 text-purple-300" />
              <h2 className="text-xl font-semibold">Build the Playlist</h2>
            </div>
            <p>Suggest songs and collaborate on the perfect setlist</p>
          </div>
        </div>
        
        {/* Step 3 */}
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-6 bg-purple-600 bg-opacity-30 -mt-2"></div>
            <div className="w-12 h-12 rounded-full bg-purple-800 bg-opacity-20 border-2 border-purple-400 border-opacity-40 flex items-center justify-center text-purple-200 font-semibold text-lg flex-shrink-0">
              3
            </div>
            <div className="w-0.5 h-full bg-purple-600 bg-opacity-30 mt-2"></div>
          </div>
          <div className="bg-purple-800 bg-opacity-30 p-6 rounded-lg flex-1">
            <div className="flex items-center mb-4">
              <ThumbsUp className="w-8 h-8 mr-3 text-purple-300" />
              <h2 className="text-xl font-semibold">Vote Together</h2>
            </div>
            <p>Choose the next song and keep the music flowing</p>
          </div>
        </div>
        
        {/* Step 4 */}
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-6 bg-purple-600 bg-opacity-30 -mt-2"></div>
            <div className="w-12 h-12 rounded-full bg-purple-800 bg-opacity-20 border-2 border-purple-400 border-opacity-40 flex items-center justify-center text-purple-200 font-semibold text-lg flex-shrink-0">
              4
            </div>
          </div>
          <div className="bg-purple-800 bg-opacity-30 p-6 rounded-lg flex-1">
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 mr-3 text-purple-300" />
              <h2 className="text-xl font-semibold">Rock Out</h2>
            </div>
            <p>Turn your living room into an instant concert venue</p>
          </div>
        </div>
      </div>

      <CreateJamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateJam={handleCreateJam}
      />
    </div>
  );
}
