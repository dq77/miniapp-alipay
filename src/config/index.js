/*
 * @Description: 
 * @Version: 1.0
 * @Author: Pengbin Zhang
 * @Date: 2020-03-26 14:56:37
 * @LastEditors: Pengbin Zhang
 * @LastEditTime: 2020-04-02 14:24:29
 */
// 请求连接前缀
// export const baseUrl = 'https://ms-api.caibowen.net';
// export const baseUrl = 'http://10.5.0.243:9090' // 天华
// export const baseUrl = 'http://101.37.150.73:8080'
// export const baseUrl = 'http://47.98.113.37:8080'
// export const baseUrl = 'http://10.5.0.32:8080'
// export const baseUrl = 'https://pay.taozugong.cn:9092';
// export const baseUrl = 'http://10.5.0.248:9764';   // 青宝

/**
 * 测试服务启地址  https://api.taozugong.cn/api   (http://101.37.150.73:8080)
 */

export const baseUrl = "https://api.taozugong.cn";
// export const baseUrl = "https://service.taozugong.com";
// export const baseUrl = 'http://101.37.150.73:8080' // 接口地址

// export const serviecUrl = 'https://jd.taozugong.cn' // 服务器地址
// export const serviecUrl = 'https://m.taozugong.com' // 服务器地址
// export const serviecUrl = 'https://alipay.taozugong.cn' // 支付宝生活号地址
export const serviecUrl = "https://alipay.taozugong.com"; // 支付宝生活号地址
// export const serviecUrl = 'https://jd.taozugong.com' // 正式环境地址

// export const imgUploadUrl = 'https://api.taozugong.cn' // 图片上传地址
export const imgUploadUrl = "https://service.taozugong.com"; // 图片上传地址

export const jdAuthorizationUrl =
  "http://opencredit.jd.com/oauth2/bind?merchantCode=73024369"; // 京东权益授权页面地址

export const alipayLifeAuthorizationUrl =
  "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017091208699638&scope=auth_user"; // 支付宝授权页面地址
// 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017082808426743&scope=auth_user' // 支付宝授权页面测试地址

// OSS CDN 图片地址
export const CDNUrl = "https://assets.taozugong.com";

// 输出日志信息
export const noConsole = true;
