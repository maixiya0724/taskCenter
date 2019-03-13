# myWebpack

#### 项目介绍
基于webpack4 最新的文档和插件，构建的多页面项目,渲染数据用vue框架

#### 软件架构
webpack 4   vue 2.0

#### 安装教程

1. npm install 
2. npm run dev 
3. npm run build
4. npm run report 查看包的大小

#### 参与贡献

1. 部分参考 https://www.jianshu.com/p/2cc4a1078953 感谢大神.
2. 参考 webpack 官方文档

#### 所踩的坑

1. 既然是多页面应用,多页面入口是无可避免的这里通过node里面的 fs.readdirSync() 方法来获取page下的页面数,其中titleConfig是自定义的每个页面的title(注意页面的对应关系),模板里面使用模板语法渲染<%= htmlWebpackPlugin.options.title %>，循环渲染html-webpack-plugin插件，开发环境中的html是存在内存里面，所以可以直接在根目录下查看页面
2. hash 和 chunkhash 和contenthash 的关系
        hash 是所有的chunk公用一个hash，只要代码有改动，就会重新打包，整个项目的缓存就会失效。开发环境里面使用chunkhash报错，
        chunkhash 是根据不同的入口文件,进行依赖文件解析,构建对应的chunk，生成对应的hash，生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用chunkhash的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响
        contenthash 是针对文件内容级别的，只有你自己模块的内容变了，那么hash值才改变.
3. webpack 的entry 入口和output 出口文件也是通过获取page下面的页面数来进行循环生成的，这里注意生成的路径
4. 关于css的拆分和提取压缩
        webpack4是使用mini-css-extract-plugin 插件，开发环境一般不需要用到这个插件，所以一般在生产环境中使用，请注意，使用时可以去掉 MiniCssExtractPlugin.loader 代替style-loader 或者 vue-style-loader 不然会报错 window/document is underfiend,


        {
            test: /\.less$/,
            use: [
            {loader: MiniCssExtractPlugin.loader},
            {loader: "css-loader?importLoaders=1"},
            {loader:'postcss-loader'},
            {loader: "less-loader"},
            ]
        },


        MiniCssExtractPlugin会把js里面引入的样式单独抽离出一个css


            new MiniCssExtractPlugin({ 
            filename: "css/[name].[chunkhash:5].css",
            chunkFilename: "css/common.[chunkhash:5].css"
            })


        filename 设置导出的路径和name
        如果js引入了共同的css MiniCssExtractPlugin会抽离成一个单独的css通过link的方式引入到html里面
        关于css压缩
                css-loader 中自带压缩选项


                {
                    loader: "css-loader",
                    options:{ // 设置css-loader 选项
                    modules:false,//开启css-modules 模式 默认是false
                    localIdentName: '[name]-[local]-[hash:base64:5]', //设置css-modules模式下local类名的命名
                    minimize: true, //压缩css代码, 默认false
                    camelCase: false, //导出以驼峰化命名的类名, 默认false
                    import: true, //禁止或启用@import, 默认true
                    url: true, //禁止或启用url, 默认true
                    sourceMap: false, //禁止或启用sourceMap, 默认false
                    importLoaders: 0, //在css-loader前应用的loader的数目, 默认为0
                    alias: {} //起别名, 默认{}
                    }
                },
                ```
                也可以使用optimize-css-assets-webpack-plugin插件来进行压缩，插件可配置项更多，压缩更彻底,
                ```
                const optimizeCss = require('optimize-css-assets-webpack-plugin');
                optimizeCss()



5. 关于css3兼容的问题 
        利用postcss-loader 来解决css3 的兼容问题 在项目跟文件夹下新建postcss.config.js 内容如下


        module.exports = {
            //  兼容css后缀
            plugins: [
                require("autoprefixer")({
                browsers: [
                    "> 1%",
                    "last 2 versions",
                    "Android >= 4.0",
                    "IOS >=4.0",
                    "last 5 Firefox versions",
                    "Firefox >=10",
                    "Chrome >10",
                    "Safari >= 6",
                    "ie >=9"
                ]
                })
            ]
        };



6. 关于css中background url 中的图片路径问题


        {
          loader:"url-loader",
          options:{
            name:"img/[name].min.[ext]",// 替换background url里面的设置的内容
            limit:20000, // 低于这个值的时候，会被转化为base64的值，减少请求次数
            publicPath:"../static/", // 设置绝对路径 如果publicPath有值  background url 里面的内容 会被替换成 publicPath+name
            outputPath:"static/",// 设置图片的输出路径 根目录是dist
          }
        },


        首先,webpack打包的时候，会自动替换url里面的路径，然后根据options的name属性中设置url,同时把所用到的图片复制到dist目录下，这个可以用outputPath属性来进行控制输出路径，publicPath 设置一个绝对路径，此时background url里面的路径会被替换成publicPath+name 路径,此时outputPath=publicPaht+name 才不会出错,
7. 关于js提取公共插件
        webpack 使用新的提取插件   optimization 可以自定义提取规则 提取的插件会自动插入html中


        optimization: {
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
            minSize: 40000
            }
        }


8. 关于路径别名
        在resolve中的alias可以设置路径别名，使用绝对路径来代替引入


        resolve: {
            alias:{
                vue: 'vue/dist/vue.js',
                "@src":path.resolve("src"),
                "@static": path.resolve("src/static"),
                "@img":path.resolve("src/static/img"),
            },
            extensions: [" ", ".js", ".css", ".jsx", ".less", ".vue"]
        },

        
9. externals
        避免webpack打包的插件,缩小vendor.js 的大小，但是又可以在项目中引用
10. webpack参数详情
        $ webpack --config XXX.js //使用另一份配置文件（比如webpack.config2.js）来打包

        $ webpack --watch //监听变动并自动打包

        $ webpack -p//压缩混淆脚本，这个非常非常重要！

        $ webpack -d//生成map映射文件，告知哪些模块被最终打包到哪里了其中的 
        $ webpack --progress //显示进度条
        $ webpack --color //添加颜色
10. webServer 增加反向代理来进行跨域  在 build api.js 里面配置全局接口路径 通过axios 引入页面中

        proxy:{
            "/api":{
                target:"https://kandian.youth.cn/",
                secure:false,
                pathRewrite:{
                "^/api":""
                }
                /*
                pathRewrite:{
                    "^list":"list"
                }
                用代理首先你得有一个标识,告诉他你这个连接要用代理，不然的话，你的html，css 所有的静态资源全去做了代理
                所以我们只要接口做代理，静态文件用本地,"/api"：{} 就是告诉node 我接口只要是 "/api" 开头的才做代理，所以接口需要些 "/api/xx/xx"，最后的代理路径就是 http://xxx.xx.com/api/xx/xx，可是不对啊，我正确的接口路径里面没有/api啊，所有就需要pathRewrite "^/api":""  设置为空 这样就可以吧api 去掉,如果你的接口里面有/api，就可以 pathRewrite:{ "^/api":"api"} 这样就把api 添加到接口文档里面
                */
            }
        }

11. webpack4 去掉console 
        webpack4 之前用的是 uglifyjs-webpack-plugin 因为webpack4 生产模式自带压缩，但是去掉打印信息还是这个插件
        在 optimization 里面新增压缩选项

        
            // 压缩css
            minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                compress: {
                    warnings: false,
                    drop_debugger: false,
                    drop_console: true
                }
                }
            })
            ]


11. 区分开发环境和生产环境 
        虽然webpack4 新增mode 来区分环境 但是这种写法太麻烦 我们可以在 启动命令行里面 新增 cross-env ENVIROMENT=dev 
        来区分开发环境,在 module.exports = function(env){  } 参数里面可以获取环境变量
        在页面里面通过 process.env.NODE_ENV="development/production" 来判断环境


    


