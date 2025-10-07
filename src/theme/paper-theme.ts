import { 
  DefaultTheme as PaperDefaultTheme, 
  MD3DarkTheme as PaperDarkTheme 
} from 'react-native-paper';

// Use MD3 color tokens expected by react-native-paper
export const LightTheme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: '#16a34a',
    secondary: '#facc15',
    background: '#f9fafb',
    surface: '#ffffff',
    onSurface: '#1f2937',
    // keep legacy text mapping for code that used `text`
    text: '#1f2937',
  },
};

export const DarkTheme = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    primary: '#16a34a',
    secondary: '#facc15',
    background: '#111111',
    surface: '#1f1f1f',
    onSurface: '#ffffff',
    text: '#ffffff',
  },
};