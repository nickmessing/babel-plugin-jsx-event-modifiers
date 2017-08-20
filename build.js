import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/index.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  format: 'cjs',
  dest: `dist/bundle${process.env.NODE_ENV === 'test' ? '-test' : ''}.js`,
}
