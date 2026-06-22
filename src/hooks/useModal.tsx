import type {JSX} from 'react';

import {useCallback, useMemo, useState} from 'react';
import * as React from 'react';

import { Dialog } from '../ui/Dialog';

export default function useModal(): [
  JSX.Element | null,
  (title: string, showModal: (onClose: () => void) => JSX.Element, closeOnClickOutside?: boolean, position?: "top" | "bottom" | "center") => void,
] {
  const [modalContent, setModalContent] = useState<null | {
    closeOnClickOutside: boolean;
    content: JSX.Element;
    title: string;
    position?: "top" | "bottom" | "center";
  }>(null);

  const onClose = useCallback(() => {
    setModalContent(null);
  }, []);

  const modal = useMemo(() => {
    if (modalContent === null) {
      return null;
    }
    const {title, content} = modalContent;
    return (
      <Dialog
        open={true}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
        title={title}
      >
        {content}
      </Dialog>
    );
  }, [modalContent, onClose]);

  const showModal = useCallback(
    (
      title: string,
      // eslint-disable-next-line no-shadow
      getContent: (onClose: () => void) => JSX.Element,
      closeOnClickOutside = false,
      position: "top" | "bottom" | "center" = "center",
    ) => {
      setModalContent({
        closeOnClickOutside,
        content: getContent(onClose),
        title,
        position
      });
    },
    [onClose],
  );

  return [modal, showModal];
}
