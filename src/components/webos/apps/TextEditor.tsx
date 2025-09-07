import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Save, 
  FolderOpen, 
  FileText, 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Undo,
  Redo,
  Search,
  Replace,
  Printer
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export const TextEditor = () => {
  const [content, setContent] = useState(`# Welcome to WebOS Text Editor

This is a modern text editor built for the web operating system. You can:

- Create and edit documents
- Format text with rich text features
- Save and open files
- Search and replace text
- Print documents

## Features

### Basic Editing
- Type anywhere in this document
- Use keyboard shortcuts for common actions
- Auto-save functionality

### Formatting Options
- **Bold text**
- *Italic text*  
- Underlined text
- Different text alignments

### File Operations
- New document
- Open existing files
- Save current document
- Export in various formats

Start typing to edit this document!`);

  const [isModified, setIsModified] = useState(false);
  const [fileName, setFileName] = useState("Untitled.txt");

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsModified(true);
  };

  const handleSave = () => {
    // Simulate save operation
    setIsModified(false);
    console.log("Document saved");
  };

  const handleNew = () => {
    if (isModified) {
      const confirmNew = window.confirm("You have unsaved changes. Create new document anyway?");
      if (!confirmNew) return;
    }
    
    setContent("");
    setFileName("Untitled.txt");
    setIsModified(false);
  };

  return (
    <div className="flex flex-col h-full bg-surface/20">
      {/* Menu Bar */}
      <div className="p-2 border-b border-glass-border glass-strong">
        <div className="flex items-center space-x-1">
          {/* File Operations */}
          <Button variant="ghost" size="sm" onClick={handleNew}>
            <FileText className="w-4 h-4 mr-1" />
            New
          </Button>
          <Button variant="ghost" size="sm">
            <FolderOpen className="w-4 h-4 mr-1" />
            Open
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          
          <div className="w-px h-4 bg-border mx-1" />
          
          {/* Edit Operations */}
          <Button variant="ghost" size="sm">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Redo className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-4 bg-border mx-1" />
          
          {/* Formatting */}
          <Button variant="ghost" size="sm">
            <Bold className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Italic className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Underline className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-4 bg-border mx-1" />
          
          {/* Alignment */}
          <Button variant="ghost" size="sm">
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <AlignRight className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-4 bg-border mx-1" />
          
          {/* Lists */}
          <Button variant="ghost" size="sm">
            <List className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <ListOrdered className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-4 bg-border mx-1" />
          
          {/* Tools */}
          <Button variant="ghost" size="sm">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Replace className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 border-b border-glass-border glass-strong flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-foreground">
            {fileName} {isModified && <span className="text-warning">*</span>}
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>Lines: {content.split('\n').length}</span>
          <span>Words: {content.split(/\s+/).filter(word => word.length > 0).length}</span>
          <span>Characters: {content.length}</span>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 p-4">
        <Textarea
          value={content}
          onChange={handleContentChange}
          className="w-full h-full resize-none border-none focus:ring-0 glass bg-transparent text-foreground text-sm leading-relaxed font-mono"
          placeholder="Start typing your document..."
          style={{ minHeight: '100%' }}
        />
      </div>

      {/* Footer Status */}
      <div className="px-4 py-2 border-t border-glass-border glass-strong">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>UTF-8</span>
            <span>Line 1, Column 1</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Plain Text</span>
            <span>{isModified ? 'Modified' : 'Saved'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};