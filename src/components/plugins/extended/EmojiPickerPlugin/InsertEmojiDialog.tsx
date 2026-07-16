"use client";

import * as React from 'react';
import {useEffect, useMemo, useState} from 'react';
import {LexicalEditor, $createTextNode, $insertNodes} from 'lexical';

type Emoji = {
  emoji: string;
  description: string;
  category: string;
  aliases: Array<string>;
  tags: Array<string>;
  unicode_version: string;
  ios_version: string;
  skin_tones?: boolean;
};

export function InsertEmojiDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}) {
  const [emojis, setEmojis] = useState<Array<Emoji>>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Smileys & Emotion');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    import('../../../../legacy/utils/emoji-list').then((module) => {
      if (isMounted) setEmojis(module.default);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    if (emojis.length === 0) return [];
    return [...new Set(emojis.map((e) => e.category))];
  }, [emojis]);

  const displayedEmojis = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return emojis.filter(
        (e) =>
          e.aliases.some((alias) => alias.includes(q)) ||
          e.tags.some((tag) => tag.includes(q)) ||
          e.description.toLowerCase().includes(q)
      );
    }
    return emojis.filter((e) => e.category === activeCategory);
  }, [emojis, activeCategory, searchQuery]);

  const onClickEmoji = (emojiStr: string) => {
    activeEditor.update(() => {
      $insertNodes([$createTextNode(emojiStr)]);
    });
    onClose();
  };

  if (emojis.length === 0) {
    return (
      <div style={{padding: '40px', textAlign: 'center', color: 'var(--lexiform-muted-foreground)'}}>
        Loading emojis...
      </div>
    );
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: 'min(450px, 60vh)'}}>
      <div style={{paddingBottom: '12px', borderBottom: '1px solid var(--lexiform-border)'}}>
        <input
          type="text"
          placeholder="Search emojis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--lexiform-input)',
            background: 'var(--lexiform-background)',
            color: 'var(--lexiform-foreground)',
            marginBottom: '12px',
            outline: 'none',
          }}
          autoFocus
        />
        {!searchQuery && (
          <div style={{
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '6px', 
          }}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '6px 10px',
                    fontSize: '12px',
                    fontWeight: isActive ? '600' : '400',
                    cursor: 'pointer',
                    background: isActive ? 'var(--lexiform-primary)' : 'transparent',
                    color: isActive ? 'var(--lexiform-primary-foreground)' : 'var(--lexiform-foreground)',
                    border: 'none',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'var(--lexiform-accent)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {cat.split(' & ')[0]}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div style={{flex: 1, overflowY: 'auto', paddingTop: '12px', paddingRight: '8px'}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gap: '4px'}}>
          {displayedEmojis.map((emoji) => (
            <button
              key={emoji.emoji}
              onClick={() => onClickEmoji(emoji.emoji)}
              title={emoji.description || emoji.aliases[0]}
              style={{
                fontSize: '24px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--lexiform-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {emoji.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
