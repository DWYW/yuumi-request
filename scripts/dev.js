const execa = require('execa')
const argv = require('minimist')(process.argv.slice(2))

const env = argv.production || argv.p ? 'production' : 'develpoment'

async function build (format) {
  await execa('rollup',
    [
      '-c',
      '-w',
      '--environment',
      [
        `NODE_ENV:${env}`
      ]
    ],
    { stdio: 'inherit' }
  )
}

build('es')
