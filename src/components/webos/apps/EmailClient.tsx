import { useState } from "react";
import { Mail, Send, Inbox, Star, Trash2, Search, Plus, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Email {
  id: number;
  from: string;
  subject: string;
  preview: string;
  content: string;
  date: string;
  read: boolean;
  starred: boolean;
  folder: "inbox" | "sent" | "starred" | "trash";
}

export const EmailClient = () => {
  const [selectedFolder, setSelectedFolder] = useState<"inbox" | "sent" | "starred" | "trash">("inbox");
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [emails, setEmails] = useState<Email[]>([
    {
      id: 1,
      from: "john.doe@company.com",
      subject: "Project Update - Q1 Review",
      preview: "Hi team, I wanted to share the latest updates on our Q1 project progress...",
      content: "Hi team,\n\nI wanted to share the latest updates on our Q1 project progress. We've made significant strides in completing the core features and are on track for the deadline.\n\nKey achievements:\n- Completed user authentication module\n- Implemented dashboard analytics\n- Fixed 45 bugs from previous sprint\n\nBest regards,\nJohn",
      date: "2025-01-15",
      read: false,
      starred: true,
      folder: "inbox",
    },
    {
      id: 2,
      from: "newsletter@techweekly.com",
      subject: "This Week in Tech - Top Stories",
      preview: "Your weekly dose of technology news and insights...",
      content: "Welcome to this week's edition of Tech Weekly!\n\nTop stories this week:\n1. AI breakthrough in natural language processing\n2. New smartphone releases dominate the market\n3. Cybersecurity trends for 2025\n\nRead more on our website.",
      date: "2025-01-14",
      read: true,
      starred: false,
      folder: "inbox",
    },
    {
      id: 3,
      from: "support@novaos.com",
      subject: "Welcome to NovaOS!",
      preview: "Thank you for choosing NovaOS. Here's everything you need to get started...",
      content: "Welcome to NovaOS!\n\nWe're excited to have you on board. NovaOS offers a complete desktop experience right in your browser.\n\nGetting started:\n- Explore built-in apps\n- Customize your desktop\n- Install additional apps from Nova Store\n\nIf you need help, our support team is here 24/7.\n\nBest regards,\nThe NovaOS Team",
      date: "2025-01-13",
      read: true,
      starred: true,
      folder: "inbox",
    },
  ]);

  const currentEmail = emails.find((email) => email.id === selectedEmail);
  const filteredEmails = emails.filter(
    (email) =>
      email.folder === selectedFolder &&
      (email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.preview.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const unreadCount = emails.filter((e) => !e.read && e.folder === "inbox").length;

  const handleEmailClick = (id: number) => {
    setSelectedEmail(id);
    setIsComposing(false);
    setEmails(
      emails.map((email) =>
        email.id === id ? { ...email, read: true } : email
      )
    );
  };

  const handleToggleStar = (id: number) => {
    setEmails(
      emails.map((email) =>
        email.id === id ? { ...email, starred: !email.starred } : email
      )
    );
  };

  const handleDelete = (id: number) => {
    setEmails(
      emails.map((email) =>
        email.id === id ? { ...email, folder: "trash" } : email
      )
    );
    setSelectedEmail(null);
    toast.success("Email moved to trash");
  };

  const handleCompose = () => {
    setIsComposing(true);
    setSelectedEmail(null);
  };

  return (
    <div className="h-full flex bg-gradient-to-br from-blue-900/10 via-background to-indigo-900/10">
      {/* Sidebar */}
      <div className="w-64 border-r border-border/50 bg-background/30 backdrop-blur flex flex-col p-4">
        <Button onClick={handleCompose} className="w-full mb-6">
          <Plus className="h-4 w-4 mr-2" />
          Compose
        </Button>

        <div className="space-y-1 flex-1">
          <Button
            variant={selectedFolder === "inbox" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setSelectedFolder("inbox")}
          >
            <Inbox className="h-4 w-4 mr-2" />
            Inbox
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {unreadCount}
              </Badge>
            )}
          </Button>
          <Button
            variant={selectedFolder === "starred" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setSelectedFolder("starred")}
          >
            <Star className="h-4 w-4 mr-2" />
            Starred
          </Button>
          <Button
            variant={selectedFolder === "sent" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setSelectedFolder("sent")}
          >
            <Send className="h-4 w-4 mr-2" />
            Sent
          </Button>
          <Button
            variant={selectedFolder === "trash" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setSelectedFolder("trash")}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Trash
          </Button>
        </div>
      </div>

      {/* Email List */}
      <div className="w-96 border-r border-border/50 bg-background/20 backdrop-blur flex flex-col">
        <div className="p-4 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="divide-y divide-border/50">
            {filteredEmails.map((email) => (
              <button
                key={email.id}
                onClick={() => handleEmailClick(email.id)}
                className={`w-full p-4 text-left hover:bg-accent/50 transition-colors ${
                  selectedEmail === email.id ? "bg-accent" : ""
                } ${!email.read ? "font-semibold" : ""}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-sm truncate flex-1">{email.from}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStar(email.id);
                    }}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        email.starred ? "fill-yellow-500 text-yellow-500" : ""
                      }`}
                    />
                  </Button>
                </div>
                <h4 className="text-sm mb-1 truncate">{email.subject}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {email.preview}
                </p>
                <p className="text-xs text-muted-foreground mt-2">{email.date}</p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Email Content / Compose */}
      <div className="flex-1 flex flex-col">
        {isComposing ? (
          <div className="flex-1 flex flex-col p-6">
            <h2 className="text-2xl font-bold mb-6">New Message</h2>
            <div className="space-y-4 flex-1 flex flex-col">
              <Input placeholder="To" />
              <Input placeholder="Subject" />
              <Textarea
                placeholder="Write your message..."
                className="flex-1 resize-none"
              />
              <div className="flex items-center gap-2">
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
                <Button variant="outline">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach
                </Button>
                <Button variant="ghost" onClick={() => setIsComposing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : currentEmail ? (
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b border-border/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{currentEmail.subject}</h2>
                  <p className="text-sm text-muted-foreground">
                    From: {currentEmail.from}
                  </p>
                  <p className="text-xs text-muted-foreground">{currentEmail.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleStar(currentEmail.id)}
                  >
                    <Star
                      className={`h-5 w-5 ${
                        currentEmail.starred ? "fill-yellow-500 text-yellow-500" : ""
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(currentEmail.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {currentEmail.content.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </ScrollArea>

            <div className="p-6 border-t border-border/50">
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                Reply
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Mail className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select an email to read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
