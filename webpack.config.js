const resolve = require('path').resolve
const webpack = require('webpack')
const HappyPack = require('happypack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const url = require('url')


module.exports = (options = {}) => {

    let publicPath = ''
    if (options.prod) {
        publicPath = 'http://portal.uaa.qiyi.domain/adhoc-sql/static/'
    } else if (options.test) {
        publicPath = 'http://portal.uaa.qiyi.domain/adhoc-sql-test/static/'
    }

    console.info("==> publicPath", publicPath)

    return {
        entry: {
            vendor: './src/vendor',
            index: './src/main.js'
        },
        output: {
            path: resolve(__dirname, 'dist'),
            filename: options.dev ? '[name].js' : '[name].js?[hash]',
            chunkFilename: '[id].js?[hash]',
            publicPath
        },
        module: {
            rules: [{
                test: /\.vue$/,
                use: ['vue-loader']
            }, {
                test: /\.js$/,
                use: ['happypack/loader?id=babel'],
                include: [resolve('src'), resolve('node_modules/element-ui/src/mixins/emitter.js')]
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            }, {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            }, {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000
                    }
                }]
            }]
        },
        plugins: [
            //判断是否为dev模式
            new webpack.DefinePlugin({
                __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV) || false))
            }),

            //使编译后体积压缩到最小
            // new webpack.DefinePlugin({
            //    'process.env' : {
            //        'NODE_ENV' : JSON.stringify(process.env.NODE_ENV)
            //    }
            // })

            //new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG']),

            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),

            //实现热加载
            new webpack.HotModuleReplacementPlugin(),

            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'manifest'],
                minChunks: Infinity
            }),
            new HtmlWebpackPlugin({
                template: 'src/index.html'
            }),
            new HappyPack({
                id: 'babel',
                threads: 6,
                loaders: ['babel-loader']
            })
        ],
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '~': resolve(__dirname, 'src')
            }
        },
        node: {
            net: 'empty',
        },
        devServer: {
            host: 'localhost',
            port: 8000,
            publicPath: '/adhoc-sql/',
            historyApiFallback: {
                index: url.parse(options.dev ? '/assets/' : publicPath).pathname,
                disableDotRule: true,
                rewrites: [
                    {from: /^index.html$/, to: '/index.html'}
                ]
            },
            // proxy: {
            //     '/adhoc-sql/': {
            //         target: 'http://10.154.2.238:8082',
                    
            //         //target: 'http://gateway.bi.online.qiyi.qae',
            //         pathRewrite: {"^/adhoc-sql/": "/"},
            //         changeOrigin: true
            //     }
            // },
        },
        devtool: options.dev ? '#eval-source-map' : '#eval'
    }
}
