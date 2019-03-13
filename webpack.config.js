const env = process.env.ENVIROMENT.trim();
const webpackConfigFn = require(`./build/webpack.config.${env}.js`) // 通过环境来执行
const option = process.env.OPTION ? process.env.OPTION.trim() : "";
module.exports = webpackConfigFn(env, { option })