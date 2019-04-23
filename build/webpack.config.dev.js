//开发配置
const webpack = require("webpack");
const webpackMerge = require("webpack-merge")
const { resolve } = require("./bundle")
const { initLoader } = require("./loader.js")
const webpackBaseFn = require("./webpack.config.base");
module.exports = function(env) {
    const baseConfig = webpackBaseFn(env)
    return webpackMerge(baseConfig, { // 
        devtool: "cheap-module-source-map",
        mode: "development",
        devServer: {
            hot: true,
            open: true,
            inline: true,
            port: "8080",
            host: "172.16.0.185",
            //配置反向代理
            proxy: {
                "/api": {
                    target: "https://kandian.youth.cn/",
                    secure: false,
                    pathRewrite: {
                        "^/api": ""
                    }
                }
            }
        },

    })

}