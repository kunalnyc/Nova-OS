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
    title: 'Saiyaara',
    year: 2025,
    genre: ['Drama', 'Romance'],
    rating: 8.5,
    duration: '2h 30m',
    description: 'Vaani and Krish navigate life, problems, and insecurities to discover that love can be the answer to everything.',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
    category: 'recent',
    featured: true
  },
  {
    id: '2',
    title: 'Pathaan',
    year: 2023,
    genre: ['Action', 'Thriller'],
    rating: 8.2,
    duration: '2h 26m',
    description: 'An exiled RAW agent partners with his old nemeses to save the nation from a formidable threat.',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop',
    category: 'bollywood'
  },
  {
    id: '3',
    title: 'Jawan',
    year: 2023,
    genre: ['Action', 'Thriller'],
    rating: 8.5,
    duration: '2h 49m',
    description: 'A high-octane action thriller about a man driven by personal vendetta.',
    poster: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=300&h=450&fit=crop',
    category: 'trending'
  },
  {
    id: '4',
    title: 'Oppenheimer',
    year: 2023,
    genre: ['Biography', 'Drama', 'History'],
    rating: 9.0,
    duration: '3h 0m',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
    category: 'hollywood'
  },
  {
    id: '5',
    title: 'Barbie',
    year: 2023,
    genre: ['Comedy', 'Fantasy'],
    rating: 8.0,
    duration: '1h 54m',
    description: 'Barbie and Ken are having the time of their lives in the colorful and perfect world of Barbie Land.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop',
    category: 'hollywood',
    featured: true
  },
  {
    id: '6',
    title: 'Animal',
    year: 2023,
    genre: ['Action', 'Crime', 'Drama'],
    rating: 8.1,
    duration: '3h 21m',
    description: 'A son\'s love for his father leads him down a dark path of revenge and violence.',
    poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop',
    category: 'bollywood'
  },
  {
    id: '7',
    title: 'Scream VI',
    year: 2023,
    genre: ['Horror', 'Mystery', 'Thriller'],
    rating: 7.2,
    duration: '2h 3m',
    description: 'The survivors of the Ghostface killings leave Woodsboro behind and start a fresh chapter in New York City.',
    poster: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300&h=450&fit=crop',
    category: 'hollywood'
  },
  {
    id: '8',
    title: 'Dune: Part Two',
    year: 2024,
    genre: ['Action', 'Adventure', 'Drama'],
    rating: 8.8,
    duration: '2h 46m',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators.',
    poster: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=450&fit=crop',
    category: 'hollywood'
  },
  {
    id: '9',
    title: 'Bawaal',
    year: 2023,
    genre: ['Drama', 'Romance'],
    rating: 7.5,
    duration: '2h 17m',
    description: 'A couple\'s trip across Europe becomes a journey of self-discovery and understanding.',
    poster: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=450&fit=crop',
    category: 'bollywood'
  },
  {
    id: '10',
    title: 'Killers of the Flower Moon',
    year: 2023,
    genre: ['Crime', 'Drama', 'History'],
    rating: 8.4,
    duration: '3h 26m',
    description: 'Members of the Osage tribe are murdered under mysterious circumstances in the 1920s.',
    poster: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=300&h=450&fit=crop',
    category: 'hollywood'
  },
  {
    id: '11',
    title: 'Rocky Aur Rani Kii Prem Kahaani',
    year: 2023,
    genre: ['Comedy', 'Drama', 'Romance'],
    rating: 7.8,
    duration: '2h 48m',
    description: 'Rocky and Rani fall in love but face opposition from their families due to cultural differences.',
    poster: 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=300&h=450&fit=crop',
    category: 'bollywood'
  },
  {
    id: '12',
    title: 'Spider-Man: Across the Spider-Verse',
    year: 2023,
    genre: ['Animation', 'Action', 'Adventure'],
    rating: 9.0,
    duration: '2h 20m',
    description: 'Miles Morales catapults across the Multiverse and encounters various Spider-People.',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop',
    category: 'hollywood'
  },
  {
    id: '13',
    title: 'Gadar 2',
    year: 2023,
    genre: ['Action', 'Drama', 'Romance'],
    rating: 7.9,
    duration: '2h 50m',
    description: 'Tara Singh goes to Pakistan to rescue his son Jeete who is captured by Pakistani forces.',
    poster: 'https://images.unsplash.com/photo-1489599828475-5a7ff0b18411?w=300&h=450&fit=crop',
    category: 'bollywood'
  },
  {
    id: '14',
    title: 'Guardians of the Galaxy Vol. 3',
    year: 2023,
    genre: ['Action', 'Adventure', 'Comedy'],
    rating: 8.2,
    duration: '2h 30m',
    description: 'The Guardians embark on a mission to protect one of their own and face their past.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop',
    category: 'hollywood'
  },
  {
    id: '15',
    title: 'OMG 2',
    year: 2023,
    genre: ['Comedy', 'Drama'],
    rating: 8.1,
    duration: '2h 21m',
    description: 'A satirical comedy-drama about sex education and societal taboos.',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop',
    category: 'bollywood'
  },
  {
    id: '16',
    title: 'Fast X',
    year: 2023,
    genre: ['Action', 'Crime', 'Thriller'],
    rating: 7.1,
    duration: '2h 21m',
    description: 'Dom Toretto and his family face their most lethal adversary yet.',
    poster: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&h=450&fit=crop',
    category: 'hollywood'
  },
  {
    id: '17',
    title: '12th Fail',
    year: 2023,
    genre: ['Biography', 'Drama'],
    rating: 9.2,
    duration: '2h 27m',
    description: 'The real-life story of IPS officer Manoj Kumar Sharma\'s journey from failure to success.',
    poster: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=450&fit=crop',
    category: 'bollywood'
  },
  {
    id: '18',
    title: 'The Super Mario Bros. Movie',
    year: 2023,
    genre: ['Animation', 'Adventure', 'Comedy'],
    rating: 7.5,
    duration: '1h 32m',
    description: 'A plumber named Mario travels through an underground labyrinth with his brother Luigi.',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop',
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