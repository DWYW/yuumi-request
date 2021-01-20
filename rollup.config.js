import path from 'path'
import ts from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'

const pkg = require('./package.json')

const tsconfigOverride = {
  compilerOptions: {
    declaration: true,
    declarationMap: false,
    declarationDir: path.join(__dirname, 'types')
  }
}

const output = [
  {
    file: `dist/${pkg.name}.js`,
    format: 'es'
  },
  {
    file: `dist/${pkg.name}.cjs.js`,
    format: 'cjs',
    name: pkg.name.replace(/(^\w)|(-\w)/g, function ($1) {
      return $1.toUpperCase().slice(-1)
    })
    // exports: 'default'
  }
]

module.exports = {
  input: './src/index.ts',
  output,
  plugins: [
    resolve(),
    json({
      namedExports: false
    }),
    ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      tsconfigOverride,
      useTsconfigDeclarationDir: true
    })
  ]
}