// import { Eye, EyeOff, Send, Wallet } from 'lucide-react';
// import { ADDRESS } from '../types';

// interface AddressCardProps {
//   address: ADDRESS;
//   index: number;
//   showSolana: boolean;
//   isGridView: boolean;
//   draggedIndex: number | null;
//   onDragStart: (index: number) => void;
//   onDragOver: (e: React.DragEvent) => void;
//   onDrop: (index: number) => void;
//   onTogglePrivateKey: (index: number, isSolana: boolean) => void;
//   onReceive: (address: ADDRESS) => void;
//   onBalance: (address: ADDRESS) => void;
//   onSend: (address: ADDRESS) => void;
// }

// export function AddressCard({
//   address,
//   index,
//   showSolana,
//   isGridView,
//   draggedIndex,
//   onDragStart,
//   onDragOver,
//   onDrop,
//   onTogglePrivateKey,
//   onReceive,
//   onBalance,
//   onSend,
// }: AddressCardProps) {
//   return (
//     <div
//       draggable
//       onDragStart={() => onDragStart(index)}
//       onDragOver={onDragOver}
//       onDrop={() => onDrop(index)}
//       className={`${isGridView ? 'w-full md:w-[calc(50%-0.5rem)]' : 'w-full'} 
//                  bg-gray-800 rounded-lg p-4 space-y-3 cursor-move
//                  hover:shadow-lg transition-all duration-200 ease-in-out
//                  ${draggedIndex === index ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}
//     >
//       <div className="space-y-2">
//         <div className="flex flex-col gap-1">
//           <span className="text-gray-400 text-sm">Public Key</span>
//           <div className="font-mono text-sm bg-gray-700 px-2 py-1.5 rounded break-all">
//             {address.publicKey}
//           </div>
//         </div>
        
//         <div className="flex flex-col gap-1">
//           <span className="text-gray-400 text-sm">Private Key</span>
//           <div className="flex items-center gap-2">
//             <div className="font-mono text-sm bg-gray-700 px-2 py-1.5 rounded break-all flex-1">
//               {address.showPrivateKey ? address.privateKey : '••••••••••'}
//             </div>
//             <button
//               onClick={() => onTogglePrivateKey(index, showSolana)}
//               className="p-1.5 hover:bg-gray-700 rounded transition-colors"
//               title={address.showPrivateKey ? 'Hide private key' : 'Show private key'}
//             >
//               {address.showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {showSolana && (
//         <div className="flex gap-2 pt-2">
//           <button
//             onClick={() => onReceive(address)}
//             className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors flex-1 text-sm"
//           >
//             <Wallet className="w-4 h-4" />
//             Receive
//           </button>
//           <button
//             onClick={() => onBalance(address)}
//             className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg transition-colors flex-1 text-sm"
//           >
//             Balance
//           </button>
//           <button
//             onClick={() => onSend(address)}
//             className="flex items-center justify-center gap-1 bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg transition-colors flex-1 text-sm"
//           >
//             <Send className="w-4 h-4" />
//             Send
//           </button>
//           <a
//             href="https://faucet.solana.com/"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center justify-center gap-1 bg-orange-600 hover:bg-orange-700 px-3 py-2 rounded-lg transition-colors flex-1 text-sm text-white"
//           >
//             Faucet
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }



import { Eye, EyeOff, Send, Wallet } from 'lucide-react';
import { ADDRESS } from '../types';

interface AddressCardProps {
  address: ADDRESS;
  index: number;
  showSolana: boolean;
  isGridView: boolean;
  draggedIndex: number | null;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (index: number) => void;
  onTogglePrivateKey: (index: number, isSolana: boolean) => void;
  onReceive: (address: ADDRESS) => void;
  onBalance: (address: ADDRESS) => void;
  onSend: (address: ADDRESS) => void;
}

export function AddressCard({
  address,
  index,
  showSolana,
  isGridView,
  draggedIndex,
  onDragStart,
  onDragOver,
  onDrop,
  onTogglePrivateKey,
  onReceive,
  onBalance,
  onSend,
}: AddressCardProps) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={onDragOver}
      onDrop={() => onDrop(index)}
      className={`${isGridView ? 'w-full md:w-[calc(50%-0.5rem)]' : 'w-full'} 
                 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5
                 border border-slate-700/50 shadow-xl hover:shadow-2xl
                 transition-all duration-300 ease-in-out cursor-move
                 hover:border-emerald-500/20 group
                 ${draggedIndex === index ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <span className="text-emerald-400 text-sm font-medium">Public Key</span>
          <div className="font-mono text-sm bg-slate-900/50 px-3 py-2 rounded-lg 
                         border border-slate-700/50 break-all text-slate-300">
            {address.publicKey}
          </div>
        </div>
        
        <div className="space-y-2">
          <span className="text-emerald-400 text-sm font-medium">Private Key</span>
          <div className="flex items-center gap-2">
            <div className="font-mono text-sm bg-slate-900/50 px-3 py-2 rounded-lg 
                           border border-slate-700/50 break-all text-slate-300 flex-1">
              {address.showPrivateKey ? address.privateKey : '••••••••••'}
            </div>
            <button
              onClick={() => onTogglePrivateKey(index, showSolana)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors
                         text-slate-400 hover:text-emerald-400"
              title={address.showPrivateKey ? 'Hide private key' : 'Show private key'}
            >
              {address.showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {showSolana && (
        <div className="flex gap-2 pt-4 mt-4 border-t border-slate-700/50">
          <button
            onClick={() => onReceive(address)}
            className="flex items-center justify-center gap-1.5 bg-gradient-to-r 
                      from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 
                      px-3 py-2 rounded-lg transition-all duration-200 flex-1 text-sm font-medium
                      text-white shadow-lg hover:shadow-xl"
          >
            <Wallet className="w-4 h-4" />
            Receive
          </button>
          <button
            onClick={() => onBalance(address)}
            className="flex items-center justify-center gap-1.5 bg-slate-700 
                      hover:bg-slate-600 px-3 py-2 rounded-lg transition-colors 
                      flex-1 text-sm font-medium text-white"
          >
            Balance
          </button>
          <button
            onClick={() => onSend(address)}
            className="flex items-center justify-center gap-1.5 bg-slate-700 
                      hover:bg-slate-600 px-3 py-2 rounded-lg transition-colors 
                      flex-1 text-sm font-medium text-white"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
          <a
            href="https://faucet.solana.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 bg-amber-600/20 
                      hover:bg-amber-600/30 text-amber-400 px-3 py-2 rounded-lg 
                      transition-colors flex-1 text-sm font-medium"
          >
            Faucet
          </a>
        </div>
      )}
    </div>
  );
}