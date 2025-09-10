import { useEffect } from "react";
import { NovaOS } from "@/components/NovaOS";

const Index = () => {
  // Prevent default right-click context menu globally
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Only prevent default if not on input elements
      const target = e.target as HTMLElement;
      if (!target.matches('input, textarea, [contenteditable="true"]')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return <NovaOS />;
};

export default Index;
