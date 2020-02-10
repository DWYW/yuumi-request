const { server, reload } = require('./series/server');
const { rollup } = require('./series/rollup')
const clean = require('./series/clean');
const lint = require('./series/lint')
const gulp = require('gulp')

gulp.task('clean', clean.all)
gulp.task('cleanJS', clean.cleanJS)
gulp.task('lint', lint)
gulp.task('rollup', rollup)
gulp.task('server', server)
gulp.task('reload', reload)

// watchers
const watcher = function(done) {
  gulp.watch(['src/**/*.ts'], gulp.series('lint', 'cleanJS', 'rollup', 'reload'))
  gulp.watch(['examples/**/*.html'], gulp.series('reload'))
  done()
}

// gulp tasks
const defaults = {
  'production': gulp.series('clean', 'lint', 'rollup'),
  'development': gulp.series('clean', 'lint', 'rollup', 'server', watcher)
}

gulp.task('default', defaults[process.env.NODE_ENV]);