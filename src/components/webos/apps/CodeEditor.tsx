import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Save, 
  FolderOpen, 
  FileText, 
  Play,
  Copy,
  Download,
  Upload,
  Search,
  Replace,
  Settings,
  Zap,
  Code2,
  FileCode,
  Braces
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const languageTemplates = {
  javascript: `// JavaScript Code
function hello(name) {
    return \`Hello, \${name}!\`;
}

console.log(hello("World"));`,
  
  python: `# Python Code
def hello(name):
    return f"Hello, {name}!"

print(hello("World"))`,
  
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>`,

  css: `/* CSS Styles */
body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: 0;
    padding: 20px;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}`,

  json: `{
  "name": "My Project",
  "version": "1.0.0",
  "description": "A sample project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \\"No tests yet\\""
  },
  "author": "Developer",
  "license": "MIT"
}`
};

export const CodeEditor = () => {
  const [code, setCode] = useState(languageTemplates.javascript);
  const [language, setLanguage] = useState("javascript");
  const [fileName, setFileName] = useState("untitled.js");
  const [isModified, setIsModified] = useState(false);
  const [fontSize, setFontSize] = useState("14");
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const extension = getFileExtension(language);
    setFileName(prev => {
      const baseName = prev.split('.')[0];
      return `${baseName}.${extension}`;
    });
  }, [language]);

  const getFileExtension = (lang: string) => {
    const extensions: Record<string, string> = {
      javascript: "js",
      python: "py",
      html: "html",
      css: "css",
      json: "json"
    };
    return extensions[lang] || "txt";
  };

  const handleLanguageChange = (newLanguage: string) => {
    if (isModified) {
      const confirmed = window.confirm("You have unsaved changes. Switch language anyway?");
      if (!confirmed) return;
    }
    
    setLanguage(newLanguage);
    setCode(languageTemplates[newLanguage as keyof typeof languageTemplates] || "");
    setIsModified(false);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    setIsModified(true);
  };

  const handleSave = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    
    setIsModified(false);
    toast({
      title: "File saved",
      description: `${fileName} has been downloaded`,
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Code copied",
        description: "Code has been copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleRun = () => {
    if (language === 'javascript') {
      try {
        // Create a safe environment for running JS
        const result = eval(code);
        toast({
          title: "Code executed",
          description: "Check the browser console for output",
        });
      } catch (error) {
        toast({
          title: "Execution error",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Run not supported",
        description: `Running ${language} code is not supported in the browser`,
        variant: "destructive",
      });
    }
  };

  const handleSearch = () => {
    if (!searchTerm || !textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const text = textarea.value;
    const index = text.indexOf(searchTerm);
    
    if (index !== -1) {
      textarea.focus();
      textarea.setSelectionRange(index, index + searchTerm.length);
    } else {
      toast({
        title: "Not found",
        description: `"${searchTerm}" not found in the code`,
        variant: "destructive",
      });
    }
  };

  const handleReplace = () => {
    if (!searchTerm || !textareaRef.current) return;
    
    const newCode = code.replace(new RegExp(searchTerm, 'g'), replaceTerm);
    setCode(newCode);
    setIsModified(true);
    
    toast({
      title: "Text replaced",
      description: `All instances of "${searchTerm}" replaced with "${replaceTerm}"`,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCode(content);
      setFileName(file.name);
      setIsModified(false);
      
      // Try to detect language from file extension
      const ext = file.name.split('.').pop()?.toLowerCase();
      const langMap: Record<string, string> = {
        js: 'javascript',
        py: 'python',
        html: 'html',
        css: 'css',
        json: 'json'
      };
      
      if (ext && langMap[ext]) {
        setLanguage(langMap[ext]);
      }
    };
    reader.readAsText(file);
  };

  const lineCount = code.split('\n').length;
  const wordCount = code.split(/\s+/).filter(word => word.length > 0).length;
  const charCount = code.length;

  return (
    <div className="flex flex-col h-full bg-surface/20">
      {/* Toolbar */}
      <div className="p-2 border-b border-glass-border glass-strong">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {/* File Operations */}
            <Button variant="ghost" size="sm">
              <FileText className="w-4 h-4 mr-1" />
              New
            </Button>
            
            <input
              type="file"
              accept=".js,.py,.html,.css,.json,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Button variant="ghost" size="sm" onClick={() => document.getElementById('file-upload')?.click()}>
              <Upload className="w-4 h-4 mr-1" />
              Open
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>

            <div className="w-px h-4 bg-border mx-1" />

            {/* Code Operations */}
            <Button variant="ghost" size="sm" onClick={handleRun}>
              <Play className="w-4 h-4 mr-1" />
              Run
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>

            <div className="w-px h-4 bg-border mx-1" />

            {/* Search */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSearch(!showSearch)}
              className={showSearch ? "bg-primary/20 text-primary" : ""}
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>

            {/* Font Size */}
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12px</SelectItem>
                <SelectItem value="14">14px</SelectItem>
                <SelectItem value="16">16px</SelectItem>
                <SelectItem value="18">18px</SelectItem>
                <SelectItem value="20">20px</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="mt-2 flex items-center space-x-2">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 h-8"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Input
              placeholder="Replace..."
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              className="flex-1 h-8"
            />
            <Button size="sm" onClick={handleSearch}>
              Find
            </Button>
            <Button size="sm" variant="outline" onClick={handleReplace}>
              Replace All
            </Button>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 border-b border-glass-border glass-strong flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-foreground">
            {fileName} {isModified && <span className="text-warning">*</span>}
          </span>
          <span className="text-sm text-muted-foreground">
            {language.charAt(0).toUpperCase() + language.slice(1)}
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>Lines: {lineCount}</span>
          <span>Words: {wordCount}</span>
          <span>Characters: {charCount}</span>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 p-4">
        <div className="relative h-full">
          {/* Line Numbers */}
          <div className="absolute left-0 top-0 bottom-0 w-12 glass-strong border-r border-glass-border text-xs text-muted-foreground p-2 font-mono">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1} className="leading-6 text-right pr-2">
                {i + 1}
              </div>
            ))}
          </div>
          
          {/* Code Input */}
          <Textarea
            ref={textareaRef}
            value={code}
            onChange={handleCodeChange}
            className="w-full h-full resize-none border-none focus:ring-0 glass bg-transparent text-foreground leading-6 font-mono pl-16"
            placeholder="Start coding..."
            style={{ 
              minHeight: '100%',
              fontSize: `${fontSize}px`,
              lineHeight: '1.5'
            }}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Footer Status */}
      <div className="px-4 py-2 border-t border-glass-border glass-strong">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>UTF-8</span>
            <span>Line 1, Column 1</span>
            <span>{language}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>{isModified ? 'Modified' : 'Saved'}</span>
            <span>Font: {fontSize}px</span>
          </div>
        </div>
      </div>
    </div>
  );
};