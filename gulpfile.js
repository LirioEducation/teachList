var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var karma = require('karma').server;
var plugins = require('gulp-load-plugins')();


var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});


/**
* Test task, run test once and exit
*/
gulp.task('test', function(done) {
    karma.start({
        configFile: __dirname + '/tests/my.conf.js',
        singleRun: true
    }, function() {
        done();
    });
});

gulp.task('lint', function() {
  return gulp.src('./platforms/ios/www/js/*/*.js')
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});


gulp.task('fixjs', function() {
  return gulp.src('./platforms/ios/www/js/*/*.js')
      .pipe(plugins.fixmyjs())
      .pipe(gulp.dest("./platforms/ios/www/js/"));
});


gulp.task('todo', function() {
    gulp.src('www/js/*.js')
        .pipe(plugins.todo())
        .pipe(plugins.todo.reporter('json', {fileName: 'todo.json'}))
        .pipe(gulp.dest('./'));
});

gulp.task('quality', ['lint', 'fixjs', 'todo']);