// 配置反向代理url
export default {
    returnUrl:function(){
        if(process.env.NODE_ENV=="development"){
            return "/api"
        }else{
            return ""
        }
    }
}