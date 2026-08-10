'use client';

import React from 'react';

type Option = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  leadingIcon?: React.ReactNode;
  className?: string;
};

export function SearchableSelect({
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search',
  leadingIcon,
  className = '',
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const ref = React.useRef<HTMLDivElement | null>(null);
  const selected = options.find((option) => option.value === value);
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  React.useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const selectOption = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      {leadingIcon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          {leadingIcon}
        </div>
      )}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setOpen((current) => !current);
          setQuery('');
        }}
        className={`field-control flex w-full items-center justify-between py-3 text-left ${
          leadingIcon ? 'pl-11' : 'pl-4'
        } pr-10`}
      >
        <span className={selected ? 'text-stone-900' : 'text-stone-400'}>
          {selected?.label ?? placeholder}
        </span>
      </button>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg
          className="h-5 w-5 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {open && (
        <div className="absolute z-30 mt-2 w-full border border-stone-300 bg-stone-50 shadow-xl">
          <div className="border-b border-stone-300 p-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              autoFocus
              className="w-full border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-orange-600"
            />
          </div>
          <div className="max-h-56 overflow-y-auto py-1" role="listbox">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  onClick={() => selectOption(option.value)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                    value === option.value
                      ? 'bg-stone-900 text-stone-50'
                      : 'text-stone-800 hover:bg-orange-50 hover:text-orange-900'
                  }`}
                >
                  <span>{option.label}</span>
                  {value === option.value && <span aria-hidden="true">✓</span>}
                </button>
              ))
            ) : (
              <p className="px-3 py-3 text-sm text-stone-500">No option found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
