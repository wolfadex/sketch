var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, './dist/'),
        filename: 'bundle.js'
    },
    devServer: {
        publicPath: '/dist/',
        stats: { chunks: true }
    },
    devtool: 'inline-source-map',
    resolve: {
        alias: {
            actions: path.resolve(__dirname, './src/actions'),
            components: path.resolve(__dirname, './src/components'),
            containers: path.resolve(__dirname, './src/containers'),
            reducers: path.resolve(__dirname, './src/reducers'),
            root: path.resolve(__dirname, './src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!less-loader',
                }),
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                }),
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].css'),
    ],
}
