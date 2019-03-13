// 设置路径别名
const path = require("path")
const alias = {
    vue: 'vue/dist/vue.js',
    "@src": path.resolve("src"),
    "@static": path.resolve("src/static"),
    "@img": path.resolve("src/static/img"),
    "@build": path.resolve("build"),
    "@utils": path.resolve("src/utils"),
    "@component": path.resolve("src/component")
}
module.exports = alias