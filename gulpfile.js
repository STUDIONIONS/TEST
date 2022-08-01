var gulp = require('gulp'),
	sass = require('gulp-sass')(require('sass')),
	rename = require('gulp-rename'),
	browserSync = require('browser-sync'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	cssmin = require('gulp-cssmin'),
	htmlmin = require('gulp-htmlmin'),
	ttf2woff = require('gulp-ttf2woff'),
	ttf2woff2 = require('gulp-ttf2woff2'),
	copyFiles = require('gulp-copy'),
	through = require('through2'),
	debug = require('gulp-debug'),
	tildify = require('tildify'),
	chalk = require('chalk'),
	plur = require('plur'),
	logger = require('fancy-log'),
	stringifyObject = require('stringify-object');

const prop = chalk.cyan,
	verify = function () {
		var options = { objectMode: true };
		return through(options, write, end);

		function write(file, enc, cb) {
			logger('Copy to file: ' + prop(tildify(file.path)));
			cb(null, file);
		}

		function end(cb) {
			logger(prop(tildify('done')));
			cb();
		}
	};

gulp.task('sass', function () {
  return gulp.src([
  		'src/scss/fonts.scss',
  		'node_modules/normalize.css/normalize.css',
  		"src/scss/style.scss"
  	])
  	.pipe(debug())
  	.pipe(concat('main.scss'))
	.pipe(sass({outputStyle: 'compressed' })) //compressed-минифицирует код
	.pipe(rename({suffix: '.min' })) //переименовывает css
	.pipe(autoprefixer({
		overrideBrowserslist: ['last 8 versions']
	}))
	.pipe(gulp.dest("docs/css"))
});

gulp.task('html', function(){
	return gulp.src('src/*.html')
		.pipe(debug())
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('docs'))
});

gulp.task('js', function(){
	gulp.src([
			'src/js/main.js',
			'src/js/search.js',
		])
		.pipe(debug())
		.pipe(concat('test.js'))
		.pipe(gulp.dest('docs/js'));
	return gulp.src([
			'src/js/main.js',
			'src/js/search.js',
		])
		.pipe(debug())
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('docs/js'))
});

gulp.task('ttf2woff', function(){
	return gulp.src(['src/fonts/*.ttf'])
		.pipe(debug())
    	.pipe(ttf2woff())
    	.pipe(gulp.dest('docs/fonts/'));
});

gulp.task('ttf2woff2', function(){
	return gulp.src(['src/fonts/*.ttf'])
		.pipe(debug())
		.pipe(ttf2woff2())
		.pipe(gulp.dest('docs/fonts/'));
});

gulp.task('copyFonts', function(){
	return gulp
		.src([
			'src/fonts/*.ttf'
		])
		.pipe(debug())
		.pipe(copyFiles('docs/fonts/', {prefix: 2}))
		.pipe(verify())
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('copy', function(){
	return gulp
		.src([
			'src/img/*.*',
			'src/img/icon/*.*'
		])
		.pipe(debug())
		.pipe(copyFiles('docs/images/', {prefix: 2}))
		.pipe(verify());
})

gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: "docs/"
		}
	});
});

gulp.task('watch', function(){
	gulp.watch('src/scss/style.scss', gulp.parallel('sass', 'html', 'js', 'copy', 'copyFonts'));
	gulp.watch('src/*.html', gulp.parallel('sass', 'html', 'js', 'copy', 'copyFonts'));
	gulp.watch('src/js/*.js', gulp.parallel('sass', 'html', 'js', 'copy', 'copyFonts'));
	gulp.watch('src/img/icon/*.*', gulp.parallel('sass', 'html', 'js', 'copy', 'copyFonts'));
	gulp.watch('src/img/*.*', gulp.parallel('sass', 'html', 'js', 'copy', 'copyFonts'));
});

gulp.task('default', gulp.parallel('ttf2woff', 'ttf2woff2', 'sass', 'html', 'js', 'copy', 'copyFonts', 'watch', 'browser-sync'))
