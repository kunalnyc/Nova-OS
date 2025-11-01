import { useState } from "react";
import { Plus, Search, Trash2, Star, Folder, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  favorite: boolean;
  category: string;
}

export const NotesApp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<number | null>(1);
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "Welcome to Notes",
      content: "This is your personal note-taking app. Start writing your ideas, tasks, and thoughts here!",
      date: "2025-01-15",
      favorite: true,
      category: "Personal",
    },
    {
      id: 2,
      title: "Project Ideas",
      content: "1. Build a task manager\n2. Create a blog\n3. Design a portfolio website",
      date: "2025-01-14",
      favorite: false,
      category: "Work",
    },
    {
      id: 3,
      title: "Meeting Notes",
      content: "Discuss Q1 goals, review project timeline, assign tasks to team members.",
      date: "2025-01-13",
      favorite: false,
      category: "Work",
    },
  ]);

  const currentNote = notes.find((note) => note.id === selectedNote);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: "Untitled Note",
      content: "",
      date: new Date().toISOString().split("T")[0],
      favorite: false,
      category: "Personal",
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote.id);
    toast.success("New note created");
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (selectedNote === id) {
      setSelectedNote(notes[0]?.id || null);
    }
    toast.success("Note deleted");
  };

  const handleToggleFavorite = (id: number) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, favorite: !note.favorite } : note
      )
    );
  };

  const handleUpdateNote = (field: "title" | "content", value: string) => {
    if (!selectedNote) return;
    setNotes(
      notes.map((note) =>
        note.id === selectedNote ? { ...note, [field]: value } : note
      )
    );
  };

  return (
    <div className="h-full flex bg-gradient-to-br from-amber-900/10 via-background to-orange-900/10">
      {/* Sidebar */}
      <div className="w-80 border-r border-border/50 bg-background/30 backdrop-blur flex flex-col">
        <div className="p-4 border-b border-border/50 space-y-3">
          <div className="flex items-center gap-2">
            <StickyNote className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Notes</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
          <Button onClick={handleCreateNote} className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => setSelectedNote(note.id)}
                className={`w-full p-3 rounded-lg text-left hover:bg-accent/50 transition-colors ${
                  selectedNote === note.id ? "bg-accent" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold truncate flex-1">{note.title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(note.id);
                    }}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        note.favorite ? "fill-yellow-500 text-yellow-500" : ""
                      }`}
                    />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {note.content || "Empty note"}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Folder className="h-3 w-3" />
                  <span>{note.category}</span>
                  <span>•</span>
                  <span>{note.date}</span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {currentNote ? (
          <>
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Input
                  value={currentNote.title}
                  onChange={(e) => handleUpdateNote("title", e.target.value)}
                  className="text-2xl font-bold border-none bg-transparent focus-visible:ring-0 px-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleFavorite(currentNote.id)}
                >
                  <Star
                    className={`h-5 w-5 ${
                      currentNote.favorite ? "fill-yellow-500 text-yellow-500" : ""
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteNote(currentNote.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 p-6">
              <Textarea
                value={currentNote.content}
                onChange={(e) => handleUpdateNote("content", e.target.value)}
                placeholder="Start typing..."
                className="h-full resize-none border-none bg-transparent focus-visible:ring-0 text-base"
              />
            </div>

            <div className="p-4 border-t border-border/50 text-sm text-muted-foreground">
              Last edited: {currentNote.date}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <StickyNote className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a note or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
