const execa = require('execa')
const argv = require('minimist')(process.argv.slice(2))
const chalk = require('chalk')

const env = argv.production || argv.p ? 'production' : 'develpoment'

async function buildAll () {
  const formats = [ 'es' ]

  for (const format of formats) {
    await build(format)
  }
}

async function build (format) {
  await execa('rollup',
    [
      '-c',
      '--environment',
      [
        `NODE_ENV:${env}`
      ]
    ],
    { stdio: 'inherit' }
  )
}

buildAll()
