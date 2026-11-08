import { readFileSync } from 'node:fs';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssCustomMedia from 'postcss-custom-media';

// postcss-custom-media only sees definitions in the file it is processing,
// so prepend the shared @custom-media rules from global.css to every file.
const customMediaDefinitions = readFileSync(new URL('./app/global.css', import.meta.url), 'utf8')
    .match(/@custom-media[^;]+;/g)
    .join('\n');

const injectCustomMedia = {
    postcssPlugin: 'inject-custom-media',
    Once(root, { parse }) {
        root.prepend(parse(customMediaDefinitions).nodes);
    },
};

export default {
    plugins: [
        injectCustomMedia,
        postcssCustomMedia(),
        tailwindcss(),
        autoprefixer(),
    ],
};
