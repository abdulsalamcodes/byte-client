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
        return 'accent-button focus:ring-orange-500/30';
      case 'outline':
        return 'border border-stone-400 bg-transparent text-stone-800 hover:border-stone-900 hover:bg-stone-100 focus:ring-stone-400/30';
      case 'disabled':
        return 'cursor-not-allowed bg-stone-200 text-stone-400';
      default:
        return 'accent-button focus:ring-orange-500/30';
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled || variant === 'disabled'}
      className={`group relative overflow-hidden px-6 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 ${getVariantClasses()}`}
    >
      {children}
    </button>
  );
};
