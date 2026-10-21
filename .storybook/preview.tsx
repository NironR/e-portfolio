import type { Preview } from '@storybook/react-vite'
import { ThemeProvider, themeStyles } from '../app/components/theme-provider/theme-provider'
import '../app/global.module.css'
import '../app/reset.module.css'

// Mirror app/root.tsx: theme tokens are keyed off body[data-theme]
document.body.dataset.theme = 'dark'

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme="dark">
        <style>{themeStyles}</style>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;
