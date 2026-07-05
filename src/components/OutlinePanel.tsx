import React from 'react';

interface OutlineItem {
  title: string;
  bold: boolean;
  italic: boolean;
  color: Uint8ClampedArray;
  dest: string | any[] | null;
  url: string | null;
  unsafeUrl: string | undefined;
  newWindow: boolean | undefined;
  count: number | undefined;
  items: OutlineItem[];
}

interface OutlinePanelProps {
  outline: OutlineItem[] | null;
  onNavigate: (dest: any) => void;
}

export function OutlinePanel({ outline, onNavigate }: OutlinePanelProps) {
  if (!outline || outline.length === 0) {
    return (
      <div className="p-4 text-sm text-slate-500">
        Bu belge için içindekiler tablosu bulunamadı.
      </div>
    );
  }

  const renderItems = (items: OutlineItem[], level: number = 0) => {
    return (
      <ul className={`flex flex-col gap-1 ${level > 0 ? 'ml-4 mt-1' : ''}`}>
        {items.map((item, idx) => (
          <li key={idx}>
            <div 
              className="text-sm text-slate-700 hover:text-slate-900 cursor-pointer truncate py-1 hover:bg-slate-100 rounded px-2"
              onClick={() => {
                if (item.dest) {
                  onNavigate(item.dest);
                }
              }}
              title={item.title}
              style={{
                fontWeight: item.bold ? 'bold' : 'normal',
                fontStyle: item.italic ? 'italic' : 'normal'
              }}
            >
              {item.title}
            </div>
            {item.items && item.items.length > 0 && renderItems(item.items, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="p-2 overflow-y-auto h-full">
      {renderItems(outline)}
    </div>
  );
}
