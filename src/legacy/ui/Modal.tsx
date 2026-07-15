// @ts-nocheck
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
"use client";
import type {JSX} from 'react';

import './Modal.css';

import {isDOMNode} from 'lexical';
import * as React from 'react';
import {ReactNode, useEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import {X} from 'lucide-react';

function PortalImpl({
  onClose,
  children,
  title,
  closeOnClickOutside,
  position="center"
}: {
  children: ReactNode;
  closeOnClickOutside: boolean;
  onClose: () => void;
  title: string;
  position?: "top" | "bottom" | "center"
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current !== null) {
      setTimeout(() => {
        if (modalRef.current !== null) {
          // Auto-focus the first input element in the modal if it exists
          const firstInput = modalRef.current.querySelector('input, textarea, select') as HTMLElement | null;
          if (firstInput) {
            firstInput.focus();
          } else {
            modalRef.current.focus();
          }
        }
      }, 10);
    }
  }, []);

  useEffect(() => {
    let modalOverlayElement: HTMLElement | null = null;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'Enter') {
        // Automatically submit the modal when Enter is pressed inside an input
        if (document.activeElement instanceof HTMLInputElement) {
          const buttons = Array.from(modalRef.current?.querySelectorAll('button') || []);
          const confirmBtn = buttons.find(b => 
            b.textContent?.trim() === 'Confirm' || 
            b.textContent?.trim() === 'Insert'
          ) as HTMLButtonElement | undefined;
          
          if (confirmBtn && !confirmBtn.disabled) {
            confirmBtn.click();
            event.preventDefault();
            event.stopPropagation();
          }
        }
      }
    };
    const clickOutsideHandler = (event: MouseEvent) => {
      const target = event.target;
      if (
        modalRef.current !== null &&
        isDOMNode(target) &&
        !modalRef.current.contains(target) &&
        closeOnClickOutside
      ) {
        onClose();
      }
    };
    const modelElement = modalRef.current;
    if (modelElement !== null) {
      modalOverlayElement = modelElement.parentElement;
      if (modalOverlayElement !== null) {
        modalOverlayElement.addEventListener('click', clickOutsideHandler);
      }
    }

    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
      if (modalOverlayElement !== null) {
        modalOverlayElement?.removeEventListener('click', clickOutsideHandler);
      }
    };
  }, [closeOnClickOutside, onClose]);

  return (
    <div className={`Modal__overlay modal-${position}`} role="dialog">
      <div className="Modal__modal" tabIndex={-1} ref={modalRef}>
        <h2 className="Modal__title">{title}</h2>
        <button
          className="Modal__closeButton"
          aria-label="Close modal"
          type="button"
          onClick={onClose}>
          <X size={18} />
        </button>
        <div className="Modal__content">{children}</div>
      </div>
    </div>
  );
}

export default function Modal({
  onClose,
  children,
  title,
  closeOnClickOutside = false,
  position="center"
}: {
  children: ReactNode;
  closeOnClickOutside?: boolean;
  onClose: () => void;
  title: string;
  position?: "top" | "bottom" | "center";
}): JSX.Element {
  return createPortal(
    <PortalImpl
      onClose={onClose}
      title={title}
      position={position}
      closeOnClickOutside={closeOnClickOutside}>
      {children}
    </PortalImpl>,
    document.body,
  );
}
