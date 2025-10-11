import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssCustomMedia from 'postcss-custom-media';
import postcss from "postcss";

export default {
    plugins: [
        tailwindcss(),
        postcssCustomMedia(),
        autoprefixer(),
    ],
};

module.exports = {
    plugins: {
        '@csstools/postcss-global-data': {
            files: ['app/styles/global.module.css'],
        },
        'postcss-custom-media': {},
    },
};
