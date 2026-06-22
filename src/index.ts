// Export main component and types
export { LexicalEditor } from './components/LexicalEditor';
export type { LexicalEditorProps, EditorOutputFormat } from './types';

// Export utility functions for SSR or separate handling
export { lexicalJSONToHTML, htmlToLexicalJSON } from './utils/serializers';

// Export base theme if needed for overriding
export { default as defaultTheme } from './themes/DefaultTheme';

// Export extended nodes from PlaygroundNodes
export { default as ExtendedNodes } from './nodes/extended/PlaygroundNodes';

// Export extended plugins
export { default as ComponentPickerPlugin } from './components/plugins/extended/ComponentPickerPlugin';
export { default as EquationsPlugin } from './components/plugins/extended/EquationsPlugin';
export { default as ExcalidrawPlugin } from './components/plugins/extended/ExcalidrawPlugin';
export { default as ImagesPlugin } from './components/plugins/extended/ImagesPlugin';
export { LayoutPlugin } from './components/plugins/extended/LayoutPlugin/LayoutPlugin';
export { default as PollPlugin } from './components/plugins/extended/PollPlugin';
export { default as YouTubePlugin } from './components/plugins/extended/YouTubePlugin';
export { default as TwitterPlugin } from './components/plugins/extended/TwitterPlugin';
export { default as FigmaPlugin } from './components/plugins/extended/FigmaPlugin';
export { default as CollapsiblePlugin } from './components/plugins/extended/CollapsiblePlugin';
export { PLAYGROUND_TRANSFORMERS as MarkdownTransformers } from './components/plugins/extended/MarkdownTransformers';
export { FloatingTextFormatToolbarPlugin } from './components/plugins/FloatingTextFormatToolbarPlugin';
