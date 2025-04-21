import { MathfieldElement } from 'mathlive';

// Extend the JSX namespace to include the custom 'math-field' element.
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement>,
        MathfieldElement
      >;
    }
  }
}