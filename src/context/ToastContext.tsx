"use client";

import React, { useState, createContext, useContext, ReactNode } from 'react';

type ToastType = 'success' | 'error';

interface ToastMessage {
  message: string;
  type: ToastType;
  id: number;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastType) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { message, type, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 1000); // Auto-dismiss after 1 second
  };

  const removeToast = (id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-24 pointer-events-none">
        <div className="flex flex-col items-center space-y-2">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 pointer-events-auto ${
                toast.type === 'success' ? 'bg-teal-500' : 'bg-red-500'
              }`}
            >
              {toast.message}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast moet worden gebruikt binnen een ToastProvider');
  }
  return context;
}; 