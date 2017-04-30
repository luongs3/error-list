const { mix } = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.react('resources/assets/js/admin/admin.js', 'public/js')
.react('resources/assets/js/client/client.js', 'public/js')
.sass('resources/assets/sass/vendors/style.sass', 'public/css/vendor.css')
.sass('resources/assets/sass/app.sass', 'public/css')
.sass('resources/assets/sass/admin/admin.sass', 'public/css')
.sass('resources/assets/sass/client/client.sass', 'public/css');

mix.browserSync({
    proxy: 'error-list.local'
});

if (mix.config.inProduction) {
    mix.version();
}
