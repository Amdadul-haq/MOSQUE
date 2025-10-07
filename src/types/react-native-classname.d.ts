// Allow using `className` prop on React Native components (used by some tailwind-classname libraries)
import 'react';
import { TextProps, ViewProps, ImageProps, TextInputProps, ScrollViewProps } from 'react-native';

declare module 'react' {
  interface Attributes {
    className?: string;
  }
}

declare global {
  interface RNClassNameProps {
    className?: string;
  }
}

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
}
