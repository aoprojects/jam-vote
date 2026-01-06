import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Jam from '@/models/Jam';
import Song from '@/models/Song';
import { ObjectId } from 'mongodb';

export async function GET(request, context) {
  try {
    await connectDB();
    const params = await context.params;
    const { slug } = params;

    const jam = await Jam.findOne({ slug }).populate('songs.song');

    if (!jam) {
      // Return mock data for demo jam (slug "4")
      if (slug === '4') {
        // Generate fake song data
        const generateMockSongs = () => {
          const bangers = [
            { title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses' },
            { title: 'Don\'t Stop Believin\'', artist: 'Journey' },
            { title: 'Livin\' on a Prayer', artist: 'Bon Jovi' },
            { title: 'We Will Rock You', artist: 'Queen' },
            { title: 'Eye of the Tiger', artist: 'Survivor' },
            { title: 'I Love Rock \'n Roll', artist: 'Joan Jett & The Blackhearts' },
            { title: 'Born to Run', artist: 'Bruce Springsteen' },
            { title: 'Thunderstruck', artist: 'AC/DC' },
            { title: 'Jump', artist: 'Van Halen' },
            { title: 'Rock and Roll All Nite', artist: 'KISS' }
          ];

          const ballads = [
            { title: 'Wonderwall', artist: 'Oasis' },
            { title: 'Hallelujah', artist: 'Leonard Cohen' },
            { title: 'Black', artist: 'Pearl Jam' },
            { title: 'Stairway to Heaven', artist: 'Led Zeppelin' },
            { title: 'Hotel California', artist: 'Eagles' },
            { title: 'Wish You Were Here', artist: 'Pink Floyd' },
            { title: 'Nothing Else Matters', artist: 'Metallica' },
            { title: 'Patience', artist: 'Guns N\' Roses' },
            { title: 'Tears in Heaven', artist: 'Eric Clapton' },
            { title: 'The Sound of Silence', artist: 'Simon & Garfunkel' }
          ];

          const mockSongs = [];
          let order = 1;

          // Add bangers with varying votes
          bangers.forEach((song, index) => {
            const songId = new ObjectId();
            mockSongs.push({
              _id: new ObjectId(),
              song: {
                _id: songId,
                title: song.title,
                artist: song.artist,
                type: 'banger',
                voteCount: 0,
                timesPlayed: 0,
                lastPlayed: null,
                playHistory: [],
                tags: [],
                chordChart: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              },
              votes: Math.floor(Math.random() * 15), // Random votes 0-14
              order: order++,
              played: index < 2, // First 2 bangers are played
              playedAt: index < 2 ? new Date(Date.now() - (2 - index) * 3600000).toISOString() : null,
              captains: []
            });
          });

          // Add ballads with varying votes
          ballads.forEach((song, index) => {
            const songId = new ObjectId();
            mockSongs.push({
              _id: new ObjectId(),
              song: {
                _id: songId,
                title: song.title,
                artist: song.artist,
                type: 'ballad',
                voteCount: 0,
                timesPlayed: 0,
                lastPlayed: null,
                playHistory: [],
                tags: [],
                chordChart: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              },
              votes: Math.floor(Math.random() * 15), // Random votes 0-14
              order: order++,
              played: index < 2, // First 2 ballads are played
              playedAt: index < 2 ? new Date(Date.now() - (2 - index) * 3600000).toISOString() : null,
              captains: []
            });
          });

          // Sort by votes (descending) for unplayed songs
          const playedSongs = mockSongs.filter(s => s.played);
          const unplayedSongs = mockSongs.filter(s => !s.played).sort((a, b) => b.votes - a.votes);
          
          return [...playedSongs, ...unplayedSongs];
        };

        const mockJam = {
          _id: 'demo-jam-4',
          name: 'Demo Jam Session',
          jamDate: new Date().toISOString(),
          slug: '4',
          archived: false,
          songs: generateMockSongs(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __v: 0
        };
        return NextResponse.json(mockJam);
      }
      
      return NextResponse.json(
        { error: 'Jam not found' },
        { status: 404 }
      );
    }

    // Sort the songs by votes in descending order
    jam.songs.sort((a, b) => b.votes - a.votes);

    return NextResponse.json(jam);
  } catch (error) {
    console.error('Error in GET /api/jams/by-slug/[slug]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jam' },
      { status: 500 }
    );
  }
} 