const mix = require('laravel-mix');
require('dotenv').config();

const { EnvironmentPlugin } = require('webpack');

const fontfaces = [
//   '@fortawesome/fontawesome-free/webfonts',
];

// fontfaces.forEach(font => {
//     mix.copy(`node_modules/${font}`, 'public/fonts');
// });

mix
    .js('src/js/index.js', 'dist/js')
    .sass('src/scss/index.scss', 'dist/css')
    .copyDirectory('src/img', 'dist/img')
    .browserSync({
        proxy: process.env.APP_URL,
        open: false,
    })
    .options({
        processCssUrls: false,
        postCss: [],
    })
    .webpackConfig({
        plugins: [
            new EnvironmentPlugin([
                // required ENV variables
            ]),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src/js'),
            },
        },
        module: {
            rules: [{
                test: /\.js?$/,
                use: [{
                    loader: 'babel-loader',
                    options: mix.config.babel()
                }]
            }]
        }
    })
    .sourceMaps()
    .disableNotifications();
;

if (mix.inProduction()) {
    mix.version();
}
