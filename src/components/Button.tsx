import React from 'react';

type ButtonVariant = 'primary' | 'outline' | 'disabled';

export const Button = ({
  onClick,
  children,
  isDisabled,
  variant = 'primary',
}: {
  onClick: () => void;
  children: React.ReactNode;
  isDisabled?: boolean;
  variant?: ButtonVariant;
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-linear-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 focus:ring-violet-500/50';
      case 'outline':
        return 'border-2 border-violet-600 bg-transparent text-violet-600 hover:bg-violet-50 dark:border-violet-500 dark:text-violet-400 dark:hover:bg-violet-950/30 focus:ring-violet-500/30';
      case 'disabled':
        return 'bg-zinc-300 text-zinc-500 cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-500';
      default:
        return 'bg-linear-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 focus:ring-violet-500/50';
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled || variant === 'disabled'}
      className={`group relative overflow-hidden rounded-xl px-6 py-3 font-semibold transition-all focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 ${getVariantClasses()}`}
    >
      {children}
    </button>
  );
};
