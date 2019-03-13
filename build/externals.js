//声明插件 避免webpack打包的插件,缩小vendor.js 的大小，在html里通过script标签进行引用,但是又可以在项目中引用

exports.externals = {
    "vue": "Vue",
    "axios": "axios",
    'babel-polyfill': "window"
}