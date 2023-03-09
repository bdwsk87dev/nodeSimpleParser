const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry:['./parser.js'],
    output: {
        path: path.join(__dirname,'public'),
        filename: 'parser.js',
        publicPath: 'public'
    },
    resolve: {
        extensions: ['.js'],
        fallback: {
            "fs": false,
            "tls": false,
            "net": false,
            "path": false,
            "zlib": false,
            "http": false,
            "https": false,
            "stream": false,
            "crypto": false,
        }
    },
    devtool: 'cheap-module-source-map',
    module:{
        rules:[
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    }
}