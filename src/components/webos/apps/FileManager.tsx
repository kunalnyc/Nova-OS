import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Folder, 
  File, 
  FolderOpen, 
  Home, 
  HardDrive, 
  Image, 
  FileText, 
  Music, 
  Video,
  Search,
  ArrowLeft,
  ArrowRight,
  Grid3X3,
  List,
  Upload,
  Download,
  Trash2,
  Copy,
  Plus
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified: string;
  icon?: any;
}

const sampleFiles: FileItem[] = [
  { id: '1', name: 'Documents', type: 'folder', modified: '2024-01-15' },
  { id: '2', name: 'Pictures', type: 'folder', modified: '2024-01-14' },
  { id: '3', name: 'Music', type: 'folder', modified: '2024-01-13' },
  { id: '4', name: 'Videos', type: 'folder', modified: '2024-01-12' },
  { id: '5', name: 'Downloads', type: 'folder', modified: '2024-01-11' },
  { id: '6', name: 'README.txt', type: 'file', size: '1.2 KB', modified: '2024-01-10', icon: FileText },
  { id: '7', name: 'image.jpg', type: 'file', size: '2.5 MB', modified: '2024-01-09', icon: Image },
  { id: '8', name: 'song.mp3', type: 'file', size: '4.1 MB', modified: '2024-01-08', icon: Music },
  { id: '9', name: 'video.mp4', type: 'file', size: '15.3 MB', modified: '2024-01-07', icon: Video },
];

export const FileManager = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFiles = sampleFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') {
      return <Folder className="w-8 h-8 text-primary" />;
    }
    
    if (item.icon) {
      const IconComponent = item.icon;
      return <IconComponent className="w-8 h-8 text-accent" />;
    }
    
    return <File className="w-8 h-8 text-muted-foreground" />;
  };

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath(`${currentPath}${item.name}/`);
    }
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="flex h-full bg-surface/30">
      {/* Sidebar */}
      <div className="w-48 glass-strong border-r border-glass-border p-4">
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <HardDrive className="w-4 h-4 mr-2" />
            System
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Folder className="w-4 h-4 mr-2" />
            Documents
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Image className="w-4 h-4 mr-2" />
            Pictures
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Music className="w-4 h-4 mr-2" />
            Music
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Video className="w-4 h-4 mr-2" />
            Videos
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Downloads
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Trash
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-glass-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ArrowRight className="w-4 h-4" />
              </Button>
              <div className="text-sm text-muted-foreground">
                {currentPath}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Upload className="w-4 h-4" />
              </Button>
              <div className="w-px h-4 bg-border" />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-primary/20 text-primary' : ''}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-primary/20 text-primary' : ''}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 glass border-glass-border bg-transparent"
            />
          </div>
        </div>

        {/* File Grid/List */}
        <div className="flex-1 p-4 overflow-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-6 gap-4">
              {filteredFiles.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-white/5 transition-smooth ${
                    selectedItems.includes(item.id) ? 'bg-primary/10 ring-2 ring-primary/50' : ''
                  }`}
                  onClick={() => handleItemClick(item)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleItemSelect(item.id);
                  }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-2">
                      {getFileIcon(item)}
                    </div>
                    <span className="text-sm text-foreground truncate w-full">
                      {item.name}
                    </span>
                    {item.size && (
                      <span className="text-xs text-muted-foreground">
                        {item.size}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              <div className="grid grid-cols-4 gap-4 p-2 text-sm font-medium text-muted-foreground border-b border-glass-border">
                <span>Name</span>
                <span>Size</span>
                <span>Modified</span>
                <span>Type</span>
              </div>
              {filteredFiles.map((item) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-4 gap-4 p-2 rounded-md cursor-pointer hover:bg-white/5 transition-smooth ${
                    selectedItems.includes(item.id) ? 'bg-primary/10' : ''
                  }`}
                  onClick={() => handleItemClick(item)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleItemSelect(item.id);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                      {item.type === 'folder' ? (
                        <Folder className="w-4 h-4 text-primary" />
                      ) : (
                        <File className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-sm text-foreground truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.size || '--'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {item.modified}
                  </span>
                  <span className="text-sm text-muted-foreground capitalize">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="p-2 border-t border-glass-border text-sm text-muted-foreground flex justify-between">
          <span>{filteredFiles.length} items</span>
          <span>{selectedItems.length} selected</span>
        </div>
      </div>
    </div>
  );
};