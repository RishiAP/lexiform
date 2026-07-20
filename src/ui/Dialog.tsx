import * as React from 'react';
import { Dialog as RadixDialog } from 'radix-ui';
import { X } from 'lucide-react';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  onFocusOutside?: (e: any) => void;
  onPointerDownOutside?: (e: any) => void;
}

export function Dialog({ open, onOpenChange, title, children, onFocusOutside, onPointerDownOutside }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="Lexiform__dialogOverlay" />
        <RadixDialog.Content 
          className="Lexiform__dialogContent"
          onFocusOutside={onFocusOutside}
          onPointerDownOutside={onPointerDownOutside}
        >
          <div className="Lexiform__dialogHeader">
            <RadixDialog.Title className="Lexiform__dialogTitle">{title}</RadixDialog.Title>
            <RadixDialog.Close className="Lexiform__dialogClose" aria-label="Close">
              <X size={20} />
            </RadixDialog.Close>
          </div>
          <div className="Lexiform__dialogBody">
            {children}
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
