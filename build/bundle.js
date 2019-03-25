// 动态渲染出入口,页面
const fs = require("fs")
const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin")
const alias = require("./alias")
const resolve = (p) => path.resolve(__dirname, "..", p)
const titleConfig = require("./titleConfig")

const entryDir = resolve("src/page")
const outputDir = resolve("dist")
const templatePath = resolve("./index.html")
const entryFiles = fs.readdirSync(entryDir)
const
    entry = {},
    output = {}
htmlPlugins = [];
var entryFilesArr = entryFiles;
var entryFilesObj = []
    // Map alias
function resolveAlias() {
    Object.keys(alias).forEach(attr => {
        const val = alias[attr]
        alias[attr] = resolve(val)
    })
}

function resolveEntryAndOutput(env) {
    entryFiles.forEach(dir => {
        entry[dir] = path.resolve(__dirname, `${entryDir}/${dir}/${dir}`)
        if (env == "dev") { //区分环境
            output.filename = "js/[name].min.[hash:5].js";
        } else {
            //output.filename = "js/[name].min.[hash:5].js";
            output.filename = "js/[name].min.js";
        }
        output.path = outputDir;
    })
}

function combineHTMLWithTemplate() { // 动态生成html模板 自动检测模板数和配置title
    entryFilesArr.map(function(item, index) {
        let obj = {}
        obj.name = item
        entryFilesObj.push(obj)
    })
    titleConfig.map(function(item, index) {
        entryFilesObj[index].title = item
    })
    entryFilesObj.forEach(item => {
        const htmlPlugin = new HTMLWebpackPlugin({
            title: item.title,
            template: "./index.html",
            chunks: [item.name, "vendor"],
            filename: `${item.name}.html`,
            inject: true,
            cache: true,
            minify: { // 压缩
                removeComments: true, // 去除注释
                collapseWhitespace: true //是否去除空格
            }
        })
        htmlPlugins.push(htmlPlugin)
    })
}

function initConfig(env) {
    resolveAlias();
    resolveEntryAndOutput(env);
    combineHTMLWithTemplate();
    return {
        entry,
        output,
        alias,
        htmlPlugins
    }
}

exports.initConfig = initConfig;
exports.resolve = resolve;