/**
 * Gulpfile.
 *
 * @author Alexandre Disdier (@alexdisdier)
 * check for outdated dependencies: $ npm outdated
 * update all packages: $npm update
 * if need to update individually: $ npm install packageName@latest --save or --save-dev (we can use i instead of install and -s instead of --save and -d instead of --save)
 * --save-dev is used to save the package for development purpose. Example: unit tests, minification..
 --save is used to save the package required for the application to run.
 * multiple package updated: $ npm i lodash hapi thinky when --save
 * source: https://bytearcher.com/articles/using-npm-update-and-npm-outdated-to-update-dependencies/
 * source: https://futurestud.io/tutorials/npm-quick-tips-2-use-shortcuts-to-install-packages
 */

/**
 * Configuration.
 *
 * Project Configuration for gulp tasks.
 *
 * In paths you can add <<glob or array of globs>>. Edit the variables as per your project requirements.
 */

// START Editing Project Variables.
// Project related.
var project               = 'Product-landing-page';
var projectURL            = 'localhost:8888/_100daysOfCode/R1/responsive_web_design/product_landing_page/src';

var productURL            = './';

var dist                  = './dist/';

// Style related.
var styleSRC              = './src/css/main.css';
var styleDestination      = './src/';

// JS sources.
var jsSRC                 = './src/js/script.js';
var jsDestination         = './src/';
var jsFile                = 'script';

// Images related.
var imgSRC                = './src/img/raw/**/*.{png,jpg,gif,svg}';
var imgDestination        = './src/img/';

// Watch files paths.
var styleWatchFiles       = './src/css/main.css';
var jsWatchFiles          = './src/**/*.js';
var htmlWatchFiles        = './src/*.html';

// Browsers you care about for autoprefixing.
// Browserlist https        ://github.com/ai/browserslist
const AUTOPREFIXER_BROWSERS = [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
  ];

// STOP Editing Project Variables.

/**
 * Load Plugins.
 *
 * Load gulp plugins and passing them semantic names.
 */
var gulp         = require('gulp'); // Gulp of-course

// CSS related plugins.
var minifycss    = require('gulp-uglifycss'); // Minifies CSS files.
var autoprefixer = require('gulp-autoprefixer'); // Autoprefixing magic.
var mmq          = require('gulp-merge-media-queries'); // Combine matching media queries into one media query definition.

// JS related plugins.
var concat       = require('gulp-concat'); // Concatenates JS files
let uglify = require('gulp-uglify-es').default;

// Image realted plugins.
var imagemin     = require('gulp-imagemin'); // Minify PNG, JPEG, GIF and SVG images with imagemin.

// Utility related plugins.
var rename       = require('gulp-rename'); // Renames files E.g. style.css -> style.min.css
var lineec       = require('gulp-line-ending-corrector'); // Consistent Line Endings for non UNIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings)
var filter       = require('gulp-filter'); // Enables you to work on a subset of the original files by filtering them using globbing.
var sourcemaps   = require('gulp-sourcemaps'); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css)
var notify       = require('gulp-notify'); // Sends message notification to you
var browserSync  = require('browser-sync').create(); // Reloads browser and injects CSS. Time-saving synchronised browser testing.
var reload       = browserSync.reload; // For manual browser reload.
var wpPot        = require('gulp-wp-pot'); // For generating the .pot file.
var sort         = require('gulp-sort'); // Recommended to prevent unnecessary changes in pot-file.

var packageSite  = require('gulp-copy');
var zip          = require('gulp-zip');
var gulpSequence = require('gulp-sequence');

/**
 * Task: `browser-sync`.
 *
 * Live Reloads, CSS injections, Localhost tunneling.
 *
 * This task does the following:
 *    1. Sets the project URL
 *    2. Sets inject CSS
 *    3. You may define a custom port
 *    4. You may want to stop the browser from openning automatically
 */
gulp.task( 'browser-sync', function() {
  browserSync.init( {

    // For more options
    // @link http://www.browsersync.io/docs/options/

    // Project URL.
    proxy: projectURL,

    // `true` Automatically open the browser with BrowserSync live server.
    // `false` Stop the browser from automatically opening.
    open: true,

    // Inject CSS changes.
    // Commnet it to reload browser for every CSS change.
    injectChanges: true,

    // Use a specific port (instead of the one auto-detected by Browsersync).
    // port: 7000,

  } );
});

/**
 * Task: `styles`.
 *
 * Compiles Sass, Autoprefixes it and Minifies CSS.
 *
 * This task does the following:
 *    1. Gets the source scss file
 *    2. Compiles Sass to CSS
 *    3. Writes Sourcemaps for it
 *    4. Autoprefixes it and generates style.css
 *    5. Renames the CSS file with suffix .min.css
 *    6. Minifies the CSS file and generates style.min.css
 *    7. Injects CSS or reloads the browser via browserSync
 */
 gulp.task('styles', function () {
    gulp.src( styleSRC )
    .pipe( sourcemaps.init() )
    .on('error', console.error.bind(console))
    .pipe( sourcemaps.write( { includeContent: false } ) )
    .pipe( sourcemaps.init( { loadMaps: true } ) )
    .pipe( autoprefixer( AUTOPREFIXER_BROWSERS ) )

    .pipe( sourcemaps.write ( './' ) )
    .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
    .pipe( gulp.dest( styleDestination ) )

    .pipe( filter( '**/*.css' ) ) // Filtering stream to only css files
    .pipe( mmq( { log: true } ) ) // Merge Media Queries only for .min.css version.

    .pipe( browserSync.stream() ) // Reloads style.css if that is enqueued.

    .pipe( rename( { suffix: '.min' } ) )
    .pipe( minifycss( {
      maxLineLen: 10
    }))
    .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
    .pipe( gulp.dest( styleDestination ) )

    .pipe( filter( '**/*.css' ) ) // Filtering stream to only css files
    .pipe( browserSync.stream() )// Reloads style.min.css if that is enqueued.
    .pipe( notify( { message: 'TASK: "styles" Completed! 💯', onLast: true } ) )
 });

 /**
  * Task: `JS`.
  *
  * Concatenate and uglify JS scripts.
  *
  * This task does the following:
  *     1. Gets the source folder for JS files
  *     2. Concatenates all the files and generates index.js
  *     3. Renames the JS file with suffix .min.js
  *     4. Uglifes/Minifies the JS file and generates index.min.js
  */
gulp.task( 'js', function() {
  gulp.src(jsSRC)
    .pipe( concat( jsFile + '.js') )
    .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
    .pipe( gulp.dest( jsDestination ) )
    .pipe( rename( {
      basename: jsFile,
      suffix: '.min'
    }))
    .pipe( uglify() )
    .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
    .pipe( gulp.dest( jsDestination ) )
    .pipe( notify( { message: 'TASK: "js" Completed! 💯', onLast: true } ) );
 });

 /**
  * Task: `images`.
  *
  * Minifies PNG, JPEG, GIF and SVG images.
  *
  * This task does the following:
  *     1. Gets the source of images raw folder
  *     2. Minifies PNG, JPEG, GIF and SVG images
  *     3. Generates and saves the optimized images
  *
  * This task will run only once, if you want to run it
  * again, do it with the command `gulp images`.
  */
gulp.task( 'img', function() {
  gulp.src( imgSRC )
    .pipe( imagemin( {
          progressive: true,
          optimizationLevel: 3, // 0-7 low-high
          interlaced: true,
          svgoPlugins: [{removeViewBox: false}]
        } ) )
    .pipe(gulp.dest( imgDestination ))
    .pipe( notify( { message: 'TASK: "img" Completed! 💯', onLast: true } ) );
 });

 /**
 * Task: `packageSite`.
 *
 */

gulp.task('packageReady', function () {
   return gulp.src([
     styleDestination + '*.html',
     styleDestination + '*.css',
     styleDestination + '*.js',
     styleDestination + '*.map',
     imgDestination + '*.{png,jpg,gif,svg}',
   ], {
       base: styleDestination,
   })
   .pipe(gulp.dest(dist))
   .pipe( notify( { message: 'TASK: "packageSite" Completed! 💯', onLast: true } ) );
 });

gulp.task('zip', () =>
    gulp.src('dist/**')
         .pipe(zip('product-landing-page.zip'))
         .pipe(gulp.dest(productURL + 'dist/'))
         .pipe( notify( { message: 'TASK: "Zipppppp" Completed! 💯', onLast: true } ) )
 );

gulp.task('packageSite', gulpSequence('packageReady', 'zip'));

 /**
  * Watch Tasks.
  *
  * Watches for file changes and runs specific tasks.
  */

gulp.task( 'default', ['styles', 'js' , 'img', 'browser-sync'], function () {
  gulp.watch( htmlWatchFiles, reload );
  gulp.watch( styleWatchFiles, [ 'styles' ] );
  gulp.watch( jsWatchFiles, [ 'js', reload ] );
 });
