import { Grid, List } from 'lucide-react';

interface ViewToggleProps {
  isGridView: boolean;
  onToggle: (isGrid: boolean) => void;
}

export function ViewToggle({ isGridView, onToggle }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onToggle(true)}
        className={`p-2 rounded-lg transition-colors ${
          isGridView ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
        }`}
        title="Grid view"
      >
        <Grid className="w-4 h-4" />
      </button>
      <button
        onClick={() => onToggle(false)}
        className={`p-2 rounded-lg transition-colors ${
          !isGridView ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
        }`}
        title="List view"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}