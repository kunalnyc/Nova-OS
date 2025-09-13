import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Play, Plus, Star, Heart, Info } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string[];
  rating: number;
  duration: string;
  description: string;
  poster: string;
  category: 'trending' | 'recent' | 'popular' | 'bollywood' | 'hollywood';
  featured?: boolean;
}

const movies: Movie[] = [
  {
    id: '1',
    title: 'Sayiara',
    year: 2025,
    genre: ['Drama', 'Romance'],
    rating: 8.5,
    duration: '2h 15m',
    description: 'A captivating tale of love and destiny set in modern India.',
    poster: 'https://images.unsplash.com/photo-1489599828475-5a7ff0b18411?w=300&h=450&fit=crop',
    category: 'recent',
    featured: true
  },
  {
    id: '2',
    title: 'Ahaan',
    year: 2024,
    genre: ['Drama', 'Family'],
    rating: 8.2,
    duration: '2h 5m',
    description: 'An inspiring story of determination and family bonds.',
    poster: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&h=450&fit=crop',
    category: 'bollywood'
  },
  {
    id: '3',
    title: 'Aneet',
    year: 2024,
    genre: ['Thriller', 'Action'],
    rating: 7.8,
    duration: '2h 20m',
    description: 'A gripping thriller that keeps you on the edge of your seat.',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop',
    category: 'trending'
  },
  {
    id: '4',
    title: 'Mumbai Dreams',
    year: 2024,
    genre: ['Drama', 'Urban'],
    rating: 8.0,
    duration: '2h 10m',
    description: 'Stories from the heart of Mumbai that touch your soul.',
    poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
    category: 'bollywood'
  },
  {
    id: '5',
    title: 'The Last Kingdom',
    year: 2024,
    genre: ['Fantasy', 'Adventure'],
    rating: 9.1,
    duration: '2h 30m',
    description: 'Epic fantasy adventure in a world of magic and dragons.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop',
    category: 'hollywood',
    featured: true
  },
  {
    id: '6',
    title: 'Digital Horizons',
    year: 2025,
    genre: ['Sci-Fi', 'Thriller'],
    rating: 8.7,
    duration: '2h 18m',
    description: 'A futuristic thriller exploring AI and human consciousness.',
    poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop',
    category: 'recent'
  },
  {
    id: '7',
    title: 'Rajasthan Nights',
    year: 2024,
    genre: ['Romance', 'Musical'],
    rating: 7.9,
    duration: '2h 25m',
    description: 'A musical romance set against the backdrop of royal Rajasthan.',
    poster: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300&h=450&fit=crop',
    category: 'bollywood'
  },
  {
    id: '8',
    title: 'Ocean\'s Mystery',
    year: 2024,
    genre: ['Adventure', 'Mystery'],
    rating: 8.3,
    duration: '2h 8m',
    description: 'Deep sea adventure uncovering ancient mysteries.',
    poster: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=450&fit=crop',
    category: 'hollywood'
  }
];

const categories = [
  { id: 'all', name: 'All' },
  { id: 'trending', name: 'Trending' },
  { id: 'recent', name: 'Recent Releases' },
  { id: 'bollywood', name: 'Bollywood' },
  { id: 'hollywood', name: 'Hollywood' },
  { id: 'popular', name: 'Popular' }
];

export default function StreamingApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         movie.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || movie.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredMovie = movies.find(m => m.featured) || movies[0];

  return (
    <div className="h-full bg-background text-foreground overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">NovaFlix</h1>
          <div className="flex space-x-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="h-full">
        {/* Featured Section */}
        {!searchQuery && selectedCategory === 'all' && (
          <div className="relative h-80 mb-8">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${featuredMovie.poster})` 
              }}
            />
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <h2 className="text-4xl font-bold mb-2">{featuredMovie.title}</h2>
              <p className="text-lg mb-4 max-w-2xl">{featuredMovie.description}</p>
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="secondary">{featuredMovie.year}</Badge>
                <span className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  {featuredMovie.rating}
                </span>
                <span>{featuredMovie.duration}</span>
                <div className="flex space-x-1">
                  {featuredMovie.genre.map(genre => (
                    <Badge key={genre} variant="outline">{genre}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3">
                <Button size="lg" onClick={() => setSelectedMovie(featuredMovie)}>
                  <Play className="h-5 w-5 mr-2" />
                  Play Now
                </Button>
                <Button variant="outline" size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  My List
                </Button>
                <Button variant="outline" size="lg">
                  <Info className="h-5 w-5 mr-2" />
                  More Info
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Movies Grid */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">
            {searchQuery ? `Search Results (${filteredMovies.length})` : 
             selectedCategory === 'all' ? 'All Movies' : 
             categories.find(c => c.id === selectedCategory)?.name}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {filteredMovies.map(movie => (
              <Card 
                key={movie.id} 
                className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-0 bg-card/50"
                onClick={() => setSelectedMovie(movie)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                    <img 
                      src={movie.poster} 
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm font-medium mb-1">{movie.title}</p>
                      <div className="flex items-center justify-between text-xs text-white/80">
                        <span>{movie.year}</span>
                        <span className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 mr-1" />
                          {movie.rating}
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMovies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No movies found matching your search.</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-64 bg-cover bg-center" style={{ backgroundImage: `url(${selectedMovie.poster})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                <Button 
                  variant="ghost" 
                  className="absolute top-4 right-4 text-white hover:bg-white/20"
                  onClick={() => setSelectedMovie(null)}
                >
                  ✕
                </Button>
                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="text-3xl font-bold mb-2">{selectedMovie.title}</h2>
                  <div className="flex items-center space-x-4 text-sm">
                    <Badge variant="secondary">{selectedMovie.year}</Badge>
                    <span className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {selectedMovie.rating}
                    </span>
                    <span>{selectedMovie.duration}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedMovie.genre.map(genre => (
                    <Badge key={genre} variant="outline">{genre}</Badge>
                  ))}
                </div>
                
                <p className="text-muted-foreground mb-6">{selectedMovie.description}</p>
                
                <div className="flex space-x-3">
                  <Button size="lg">
                    <Play className="h-5 w-5 mr-2" />
                    Play Now
                  </Button>
                  <Button variant="outline" size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Add to My List
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="h-5 w-5 mr-2" />
                    Like
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}