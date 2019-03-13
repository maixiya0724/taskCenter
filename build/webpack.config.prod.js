//生产设置
const webpackMerge = require("webpack-merge");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const optimizeCss = require('optimize-css-assets-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { resolve } = require("./bundle")
const { externals } = require("./externals")
const webpackBaseFn = require("./webpack.config.base");
const optimization = require("./optimization")
module.exports = function(env, { option }) {
    const baseConfig = webpackBaseFn(env)
    const reportOn = option === "report"
    const plugins = [
        //  分离css 提取公共的css
        new MiniCssExtractPlugin({
            filename: "css/[name].[chunkhash:5].css",
            chunkFilename: "css/common.[chunkhash:5].css"
        }),
        //压缩css
        new optimizeCss({// 配置cssnano 如果使用默认 new optimizeCss() 默认会去掉默认不需要的css兼容
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {discardComments: { removeAll: true } },
            minimize:true,
        }), // 普通压缩
        new CleanWebpackPlugin(["dist"], {
            root: resolve(""), // 设置根节点
            verbose: true, //开启在控制台输出信息
            dry: false,
        }),
    ];
    if (reportOn) { // 如果有report 显示打包体积
        plugins.push(new BundleAnalyzerPlugin())
    }

    return webpackMerge(baseConfig, {
        mode: "production",
        optimization: optimization,
        externals,
        plugins
    });
}