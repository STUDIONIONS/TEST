let gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
let rename = require('gulp-rename');
let browserSync = require('browser-sync');
let autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cssmin = require('gulp-cssmin');

gulp.task('sass', function () {
  return gulp.src([
  		'node_modules/normalize.css/normalize.css',
  		"docs/scss/style.scss"
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
/*
gulp.task('style', function(){
	return gulp.src([
		'node_modules/normalize.css/normalize.css',
		'node_modules/magnific-popup/dist/magnific-popup.css',
		'node_modules/slick-carousel/slick/slick.css'
	])
	.pipe(concat('libs.min.css'))
	.pipe(cssmin())
	.pipe(gulp.dest('docs/css'))
});

gulp.task('script', function(){
	return gulp.src([
		'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
		'node_modules/slick-carousel/slick/slick.js'
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('docs/js'))
});
*/
gulp.task('html', function(){
	return gulp.src('*.html')
		.pipe(browserSync.reload({stream: true}))
});
gulp.task('js', function(){
	return gulp.src(['docs/js/main.js'])
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('docs/js'))
		.pipe(browserSync.reload({stream: true}))
});


gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: "docs/"
		}
	});
});

gulp.task('watch', function(){
	gulp.watch('docs/scss/style.scss', gulp.parallel('sass'));  //строка следит за scss и запускакт параллельно плагин sass
	gulp.watch('docs/*.html', gulp.parallel('html'));
	gulp.watch('docs/js/main.js', gulp.parallel('js'));
});

gulp.task('default', gulp.parallel('sass', 'watch', 'browser-sync'))