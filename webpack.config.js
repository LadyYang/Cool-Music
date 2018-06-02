const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
    entry: {
        scripts: __dirname + '/src/scripts/index.js',
    },
    output: {
        path: __dirname + '/dist/', // 打包后的文件存放的地方
        filename: '[name]/main.js', // 打包后输出文件的文件名,带有md5 hash戳
        publicPath: __dirname + '/dist/images/'
    },
    resolve: {
        extensions: ['.jsx', '.js']
    },
    module: {
        rules: [{
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: /node_modules/ // 不进行编译的目录
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: {
                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    }
                })
            },
            {
                test: /.(jpg|png|gif|svg)$/,
                use: ['url-loader']
            }
        ]
    },
    mode: 'development',
    plugins: [
    //     new HtmlWebpackPlugin({
    //         template: __dirname + '/src/views/index.html',
    //         filename: '../index.html',
    //         minify: {
    //             removeComments: true,
    //             collapseWhitespace: true,
    //             removeRedundantAttributes: true,
    //             useShortDoctype: true,
    //             removeEmptyAttributes: true,
    //             removeStyleLinkTypeAttributes: true,
    //             keepClosingSlash: true,
    //             minifyJS: true,
    //             minifyCSS: true,
    //             minifyURLs: true,
    //         },
    //         chunksSortMode: 'dependency'
    //     }),
        new ExtractTextPlugin('/css/style.css'),
    //     new CleanWebpackPlugin('dist/*', {
    //         root: __dirname,
    //         verbose: true,
    //         dry: false
    //     }),
    //     new webpack.optimize.UglifyJsPlugin(),
    //     new CopyWebpackPlugin([{
    //         from: __dirname + '/src/images',
    //         to: __dirname + '/dist/static/images'
    //     }, {
    //         from: __dirname + '/src/scripts/vector.js',
    //         to: __dirname + '/dist/static/scripts/vector.js'
    //     }]),
    //     new webpack.optimize.ModuleConcatenationPlugin(),
    //     new webpack.optimize.CommonsChunkPlugin({
    //         name: 'vendor',
    //         filename: 'scripts/common/vendor-[hash:5].js'
    //     })
    ]
}