import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';

export default {
  input: './index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'iife',
    },
  ],
  plugins: [
    postcss({
      plugins: [],
    }),
    copy({
      targets: [{ src: './src/style.css', dest: 'dist' }],
      verbose: true,
    }),
  ],
};
