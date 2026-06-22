import * as React from 'react';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import { ChevronDown } from 'lucide-react';

export interface DropdownMenuProps {
  buttonLabel?: string | React.ReactNode;
  buttonIcon?: React.ReactNode;
  buttonClassName?: string;
  children: React.ReactNode;
  disabled?: boolean;
  title?: string;
}

export function DropdownMenu({
  buttonLabel,
  buttonIcon,
  buttonClassName = 'Lexiform__dropdownButton',
  children,
  disabled = false,
  title,
}: DropdownMenuProps) {
  return (
    <RadixDropdownMenu.Root>
      <RadixDropdownMenu.Trigger disabled={disabled} className={buttonClassName} title={title}>
        {buttonIcon && <span className="Lexiform__dropdownButtonIcon">{buttonIcon}</span>}
        {buttonLabel && <span className="Lexiform__dropdownButtonText">{buttonLabel}</span>}
        <ChevronDown size={16} className="Lexiform__dropdownButtonChevron" />
      </RadixDropdownMenu.Trigger>
      <RadixDropdownMenu.Portal>
        <RadixDropdownMenu.Content className="Lexiform__dropdownContent" sideOffset={5}>
          {children}
        </RadixDropdownMenu.Content>
      </RadixDropdownMenu.Portal>
    </RadixDropdownMenu.Root>
  );
}

export const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Item>
>(({ className, ...props }, ref) => (
  <RadixDropdownMenu.Item
    ref={ref}
    className={`Lexiform__dropdownItem ${className || ''}`}
    {...props}
  />
));
DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Separator>
>(({ className, ...props }, ref) => (
  <RadixDropdownMenu.Separator
    ref={ref}
    className={`Lexiform__dropdownSeparator ${className || ''}`}
    {...props}
  />
));
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';
