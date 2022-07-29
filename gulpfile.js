var gulp = require('gulp'),
	sass = require('gulp-sass')(require('sass')),
	rename = require('gulp-rename'),
	browserSync = require('browser-sync'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	cssmin = require('gulp-cssmin'),
	htmlmin = require('gulp-htmlmin'),
	copyFiles = require('gulp-copy'),
	through = require('through2');

gulp.task('sass', function () {
  return gulp.src([
  		'node_modules/normalize.css/normalize.css',
  		"src/scss/style.scss"
  	])
  	.pipe(concat('main.scss'))
	.pipe(sass({outputStyle: 'compressed' })) //compressed-минифицирует код
	.pipe(rename({suffix: '.min' })) //переименовывает css
	.pipe(autoprefixer({
		overrideBrowserslist: ['last 8 versions']
	}))
	.pipe(gulp.dest("docs/css"))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('html', function(){
	return gulp.src('src/*.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('docs'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('js', function(){
	return gulp.src(['src/js/main.js'])
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('docs/js'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('copy', function(){
	return gulp
		.src([
			'src/img/*.*',
			'src/img/icon/*.*'
		])
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
	gulp.watch('src/scss/style.scss', gulp.parallel('sass', 'html', 'js'));  //строка следит за scss и запускакт параллельно плагин sass
	gulp.watch('src/*.html', gulp.parallel('sass', 'html', 'js'));
	gulp.watch('src/js/main.js', gulp.parallel('sass', 'html', 'js'));
	gulp.watch('src/img/icon/*.*', gulp.parallel('sass', 'html', 'js', 'copy'));
	gulp.watch('src/img/*.*', gulp.parallel('sass', 'html', 'js', 'copy'));
});

gulp.task('default', gulp.parallel('sass', 'html', 'js', 'copy', 'watch', 'browser-sync'))

function verify() {
	var options = { objectMode: true };
	return through(options, write, end);

	function write(file, enc, cb) {
		console.log('file', file.path);
		cb(null, file);
	}

	function end(cb) {
		console.log('done');
		cb();
	}
}