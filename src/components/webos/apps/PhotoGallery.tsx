import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Download, 
  Heart, 
  Eye,
  Grid3X3,
  List,
  Loader2,
  Camera,
  Mountain,
  TreePine,
  Car,
  Building,
  Users,
  Utensils,
  Gamepad2,
  Sparkles
} from "lucide-react";

interface UnsplashPhoto {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
  };
  likes: number;
  views?: number;
  description: string;
  color: string;
}

const categories = [
  { id: "all", name: "All Photos", icon: Grid3X3 },
  { id: "nature", name: "Nature", icon: TreePine },
  { id: "architecture", name: "Architecture", icon: Building },
  { id: "people", name: "People", icon: Users },
  { id: "food", name: "Food", icon: Utensils },
  { id: "travel", name: "Travel", icon: Camera },
  { id: "cars", name: "Cars", icon: Car },
  { id: "landscape", name: "Landscape", icon: Mountain },
  { id: "gaming", name: "Gaming", icon: Gamepad2 },
  { id: "hot", name: "Hot & Trending", icon: Sparkles },
];

// Demo photos with hot/spicy category
const demoPhotos: UnsplashPhoto[] = [
  {
    id: "demo-1",
    urls: {
      small: "https://images.unsplash.com/photo-1525904097878-94fb15835963?w=400",
      regular: "https://images.unsplash.com/photo-1525904097878-94fb15835963?w=800",
      full: "https://images.unsplash.com/photo-1525904097878-94fb15835963?w=1600"
    },
    alt_description: "Spicy red peppers and chili",
    user: { name: "Demo User", username: "demo" },
    likes: 1234,
    views: 5678,
    description: "Hot and spicy red chili peppers",
    color: "#ff4444"
  },
  {
    id: "demo-2", 
    urls: {
      small: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      regular: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800", 
      full: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600"
    },
    alt_description: "Hot sauce and spicy food",
    user: { name: "Spice Master", username: "spicemaster" },
    likes: 2345,
    views: 8901,
    description: "Fiery hot sauce collection",
    color: "#cc3333"
  },
  {
    id: "demo-3",
    urls: {
      small: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
      regular: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
      full: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600"
    },
    alt_description: "Delicious spicy burger",
    user: { name: "Food Lover", username: "foodie" },
    likes: 3456,
    views: 12345,
    description: "Spicy burger with hot peppers",
    color: "#dd5533"
  }
];

export const PhotoGallery = () => {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>(demoPhotos);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPhoto, setSelectedPhoto] = useState<UnsplashPhoto | null>(null);

  // Simulate API call with demo data
  const fetchPhotos = async (query: string = "", category: string = "all") => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let resultPhotos = [...demoPhotos];
    
    // Add category-specific demo photos
    if (category === "hot") {
      resultPhotos = demoPhotos;
    } else if (category === "cars") {
      resultPhotos = [
        {
          id: "car-1",
          urls: {
            small: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
            regular: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
            full: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600"
          },
          alt_description: "Red sports car",
          user: { name: "Car Enthusiast", username: "carenthusiast" },
          likes: 1890,
          description: "Beautiful red sports car",
          color: "#cc0000"
        },
        {
          id: "car-2",
          urls: {
            small: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400",
            regular: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
            full: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600"
          },
          alt_description: "Classic blue car",
          user: { name: "Vintage Cars", username: "vintagecars" },
          likes: 2340,
          description: "Classic vintage blue automobile",
          color: "#0066cc"
        }
      ];
    } else if (category === "nature") {
      resultPhotos = [
        {
          id: "nature-1",
          urls: {
            small: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
            regular: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
            full: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600"
          },
          alt_description: "Mountain landscape",
          user: { name: "Nature Photographer", username: "naturephotographer" },
          likes: 4567,
          description: "Stunning mountain landscape view",
          color: "#228B22"
        }
      ];
    }

    // Filter by search query
    if (query) {
      resultPhotos = resultPhotos.filter(photo => 
        photo.alt_description?.toLowerCase().includes(query.toLowerCase()) ||
        photo.description?.toLowerCase().includes(query.toLowerCase())
      );
    }

    setPhotos(resultPhotos);
    setLoading(false);
  };

  useEffect(() => {
    fetchPhotos(searchQuery, selectedCategory);
  }, [selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPhotos(searchQuery, selectedCategory);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery("");
  };

  return (
    <div className="h-full flex flex-col bg-gradient-surface">
      {/* Header */}
      <div className="glass p-4 border-b border-glass-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Camera className="w-6 h-6 text-primary" />
            Photo Gallery
          </h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="transition-smooth"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="transition-smooth"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass border-glass-border bg-transparent"
            />
          </div>
          <Button type="submit" className="gradient-primary">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </form>

        {/* Categories */}
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                size="sm"
                className={`flex-shrink-0 transition-smooth ${
                  selectedCategory === category.id 
                    ? 'gradient-primary' 
                    : 'hover:bg-white/10'
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                <category.icon className="w-4 h-4 mr-1" />
                {category.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Photos Content */}
      <div className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-muted-foreground">Loading amazing photos...</p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <Dialog key={photo.id}>
                    <DialogTrigger asChild>
                      <div className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg aspect-square">
                          <img
                            src={photo.urls.small}
                            alt={photo.alt_description}
                            className="w-full h-full object-cover transition-spring group-hover:scale-110"
                            style={{ backgroundColor: photo.color }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-smooth">
                            <div className="absolute bottom-2 left-2 right-2">
                              <div className="flex items-center justify-between text-white text-sm">
                                <span className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  {photo.likes}
                                </span>
                                <Eye className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-foreground truncate">
                            {photo.alt_description || "Untitled"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            by {photo.user.name}
                          </p>
                        </div>
                      </div>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-4xl h-[80vh] glass border-glass-border">
                      <div className="flex flex-col h-full">
                        <div className="flex-1 flex items-center justify-center">
                          <img
                            src={photo.urls.regular}
                            alt={photo.alt_description}
                            className="max-w-full max-h-full object-contain rounded-lg"
                          />
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {photo.alt_description || "Untitled"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              by {photo.user.name} (@{photo.user.username})
                            </p>
                            {photo.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {photo.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {photo.likes}
                            </span>
                            {photo.views && (
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {photo.views}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="flex gap-4 glass p-4 rounded-lg">
                    <img
                      src={photo.urls.small}
                      alt={photo.alt_description}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      style={{ backgroundColor: photo.color }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {photo.alt_description || "Untitled"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        by {photo.user.name} (@{photo.user.username})
                      </p>
                      {photo.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {photo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {photo.likes}
                        </span>
                        {photo.views && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {photo.views}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {photos.length === 0 && !loading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No photos found</h3>
                  <p className="text-muted-foreground">
                    Try a different search term or category
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        )}
      </div>

      {/* Footer */}
      <div className="glass p-3 border-t border-glass-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{photos.length} photos</span>
          <span>Gallery • NovaOS</span>
        </div>
      </div>
    </div>
  );
};