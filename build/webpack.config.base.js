// webpack 基本配置
const CleanWebpackPlugin = require("clean-webpack-plugin")
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { externals } = require("./externals")
const { initConfig, resolve } = require("./bundle")
const { initLoader } = require("./loader")
const config = {
    // 加载器
    module: {
        rules: [],
    },
    resolve: {
        extensions: [" ", ".js", ".css", ".jsx", ".less", ".vue", ".scss", ".sass"]
    },
    externals: externals,
    plugins: [
        new VueLoaderPlugin(),

    ],
}

module.exports = function(env) {
    const {
        entry,
        output,
        alias,
        htmlPlugins
    } = initConfig(env)
    const loaders = initLoader(env);

    config.entry = entry;
    config.output = output;
    config.resolve.alias = alias;
    config.module.rules.push(...loaders);
    config.plugins.push(...htmlPlugins)

    return config;
}