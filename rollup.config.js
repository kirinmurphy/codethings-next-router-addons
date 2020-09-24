import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

import postcss from 'rollup-plugin-postcss';
import nested from 'postcss-nested';
// import cssnext from 'postcss-cssnext';
// import cssnano from 'cssnano';

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: false
    }
  ],
  plugins: [
    typescript(),
    // typescript({ objectHashIgnoreUnknownHack: true })
    postcss({
      extensions: [ '.css' ],
      extract: 'styles.css',
      plugins: [
        nested(),
        // cssnext({ warnForDuplicates: false }),
        // cssnano()
      ]
    }),
  ],
  external: ['react', 'react-dom']
}