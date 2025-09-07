import { useState, useRef, useEffect } from "react";
import { Window } from "./types";
import { X, Minus, Square, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WindowManagerProps {
  windows: Window[];
  activeWindowId: string | null;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Window>) => void;
}

export const WindowManager = ({
  windows,
  activeWindowId,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdate,
}: WindowManagerProps) => {
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    windowId: string | null;
    offset: { x: number; y: number };
  }>({
    isDragging: false,
    windowId: null,
    offset: { x: 0, y: 0 },
  });

  const [resizeState, setResizeState] = useState<{
    isResizing: boolean;
    windowId: string | null;
    edge: string;
    startPos: { x: number; y: number };
    startSize: { width: number; height: number };
  }>({
    isResizing: false,
    windowId: null,
    edge: '',
    startPos: { x: 0, y: 0 },
    startSize: { width: 0, height: 0 },
  });

  // Handle mouse events for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragState.isDragging && dragState.windowId) {
        const newPosition = {
          x: e.clientX - dragState.offset.x,
          y: Math.max(0, e.clientY - dragState.offset.y),
        };
        onUpdate(dragState.windowId, { position: newPosition });
      }

      if (resizeState.isResizing && resizeState.windowId) {
        const deltaX = e.clientX - resizeState.startPos.x;
        const deltaY = e.clientY - resizeState.startPos.y;

        let newSize = { ...resizeState.startSize };
        let newPosition: { x: number; y: number } | undefined;

        const window = windows.find(w => w.id === resizeState.windowId);
        if (!window) return;

        if (resizeState.edge.includes('right')) {
          newSize.width = Math.max(300, resizeState.startSize.width + deltaX);
        }
        if (resizeState.edge.includes('left')) {
          newSize.width = Math.max(300, resizeState.startSize.width - deltaX);
          newPosition = { ...window.position, x: window.position.x + deltaX };
        }
        if (resizeState.edge.includes('bottom')) {
          newSize.height = Math.max(200, resizeState.startSize.height + deltaY);
        }
        if (resizeState.edge.includes('top')) {
          newSize.height = Math.max(200, resizeState.startSize.height - deltaY);
          newPosition = { ...window.position, y: Math.max(0, window.position.y + deltaY) };
        }

        const updates: Partial<Window> = { size: newSize };
        if (newPosition) updates.position = newPosition;

        onUpdate(resizeState.windowId, updates);
      }
    };

    const handleMouseUp = () => {
      setDragState({ isDragging: false, windowId: null, offset: { x: 0, y: 0 } });
      setResizeState({
        isResizing: false,
        windowId: null,
        edge: '',
        startPos: { x: 0, y: 0 },
        startSize: { width: 0, height: 0 },
      });
    };

    if (dragState.isDragging || resizeState.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, resizeState, onUpdate, windows]);

  const handleTitleBarMouseDown = (e: React.MouseEvent, windowId: string) => {
    if (e.button !== 0) return; // Only left click
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragState({
      isDragging: true,
      windowId,
      offset: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    });
    onFocus(windowId);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, windowId: string, edge: string) => {
    e.stopPropagation();
    
    const window = windows.find(w => w.id === windowId);
    if (!window) return;

    setResizeState({
      isResizing: true,
      windowId,
      edge,
      startPos: { x: e.clientX, y: e.clientY },
      startSize: window.size,
    });
  };

  const getResizeCursor = (edge: string) => {
    if (edge.includes('top') && edge.includes('left')) return 'nw-resize';
    if (edge.includes('top') && edge.includes('right')) return 'ne-resize';
    if (edge.includes('bottom') && edge.includes('left')) return 'sw-resize';
    if (edge.includes('bottom') && edge.includes('right')) return 'se-resize';
    if (edge.includes('top') || edge.includes('bottom')) return 'ns-resize';
    if (edge.includes('left') || edge.includes('right')) return 'ew-resize';
    return 'default';
  };

  return (
    <>
      {windows.map((window) => (
        <div
          key={window.id}
          className={`absolute glass rounded-xl shadow-2xl overflow-hidden window-enter ${
            activeWindowId === window.id ? 'ring-2 ring-primary/50' : ''
          }`}
          style={{
            left: window.isMaximized ? 0 : window.position.x,
            top: window.isMaximized ? 0 : window.position.y,
            width: window.isMaximized ? '100vw' : window.size.width,
            height: window.isMaximized ? 'calc(100vh - 64px)' : window.size.height,
            zIndex: window.zIndex,
            cursor: dragState.isDragging && dragState.windowId === window.id ? 'grabbing' : 'default',
          }}
          onClick={() => onFocus(window.id)}
        >
          {/* Title Bar */}
          <div
            className="h-12 glass-strong border-b border-glass-border flex items-center justify-between px-4 cursor-grab select-none"
            onMouseDown={(e) => handleTitleBarMouseDown(e, window.id)}
            onDoubleClick={() => onMaximize(window.id)}
          >
            <span className="text-sm font-medium text-foreground truncate">
              {window.title}
            </span>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                className="w-8 h-8 p-0 hover:bg-warning/20 hover:text-warning"
                onClick={(e) => {
                  e.stopPropagation();
                  onMinimize(window.id);
                }}
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className="w-8 h-8 p-0 hover:bg-primary/20 hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onMaximize(window.id);
                }}
              >
                {window.isMaximized ? <Minimize className="w-4 h-4" /> : <Square className="w-4 h-4" />}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className="w-8 h-8 p-0 hover:bg-destructive/20 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(window.id);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Window Content */}
          <div className="h-full pb-12 overflow-hidden bg-surface/30">
            {window.content}
          </div>

          {/* Resize Handles */}
          {!window.isMaximized && (
            <>
              {/* Edges */}
              <div
                className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, window.id, 'top')}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, window.id, 'bottom')}
              />
              <div
                className="absolute top-0 bottom-0 left-0 w-1 cursor-ew-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, window.id, 'left')}
              />
              <div
                className="absolute top-0 bottom-0 right-0 w-1 cursor-ew-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, window.id, 'right')}
              />

              {/* Corners */}
              <div
                className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, window.id, 'top-left')}
              />
              <div
                className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, window.id, 'top-right')}
              />
              <div
                className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, window.id, 'bottom-left')}
              />
              <div
                className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, window.id, 'bottom-right')}
              />
            </>
          )}
        </div>
      ))}
    </>
  );
};