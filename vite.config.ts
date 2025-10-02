/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { vitePlugin as remix, cloudflareDevProxyVitePlugin } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import { getLoadContext } from "./load-context";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
declare module "@remix-run/cloudflare" {
  interface Future {
    v3_singleFetch: true;
  }
}
export default defineConfig(() => {
  const isStorybook = Boolean(process.env.STORYBOOK);

  const plugins = [tsconfigPaths()];

  if (!isStorybook) {
    plugins.unshift(
      cloudflareDevProxyVitePlugin({ getLoadContext }),
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_singleFetch: true,
          v3_lazyRouteDiscovery: true
        }
      })
    );
  }

  return {
    plugins,
    ssr: isStorybook
      ? undefined
      : {
          resolve: {
            conditions: ["workerd", "worker", "browser"]
          }
        },
    resolve: {
      mainFields: ["browser", "module", "main"]
    },
    build: {
      minify: true
    },
    test: {
      projects: [{
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook')
          })
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [
              {
                browser: 'chromium'
              }
            ]
          },
          setupFiles: ['.storybook/vitest.setup.ts']
        }
      }, {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook')
          })
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [
              {
                browser: 'chromium'
              }
            ]
          },
          setupFiles: ['.storybook/vitest.setup.ts']
        }
      }]
    }
  };
});