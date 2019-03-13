// 提取loader 
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 分离css 这个插件默认在生产环境下使用具体见 https://github.com/webpack-contrib/mini-css-extract-plugin
const jsLoader = {
    test: /.js$/,
    exclude: "/node_modules/",
    use: ["babel-loader"],
}

const vueLoader = {
    test: /.vue$/,
    use: ["vue-loader"],
    exclude: "/node_modules/",
}
const eslintLoader = { // 代码检查
    test: /\.(js|vue)$/,
    enforce: "pre",
    exclude: /node_modules/,
    loader: "eslint-loader",
    options: {
        fix: true,
        emitWarning: true,
    }
}
const cssLoader = {
    test: /\.css$/,
    use: ["style-loader", "vue-style-loader", "css-loader", "postcss-loader"],
    exclude: "/node_modules/",
}

const lessLoader = {
    test: /\.less$/,
    exclude: "/node_modules/",
    use: [
        { loader: 'vue-style-loader' },
        { loader: "css-loader" },
        { loader: "less-loader" },
        { loader: 'postcss-loader' }
    ]
}

const imgLoader = {
    test: /\.(png|jpg|jpeg|gif)$/,
    exclude: "/node_modules/",
    use: [{
            loader: "url-loader",
            /*
              打包的时候webpack会把scss文件中的background url 替换为我们webpack配置文件中的options的name属性中设置的内容，
              同时吧css文件中的background url 中的图片文件给赋值到webpack配置文件中options的name属性所指向路径下，webpack 配置文件中的options 的name属性所指向路径，是相对路径，相对于dist文件夹，也就是根目录是dist文件夹 可通过加入 publicPath 来指定 部署时的绝对路径
            */
            options: {
                name: "img/[name].min.[ext]", // 替换background url里面的设置的内容
                limit: 20000, // 低于这个值的时候，会被转化为base64的值，减少请求次数
                publicPath: "../static/", // 设置绝对路径 如果publicPath有值  background url 里面的内容 会被替换成 publicPath+name
                outputPath: "static/", // 设置图片的输出路径 根目录是dist
            }
        },
        // 压缩图片
        {
            loader: "image-webpack-loader",
            // 优化配置
            options: {
                mozjpeg: {
                    progressive: true,
                    quality: 65
                },
                // optipng.enabled: false will disable optipng
                optipng: {
                    enabled: false,
                },
                pngquant: {
                    quality: '65-90',
                    speed: 4
                },
                gifsicle: {
                    interlaced: false,
                },
                // the webp option will enable WEBP
                webp: {
                    quality: 75
                }
            }
        }
    ]
}
const fontLoader = {
    test: /\.(eot|woff2?|ttf|svg)$/,
    exclude: "/node_modules/",
    use: [{
        loader: "url-loader",
        options: {
            name: "[name]-[hash:5].min.[ext]",
            limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
            publicPath: "fonts/",
            outputPath: "fonts/",
        }
    }]
}
exports.initLoader = function(env) { // 在这里判断开发环境进行不同的
    var loaders = [];
    if (env !== "dev") { //生产环境
        //重写 生产环境 cssLoader
        cssLoader.use = [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"];
        loaders.push()
        console.log(loaders)
            // 重写lessLoader
        lessLoader.use = [{ loader: MiniCssExtractPlugin.loader }, { loader: "css-loader?importLoaders=1" }, { loader: 'postcss-loader' }, { loader: "less-loader" }];
    }

    loaders.push(
        vueLoader,
        cssLoader,
        lessLoader,
        jsLoader,
        imgLoader,
        //eslintLoader,
        fontLoader
    )
    return loaders;
}