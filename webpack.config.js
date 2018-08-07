const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

function setHTMLConfig(name, config = {}) {
    var {
        inject = true,
            hash = false,
            chunks = [],
            favicon = '',
            title = 'MUSIC',
    } = config;

    return new HtmlWebpackPlugin({
        filename: `pages/${name}/${name}.html`,
        template: `src/pages/${name}/${name}.html`,
        inject: inject,
        favicon: favicon,
        hash: hash,
        chunks: chunks.concat(name),
        title: title
    })
}

module.exports = {
    entry: {
        'main': './src/pages/main/main.js',
        'error': './src/pages/error/error.js',
    },
    output: {
        path: __dirname + '/dist/',
        filename: 'pages/[name]/[name]-[hash:5].js',
        // publicPath: 'http://localhost:81/'
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
                    fallback: ['style-loader'],
                    use: ['css-loader'],
                })
            },
            // {
            //     test: /\.css$/,
            //     use: ['css-loader']
            // },
            {
                test: /\.html$/,
                use: ['html-loader']
            }
        ]
    },
    plugins: [
        setHTMLConfig('main'),
        setHTMLConfig('error'),
        new ExtractTextPlugin('pages/[name]/[name]-[hash:5].css')
        // new UglifyJSPlugin()
    ]
}