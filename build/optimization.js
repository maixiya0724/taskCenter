// 提取公共js 压缩js

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const optimizeCss = require('optimize-css-assets-webpack-plugin');

module.exports = {
    minimizer: [new optimizeCss({})], // 压缩css
    noEmitOnErrors: true, //编译时出现错误跳过
    removeEmptyChunks: true,
    // 提取公共的js插件 用 cacheGroups 自定义提取规则
    splitChunks: {
        cacheGroups: {
            // 比如你要单独把jq之类的官方库文件打包到一起，就可以使用这个缓存组，如想具体到库文件（jq）为例，就可把test写到具体目录下
            vendor: {
                test: /node_modules/,
                name: "vendor",
                priority: 10,
                enforce: true
            },
            //这里定义的是在分离前被引用过两次的文件，将其一同打包到common.js中，最小为30K
            common: {
                name: "common",
                minChunks: 2,
                minSize: 30000
            }
        },
        chunks: "all",
        minSize: 40000,
    },
    // 压缩js
    minimizer: [
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false,
                    drop_debugger: false,
                    //drop_console: true
                }
            }
        })
    ]
}