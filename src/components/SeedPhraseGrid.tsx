
interface SeedPhraseGridProps {
  seedPhrase: string[];
}

export function SeedPhraseGrid({ seedPhrase }: SeedPhraseGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3 my-6">
      {seedPhrase.map((word, index) => (
        <div 
          key={index}
          className="bg-gradient-to-r from-slate-800 to-slate-700 p-3 rounded-lg 
                     flex items-center space-x-2 border border-slate-600/50"
        >
          <span className="text-emerald-400 font-mono">{(index + 1).toString().padStart(2, '0')}</span>
          <span className="text-white font-medium">{word}</span>
        </div>
      ))}
    </div>
  );
}