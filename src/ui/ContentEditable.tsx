import type {JSX} from 'react';

import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import * as React from 'react';

type Props = {
  className?: string;
  placeholderClassName?: string;
  placeholder: string;
};

export function LexicalContentEditable({
  className,
  placeholder,
  placeholderClassName,
}: Props): JSX.Element {
  return (
    <ContentEditable
      className={className ?? 'LexiformContentEditable__root'}
      aria-placeholder={placeholder}
      placeholder={
        <div className={placeholderClassName ?? 'LexiformContentEditable__placeholder'}>
          {placeholder}
        </div>
      }
    />
  );
}
