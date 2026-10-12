import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 border border-violet-500/30 text-white px-4 py-3 rounded-2xl shadow-2xl shadow-violet-950/50 backdrop-blur-md animate-slide-up">
      <div className="p-1 bg-violet-500/20 text-violet-400 rounded-lg">
        <CheckCircle2 className="w-5 h-5" />
      </div>
      <span className="text-sm font-medium pr-2">{message}</span>
      <button 
        onClick={onClose}
        className="text-zinc-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};