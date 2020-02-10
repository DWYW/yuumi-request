const shell = require('shelljs');

module.all = function(done) {
  shell.rm('-rf', process.env.OUTPUT_DIR)
  done()
}

module.cleanJS = function (done) {
  shell.rm('-rf', `${process.env.OUTPUT_DIR}/*.js`)
  done()
}

module.exports = module