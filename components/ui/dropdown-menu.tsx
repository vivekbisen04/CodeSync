'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

interface DropdownMenuContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType>({
  isOpen: false,
  setIsOpen: () => {},
});

export function DropdownMenu({ trigger, children, align = 'end', className = '' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  };

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className={`relative ${className}`} ref={menuRef}>
        <div onClick={() => setIsOpen(!isOpen)}>
          {trigger}
        </div>
        
        {isOpen && (
          <div className={`absolute top-full mt-1 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md ${alignmentClasses[align]}`}>
            {children}
          </div>
        )}
      </div>
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuItemProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
  className?: string;
}

export function DropdownMenuItem({ 
  onClick, 
  children, 
  variant = 'default', 
  disabled = false,
  className = '' 
}: DropdownMenuItemProps) {
  const { setIsOpen } = React.useContext(DropdownMenuContext);

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
      setIsOpen(false);
    }
  };

  const variantClasses = {
    default: 'hover:bg-accent hover:text-accent-foreground',
    destructive: 'hover:bg-destructive hover:text-destructive-foreground text-destructive',
  };

  return (
    <div
      onClick={handleClick}
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors ${disabled ? 'pointer-events-none opacity-50' : variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator() {
  return <div className="-mx-1 my-1 h-px bg-muted" />;
}