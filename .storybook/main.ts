import type { StorybookConfig } from '@storybook/react-vite';

// Ensure our Vite config can detect Storybook runtime and skip Remix-specific plugins
process.env.STORYBOOK = process.env.STORYBOOK || 'true';

const config: StorybookConfig = {
    stories: ['../app/components/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
    addons: [
        // Keep only addons you actually use and that match SB v9
        '@chromatic-com/storybook',
        '@storybook/addon-docs',
        '@storybook/addon-a11y',
        '@storybook/addon-vitest',
        // remove '@storybook/addon-onboarding' unless you really want the demo;
        // it often causes version conflicts.
    ],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
};

export default config;