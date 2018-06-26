const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        'js/main': './src/scripts/main.js',
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        // publicPath: '../dist/images'
    },
    mode: 'development',
    module: {
        rules: [{
                test: /\.js$/,
                use: ['babel-loader']
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: ['url-loader?limit=8192&name=images/[name].[ext]']
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                })
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: '/views/index.html',
            template: 'src/views/index.html',
        }),
        new HtmlWebpackPlugin({
            filename: '/views/error.html',
            template: 'src/views/error.html',
            inject: false,
            minify: {
                removeComments: true,
                collapseWhitespace: false
            }
        }),
        new ExtractTextPlugin({
            filename: (getPath) => {
                return getPath('css/index.css').replace("js", "css")
            }
        }),
        // new UglifyJSPlugin()
    ]
}