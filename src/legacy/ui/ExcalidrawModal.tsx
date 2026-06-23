// @ts-nocheck
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
"use client";
import type {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from '@excalidraw/excalidraw/types';
import type {JSX} from 'react';

import './ExcalidrawModal.css';

// src/ui/ExcalidrawModal.tsx
import {isDOMNode} from 'lexical';
import * as React from 'react';
import {ReactPortal, useEffect, useLayoutEffect, useRef, useState} from 'react';

const Excalidraw = React.lazy(() =>
  import('@excalidraw/excalidraw').then((mod) => ({default: mod.Excalidraw}))
);
import * as React from 'react';
import {ReactPortal, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

import Button from './Button';
import Modal from './Modal';

export type ExcalidrawInitialElements = ExcalidrawInitialDataState['elements'];

type Props = {
  closeOnClickOutside?: boolean;
  /**
   * The initial set of elements to draw into the scene
   */
  initialElements: ExcalidrawInitialElements;
  /**
   * The initial set of elements to draw into the scene
   */
  initialAppState: AppState;
  /**
   * The initial set of elements to draw into the scene
   */
  initialFiles: BinaryFiles;
  /**
   * Controls the visibility of the modal
   */
  isShown?: boolean;
  /**
   * Callback when closing and discarding the new changes
   */
  onClose: () => void;
  /**
   * Completely remove Excalidraw component
   */
  onDelete: () => void;
  /**
   * Callback when the save button is clicked
   */
  onSave: (
    elements: ExcalidrawInitialElements,
    appState: Partial<AppState>,
    files: BinaryFiles,
  ) => void;
};

export const useCallbackRefState = () => {
  const [refValue, setRefValue] =
    React.useState<ExcalidrawImperativeAPI | null>(null);
  const refCallback = React.useCallback(
    (value: ExcalidrawImperativeAPI | null) => setRefValue(value),
    [],
  );
  return [refValue, refCallback] as const;
};

/**
 * @explorer-desc
 * A component which renders a modal with Excalidraw (a painting app)
 * which can be used to export an editable image
 */
export default function ExcalidrawModal({
  closeOnClickOutside = false,
  onSave,
  initialElements,
  initialAppState,
  initialFiles,
  isShown = false,
  onDelete,
  onClose,
}: Props): ReactPortal | null {
  const excaliDrawModelRef = useRef<HTMLDivElement | null>(null);
  const [excalidrawAPI, excalidrawAPIRefCallback] = useCallbackRefState();
  const [discardModalOpen, setDiscardModalOpen] = useState(false);
  const [elements, setElements] =
    useState<ExcalidrawInitialElements>(initialElements);
  const [files, setFiles] = useState<BinaryFiles>(initialFiles);

  useEffect(() => {
    if (excaliDrawModelRef.current !== null) {
      excaliDrawModelRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let modalOverlayElement: HTMLElement | null = null;

    const clickOutsideHandler = (event: MouseEvent) => {
      const target = event.target;
      if (
        excaliDrawModelRef.current !== null &&
        isDOMNode(target) &&
        !excaliDrawModelRef.current.contains(target) &&
        closeOnClickOutside
      ) {
        onDelete();
      }
    };

    if (excaliDrawModelRef.current !== null) {
      modalOverlayElement = excaliDrawModelRef.current?.parentElement;
      if (modalOverlayElement !== null) {
        modalOverlayElement?.addEventListener('click', clickOutsideHandler);
      }
    }

    return () => {
      if (modalOverlayElement !== null) {
        modalOverlayElement?.removeEventListener('click', clickOutsideHandler);
      }
    };
  }, [closeOnClickOutside, onDelete]);

  useLayoutEffect(() => {
    const currentModalRef = excaliDrawModelRef.current;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDelete();
      }
    };

    if (currentModalRef !== null) {
      currentModalRef.addEventListener('keydown', onKeyDown);
    }

    return () => {
      if (currentModalRef !== null) {
        currentModalRef.removeEventListener('keydown', onKeyDown);
      }
    };
  }, [elements, files, onDelete]);

  const save = () => {
    if (elements && elements.filter((el) => !el.isDeleted).length > 0) {
      const appState = excalidrawAPI?.getAppState();
      // We only need a subset of the state
      const partialState: Partial<AppState> = {
        exportBackground: appState?.exportBackground,
        exportScale: appState?.exportScale,
        exportWithDarkMode: appState?.theme === 'dark',
        isBindingEnabled: appState?.isBindingEnabled,
        isLoading: appState?.isLoading,
        name: appState?.name,
        theme: appState?.theme,
        viewBackgroundColor: appState?.viewBackgroundColor,
        viewModeEnabled: appState?.viewModeEnabled,
        zenModeEnabled: appState?.zenModeEnabled,
        zoom: appState?.zoom,
      };
      onSave(elements, partialState, files);
    } else {
      // delete node if the scene is clear
      onDelete();
    }
  };

  const discard = () => {
    setDiscardModalOpen(true);
  };

  function ShowDiscardDialog(): JSX.Element {
    return (
      <Modal
        title="Discard"
        onClose={() => {
          setDiscardModalOpen(false);
        }}
        closeOnClickOutside={false}>
        Are you sure you want to discard the changes?
        <div className="ExcalidrawModal__discardModal">
          <Button
            onClick={() => {
              setDiscardModalOpen(false);
              onClose();
            }}>
            Discard
          </Button>{' '}
          <Button
            onClick={() => {
              setDiscardModalOpen(false);
            }}>
            Cancel
          </Button>
        </div>
      </Modal>
    );
  }

  if (isShown === false) {
    return null;
  }

  useEffect(() => {
    // Check initial theme
    if (typeof document !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark') || 
                     document.body.classList.contains('dark') ||
                     document.documentElement.classList.contains('lexiform-dark');
      
      // Observe for theme changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            const isNowDark = document.documentElement.classList.contains('dark') || 
                              document.body.classList.contains('dark') ||
                              document.documentElement.classList.contains('lexiform-dark');
            excalidrawAPI?.updateScene({ appState: { theme: isNowDark ? 'dark' : 'light' } });
          }
        });
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      return () => observer.disconnect();
    }
  }, [excalidrawAPI]);

  const onChange = (
    els: ExcalidrawInitialElements,
    appState: AppState,
    fls: BinaryFiles,
  ) => {
    setElements(els);
    setFiles(fls);

    if (typeof document !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark') || 
                     document.body.classList.contains('dark') ||
                     document.documentElement.classList.contains('lexiform-dark');
      
      const excalidrawIsDark = appState.theme === 'dark';
      
      if (isDark && !excalidrawIsDark) {
         document.documentElement.classList.remove('dark', 'lexiform-dark');
         document.body.classList.remove('dark');
         document.documentElement.style.colorScheme = 'light';
         // Attempt to sync with next-themes if used
         window.localStorage.setItem('theme', 'light');
         window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'light' }));
      } else if (!isDark && excalidrawIsDark) {
         document.documentElement.classList.add('dark');
         document.documentElement.style.colorScheme = 'dark';
         // Attempt to sync with next-themes if used
         window.localStorage.setItem('theme', 'dark');
         window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'dark' }));
      }
    }
  };

  return createPortal(
    <div className="ExcalidrawModal__overlay" role="dialog">
      <div
        className="ExcalidrawModal__modal"
        ref={excaliDrawModelRef}
        tabIndex={-1}>
        <div className="ExcalidrawModal__row">
          {discardModalOpen && <ShowDiscardDialog />}
          <React.Suspense fallback={<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}>Loading Excalidraw...</div>}>
            <Excalidraw
              onChange={onChange}
              excalidrawAPI={excalidrawAPIRefCallback}
              initialData={{
                appState: {
                  ...(initialAppState || {}),
                  theme:
                    initialAppState?.theme ||
                    (typeof document !== 'undefined' &&
                    (document.documentElement.classList.contains('dark') ||
                      document.body.classList.contains('dark') ||
                      document.documentElement.classList.contains('lexiform-dark'))
                      ? 'dark'
                      : 'light'),
                },
                elements: initialElements,
                files: initialFiles,
              }}
            />
          </React.Suspense>
          <div className="ExcalidrawModal__actions">
            <button className="action-button" onClick={discard}>
              Discard
            </button>
            <button className="action-button" onClick={save}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
