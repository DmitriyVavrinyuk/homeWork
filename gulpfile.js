const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const clearCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
// const { tree } = require('gulp');
const gulpif = require('gulp-if');
const gcmq = require('gulp-group-css-media-queries');
// const less = require('gulp-less');

// const isDev = true; // есть констаната которой мы будет "закоменчивать" sourcepams, когда константа = False, для того что бы убрать карту расположения
// строк кода, что бы не занимать память.
// const isProd = !isDev;
// const isSync = false


const isDev = (process.argv.indexOf('--dev') !== -1);
const isProd = !isDev;
const isSync = (process.argv.indexOf('--sync') !== -1);

console.log(isDev);
console.log(isSync);

/*
	1. browserSync для html
	2. 
		gulp-uncss - удаление неиспользуемого css
		gulp-group-css-media-queries - соединение media-запрос
	3. по желанию pug html препроц
*/


// let cssFiles = [
//     './node_modules/normalize.css/normolize.css',
//     './src/css/base.css',
//     './src/css/grid.css',
//     './src/css/humans.css'
// ];

// подключим модуль npm i del -D
// подключаем модуль browser sync gulp 4 установка npm i browser-sync -D
// подключить модуль отечающий за конкатенацию установка npm i gulp-concat -D
// подключить модуль отвечающий за форматирование, убирает коментарии и производит сжатие
// gulp-clear-css установка npm i gulp-clean-css -D
// подключить плагин gulp-sourcemaps отвечает за формирование карты документа что при форматировании строки не теряли свое место (номер)
// в файле. установка npm i gulp-sourcemaps -D
// подключаем модуль gulp-if. устноавка npm i gulp-if -D
// подключаем модуль gulp-group-css-media-queries. устноавка npm i gulp-group-css-media-queries -D

// scripts
// вводим в КС run gulp dev 
//вводим в КС run gulp build
// "test": "echo \"Error: no test specified\" && exit 1"

function clear(){
    return del('./build/*');
}

function styles(){
    return gulp.src('./src/css/**/*.css' ) // cssFiles
                .pipe(gulpif(isDev, sourcemaps.init()))
                .pipe(concat('style.css'))
                .pipe(gcmq())
                // .pipe(concat('script.js'))
                .pipe(autoprefixer({
                    browsers: ['> 0.1%'], // last 2 versions 
                    cascade: false
                }))  
                .pipe(gulpif(isProd, clearCSS({
                    level: 2
                })))
                .pipe(gulpif(isDev, sourcemaps.write()))
                .pipe(gulp.dest('./build/css'))
                .pipe(gulpif(isSync,browserSync.stream()));
}

function img(){
    return gulp.src('./src/img/**/*.png')
               .pipe(gulp.dest('./build/img'));
}

function html(){
    return gulp.src('./src/*.html')
               .pipe(gulp.dest('./build'))
               .pipe(gulpif(isSync, browserSync.stream()));
}

function watch(){
    if(isSync){
        browserSync.init({
            server:{
                baseDir: "./build/"
            }
        });
    }
    gulp.watch('./src/css/**/*.css', styles);
    // gulp.watch('./src/js/*.js', scripts);
    gulp.watch('./src/*.html', html);
}


// две функции которые объеденяют все функции во едино, но отличие лишь в том что объеденяет паралельно все - parallel,
// вторая последовально - series. Можно вложить один другой. Сперва запускает очистку а потом все параллельно загружаем

let build = gulp.series(clear,
    gulp.parallel(styles, /*scripts,*/ img, html) 
);

// gulp.task('css', styles);
// gulp.task('img', img);
// gulp.task('html', html);
// gulp.task('clear', clear);
gulp.task('build', build);
gulp.task('watch', gulp.series(build, watch));