import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
}

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [volume, setVolume] = useState([70]);
  const [progress, setProgress] = useState([0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isRepeatOn, setIsRepeatOn] = useState(false);

  const songs: Song[] = [
    { id: 1, title: "Starlight Symphony", artist: "Luna Wave", album: "Cosmic Dreams", duration: "3:45", coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop" },
    { id: 2, title: "Electric Nights", artist: "Neon Pulse", album: "City Lights", duration: "4:12", coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop" },
    { id: 3, title: "Ocean Waves", artist: "Marina Soul", album: "Deep Blue", duration: "3:58", coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop" },
    { id: 4, title: "Mountain Echo", artist: "Alpine Sounds", album: "High Peaks", duration: "5:23", coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop" },
    { id: 5, title: "Sunset Boulevard", artist: "Golden Hour", album: "Evening Vibes", duration: "4:01", coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop" },
    { id: 6, title: "Rain Dance", artist: "Storm Chasers", album: "Weather Patterns", duration: "3:34", coverUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop" },
  ];

  const filteredSongs = songs.filter(
    song =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentSong((prev) => (prev + 1) % songs.length);
    setProgress([0]);
  };

  const handlePrevious = () => {
    setCurrentSong((prev) => (prev - 1 + songs.length) % songs.length);
    setProgress([0]);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-900/20 via-background to-blue-900/20">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search songs, artists, albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-96 bg-background/50"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Now Playing Section */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-80 h-80 rounded-2xl overflow-hidden shadow-2xl mb-8 ring-4 ring-primary/20">
            <img
              src={songs[currentSong].coverUrl}
              alt={songs[currentSong].title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-center mb-8 max-w-md">
            <h2 className="text-3xl font-bold mb-2">{songs[currentSong].title}</h2>
            <p className="text-xl text-muted-foreground">{songs[currentSong].artist}</p>
            <p className="text-sm text-muted-foreground">{songs[currentSong].album}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mb-6">
            <Slider
              value={progress}
              onValueChange={setProgress}
              max={100}
              step={1}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0:00</span>
              <span>{songs[currentSong].duration}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant={isShuffleOn ? "default" : "ghost"}
              size="icon"
              onClick={() => setIsShuffleOn(!isShuffleOn)}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handlePrevious}>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="h-14 w-14"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNext}>
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button
              variant={isRepeatOn ? "default" : "ghost"}
              size="icon"
              onClick={() => setIsRepeatOn(!isRepeatOn)}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3 w-full max-w-xs">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-10 text-right">
              {volume[0]}%
            </span>
          </div>
        </div>

        {/* Playlist */}
        <div className="w-96 border-l border-border/50 bg-background/30 backdrop-blur">
          <div className="p-4 border-b border-border/50 flex items-center gap-2">
            <List className="h-5 w-5" />
            <h3 className="font-semibold">Queue</h3>
          </div>
          <ScrollArea className="h-[calc(100%-60px)]">
            <div className="p-2">
              {filteredSongs.map((song, index) => (
                <button
                  key={song.id}
                  onClick={() => {
                    setCurrentSong(index);
                    setIsPlaying(true);
                    setProgress([0]);
                  }}
                  className={`w-full p-3 rounded-lg flex items-center gap-3 hover:bg-accent/50 transition-colors ${
                    currentSong === index ? "bg-accent" : ""
                  }`}
                >
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium truncate">{song.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {song.artist}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {song.duration}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
