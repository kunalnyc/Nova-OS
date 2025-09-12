import { useState } from "react";
import { Search, Download, Star, Users, Calendar, Gamepad2, Code, Music, Image, FileText, Calculator, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StoreApp {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  rating: number;
  downloads: string;
  price: string;
  screenshots: string[];
  featured: boolean;
}

const storeApps: StoreApp[] = [
  {
    id: "tic-tac-toe",
    name: "Tic Tac Toe",
    description: "Classic Tic Tac Toe game with beautiful UI and smooth animations",
    icon: Gamepad2,
    category: "Games",
    rating: 4.8,
    downloads: "125K",
    price: "Free",
    screenshots: [],
    featured: true
  },
  {
    id: "chess",
    name: "Nova Chess",
    description: "Professional chess game with AI opponent and multiplayer support",
    icon: Gamepad2,
    category: "Games", 
    rating: 4.9,
    downloads: "89K",
    price: "Free",
    screenshots: [],
    featured: true
  },
  {
    id: "code-studio",
    name: "Code Studio Pro",
    description: "Advanced code editor with syntax highlighting and git integration",
    icon: Code,
    category: "Developer Tools",
    rating: 4.7,
    downloads: "245K",
    price: "$9.99",
    screenshots: [],
    featured: false
  },
  {
    id: "music-player",
    name: "Nova Music",
    description: "Beautiful music player with equalizer and playlist support",
    icon: Music,
    category: "Entertainment",
    rating: 4.6,
    downloads: "156K", 
    price: "Free",
    screenshots: [],
    featured: false
  },
  {
    id: "photo-editor",
    name: "Photo Studio",
    description: "Professional photo editing with filters and effects",
    icon: Image,
    category: "Graphics",
    rating: 4.5,
    downloads: "201K",
    price: "$4.99",
    screenshots: [],
    featured: true
  },
  {
    id: "note-keeper",
    name: "Smart Notes",
    description: "Organize your thoughts with rich text editor and cloud sync",
    icon: FileText,
    category: "Productivity",
    rating: 4.8,
    downloads: "178K",
    price: "Free",
    screenshots: [],
    featured: false
  }
];

const categories = ["All", "Games", "Productivity", "Developer Tools", "Entertainment", "Graphics"];

export const NovaStore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedApp, setSelectedApp] = useState<StoreApp | null>(null);

  const filteredApps = storeApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredApps = storeApps.filter(app => app.featured);

  const handleInstall = (app: StoreApp) => {
    // Simulate installation
    console.log(`Installing ${app.name}...`);
  };

  if (selectedApp) {
    return (
      <div className="h-full bg-background text-foreground p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedApp(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to Store
          </Button>
        </div>

        <div className="flex gap-6">
          <div className="w-32 h-32 glass rounded-2xl flex items-center justify-center">
            <selectedApp.icon className="w-16 h-16 text-primary" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{selectedApp.name}</h1>
                <p className="text-muted-foreground text-lg mb-4">{selectedApp.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="font-medium">{selectedApp.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{selectedApp.downloads} downloads</span>
                  </div>
                  <Badge variant="secondary">{selectedApp.category}</Badge>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-primary mb-2">{selectedApp.price}</div>
                <Button onClick={() => handleInstall(selectedApp)} className="w-32">
                  <Download className="w-4 h-4 mr-2" />
                  Install
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">About this app</h3>
          <p className="text-muted-foreground leading-relaxed">
            {selectedApp.description} This application provides a seamless experience with modern design
            and intuitive controls. Perfect for users looking for quality software that enhances productivity
            and entertainment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background text-foreground">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Nova Store</h1>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Last updated today</span>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="featured" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="all">All Apps</TabsTrigger>
            <TabsTrigger value="installed">Installed</TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Featured Apps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredApps.map((app) => (
                <Card 
                  key={app.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow glass"
                  onClick={() => setSelectedApp(app)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 glass rounded-xl flex items-center justify-center">
                        <app.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{app.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-primary text-primary" />
                            <span className="text-xs">{app.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{app.downloads}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm text-primary">{app.price}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm line-clamp-2">
                      {app.description}
                    </CardDescription>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="outline" className="text-xs">{app.category}</Badge>
                      <Button size="sm" variant="ghost">
                        <Download className="w-3 h-3 mr-1" />
                        Install
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">All Apps ({filteredApps.length})</h2>
            <div className="space-y-4">
              {filteredApps.map((app) => (
                <Card 
                  key={app.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow glass"
                  onClick={() => setSelectedApp(app)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 glass rounded-xl flex items-center justify-center">
                        <app.icon className="w-8 h-8 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{app.name}</h3>
                            <p className="text-muted-foreground text-sm mb-2">{app.description}</p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-primary text-primary" />
                                <span className="text-sm">{app.rating}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">{app.downloads} downloads</span>
                              <Badge variant="outline">{app.category}</Badge>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold text-primary mb-2">{app.price}</div>
                            <Button onClick={(e) => {
                              e.stopPropagation();
                              handleInstall(app);
                            }}>
                              <Download className="w-4 h-4 mr-2" />
                              Install
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="installed" className="mt-6">
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No apps installed yet</h3>
              <p className="text-muted-foreground">Browse the store to find and install amazing apps!</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};