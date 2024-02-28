import copy from 'rollup-plugin-copy';

export default {
  input: './index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'iife',
    },
  ],
  plugins: [
    copy({
      targets: [
        { src: 'index.html', dest: 'dist' },
        { src: 'style.css', dest: 'dist' },
      ],
      verbose: true,
    }),
  ],
};
