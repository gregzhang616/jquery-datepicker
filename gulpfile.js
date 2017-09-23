/**
 * Created by Greg Zhang on 2017/1/14.
 */
var gulp = require('gulp'),
    gulpUglify = require('gulp-uglify'),
    markdown = require('gulp-markdown'),
    $dev = require('gulp-load-plugins'),
    inline_base64 = require('gulp-inline-base64'),
    srcBasePath = 'src/',
    srcAssetsPath = srcBasePath + 'assets/',
    srcI18nPath = srcBasePath + 'i18n/',
    srcDocsPath = srcBasePath + 'docs/',
    distBasePath = 'dist/',
    distAssetsPath = distBasePath + 'assets/',
    distI18nPath = distBasePath + 'i18n/',
    distDocsPath = distBasePath + 'docs/',
    srcSassPath = srcBasePath + 'sass/',
    componentSassList = [
      srcSassPath + 'datepicker-date.scss'
    ];

var renderer = new markdown.marked.Renderer();
renderer.link = function (href, title, text) {
  var s = '<a href="'+ href +'" title="' + title;
  if (href.indexOf("#") !== 0) {
    s += '" target="_blank';
  }
  s += '">' + text + '</a>';
  return s;
};

gulp.task('copy-html', function () {
  return gulp.src(srcBasePath + '**/*.html')
    .pipe(gulp.dest(distBasePath))
    .pipe($dev().connect.reload());
});

gulp.task('process-docs', function () {
  return gulp.src(srcDocsPath + '**/*.md')
    .pipe(markdown({renderer: renderer}))
    .pipe(gulp.dest(distDocsPath))
    .pipe($dev().connect.reload());
});

gulp.task('copy-assets', function () {
  return gulp.src(srcAssetsPath + '**/*.{js,css,jpg,png,ico}')
    .pipe(gulp.dest(distAssetsPath))
    .pipe($dev().connect.reload());
});

gulp.task('process-component-sass', function () {
  return gulp.src(componentSassList)
    .pipe($dev().sass())
    .pipe(inline_base64({
      baseDir: srcAssetsPath,
      maxSize: 14,
      debug: true
    }))
    .pipe($dev().autoprefixer({
      browsers: ["last 10 versions"]
    }))
    .pipe($dev().concat('jquery.datepicker.css'))
    .pipe(gulp.dest(distBasePath + 'css'))
    .pipe($dev().minifyCss())
    .pipe($dev().rename('jquery.datepicker.min.css'))
    .pipe(gulp.dest(distBasePath + 'css'))
    .pipe($dev().connect.reload());
});

gulp.task('process-component-js', function () {
  return gulp.src(srcBasePath + 'js/*.js')
    .pipe($dev().concat('jquery.datepicker.js'))
    .pipe(gulp.dest(distBasePath + 'js/'))
    .pipe(gulpUglify())
    .pipe($dev().rename('jquery.datepicker.min.js'))
    .pipe(gulp.dest(distBasePath + 'js'))
    .pipe($dev().connect.reload());
});

gulp.task('process-i18n-js', function () {
  return gulp.src(srcI18nPath + '*.js')
    .pipe(gulp.dest(distI18nPath))
    .pipe($dev().connect.reload());
});

gulp.task('server', function () {
  $dev().connect.server({
    root: distBasePath,
    port: 8081,
    livereload: true
  });
});

// Watch task.
gulp.task('watch', function () {
  gulp.watch(srcBasePath + '**/*.html', ['copy-html']);
  gulp.watch(srcDocsPath + '**/*.md', ['process-docs']);
  gulp.watch(componentSassList, ['process-component-sass']);
  gulp.watch(srcBasePath + 'js/*.js', ['process-component-js']);
  gulp.watch(srcI18nPath + '*.js', ['process-i18n-js']);
  gulp.watch(srcAssetsPath + '**/*.{js,css}', ['copy-assets']);
});

gulp.task('default', ['copy-html', 'copy-assets', 'process-docs',
  'process-component-sass', 'process-component-js', 'process-i18n-js',
  'server', 'watch']);
