import Taro from "@tarojs/taro";
import {
  serviecUrl,
  jdAuthorizationUrl,
  alipayLifeAuthorizationUrl
} from "../config/index";
import {
  setCookie,
  getCookie,
  hasToken,
  delCookie,
  delSessionItem
} from "./save-token";
import {
  fetchjdaccredit,
  fetchaliaccredit,
  fetchappminiaccredit,
  fetchIsbindPhone,
  fetchTokenisUseless
} from "../api/accredit";
import getChannel from "./channel";
import { set as setBlobalData } from "../global_data";

const filterUrlArr =
  getChannel() === "JDBT"
    ? ["/pages/home/index", "/pages/user/index", "/"]
    : ["#/pages/home/index", "#/pages/user/index", "/"];

// 不同渠道走不同的授权流程
export function channelAccredit(type) {
  return new Promise(resolve => {
    switch (getChannel()) {
      case "JDBT":
        jdAccredit();
        break;
      case "ALIPAY_LIFE":
        getUsersUID();
        break;
      case "APLIPAY_MINI_PROGRAM":
        if (type == "Failure") {
          Taro.showToast({
            title: "您的登录已失效,需要重新授权登录",
            icon: "fail"
          });
          delCookie("openid");
          delCookie("Token");
          delSessionItem("userInfo");
          delCookie("loginStatus");
        } else {
          alipayAppauth().then(() => {
            resolve();
          });
        }
        break;
      default:
        break;
    }
  });
}

// 获取url中的参数
export function getParams(url, key) {
  // var urlArray = url.split("?");
  //var url = urlArray[1].replace(/^\?/, '').split('&');
  var url = url
    .substr(url.indexOf("?") + 1)
    .replace(/^\?/, "")
    .split("&");
  var paramsObj = {};
  for (var i = 0, iLen = url.length; i < iLen; i++) {
    var param = url[i].split("=");
    paramsObj[param[0]] = param[1];
  }
  if (key) {
    return paramsObj[key] || "";
  }
  return paramsObj;
}

//获取url?后面参数
export function GetRequest(url, name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = url.match(reg); //search,查询？后面的参数，并匹配正则

  if (r != null) return unescape(r[2]);
  return null;
}

export function aliGetrequest(name) {
  let index = window.location.hash.substr(1).indexOf("?");
  if (index) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.hash
      .substr(1)
      .substr(index + 1)
      .match(reg);
    if (r != null) return r[2];
    return null;
  }
}

export function applicationAccredit() {
  // 不同页面走不同的授权操作
  switch (getChannel()) {
    case "JDBT": // 京东白条信用
      navToJDAccredit().then(
        () => {
          jdAccredit();
        },
        () => {}
      );
      break;
    case "ALIPAY_LIFE": // 支付宝生活号
      handleAuth_code().then(
        () => {
          getUsersUID();
        },
        () => {}
      );
      break;

    default:
      break;
  }
}

// 授权  手机号绑定流程处理
export function hasUserState() {
  return new Promise((resolve, reject) => {
    // 第一步 判断cookie是拥有openid accessToken  无 ====> 前往权益授权  有=======> 判断cookie 是否拥有Token
    if (!hasToken("openid")) {
      setCookie("loginStatus", false);
      channelAccredit().then(() => {
        reject(true);
      });
      // resolve(false)
    } else {
      if (getChannel() === "JDBT") {
        // 京东
        // 第一步 判断cookie是否拥有Token 无 ====> 前往手机号绑定  有=======> 已绑定
        if (
          !hasToken("Token") &&
          hasToken("accessToken") &&
          hasToken("openid")
        ) {
          Taro.navigateTo({
            url: "/pages/user/bindUserMobileLogin/index"
          });
          resolve(false);
        } else {
          resolve(true);
        }
      } else if (getChannel() === "ALIPAY_LIFE") {
        if (!hasToken("Token") && hasToken("authCode") && hasToken("openid")) {
          Taro.navigateTo({
            url: "/pages/user/bindUserMobileLogin/index"
          });
          resolve(false);
        } else {
          resolve(true);
        }
      } else {
        getIsBindPhone().then(
          () => {
            if (!hasToken("Token")) {
              channelAccredit().then(() => {
                reject(true);
              });
            } else {
              fetchTokenisUseless().then(res => {
                if (res.code === 200 && res.data) {
                  resolve(true);
                }
              });
            }
          },
          () => {
            Taro.navigateTo({
              url: "/pages/user/bindUserMobileLogin/index"
            });
            resolve(false);
          }
        );
      }
    }
  });
}

// <==========================我是可爱的分割线😊==================================>
/**
 * 京东授权流程
 */

// 处理accessToken
export function navToJDAccredit() {
  return new Promise((resolve, reject) => {
    let accessToken = GetRequest("accessToken");
    accessToken && setCookie("accessToken", accessToken);
    if (accessToken && !hasToken("openid") && !hasToken("Token")) {
      // 应用第一次加载
      resolve();
    } else {
      reject();
    }
  });
}

// 京东权益授权
export function jdAccredit() {
  // 是否拥有accessToken 如果cookie没有 则需要前往中间页重新登录
  if (hasToken("accessToken")) {
    let accessToken = getCookie("accessToken");
    fetchjdaccredit({ accessToken }).then(res => {
      if (res.code === 200) {
        if (res.data.token) {
          setCookie("Token", res.data.token);
        }
        // openid
        if (res.data.openid) {
          setCookie("openid", res.data.openid);
        } else if (res.data.jdUsers && res.data.jdUsers.openid) {
          setCookie("openid", res.data.jdUsers.openid);
        }
      } else {
        Taro.showToast({
          title: "京东授权失效,开始重新授权",
          icon: "loading"
        }).then(() => {
          setTimeout(() => {
            const projectUrl = window.location.pathname;
            let callBackUrl = "";
            if (filterUrlArr.includes(projectUrl)) {
              callBackUrl = serviecUrl + projectUrl;
            } else {
              callBackUrl = window.location.href;
            }
            window.location.href = `${jdAuthorizationUrl}&callBack=${encodeURIComponent(
              callBackUrl
            )}`;
          }, 1000);
        });
      }
    });
  } else {
    Taro.showToast({
      title: "开始京东权益授权",
      icon: "loading"
    }).then(() => {
      setTimeout(() => {
        const projectUrl = window.location.pathname;
        let callBackUrl = "";
        if (filterUrlArr.includes(projectUrl)) {
          callBackUrl = serviecUrl + projectUrl;
        } else {
          callBackUrl = window.location.href;
        }
        window.location.href = `${jdAuthorizationUrl}&callBack=${encodeURIComponent(
          callBackUrl
        )}`;
      }, 1000);
    });
  }
}

// <==========================我是可爱的分割线😊==================================>

/**
 * 支付宝授权流程
 * scope: auth_user auth_base
 * redirect_uri: 回调页面
 */

//  验证 url 是否携带 auth_code
export function handleAuth_code() {
  return new Promise((resolve, reject) => {
    let authCode = aliGetrequest("auth_code");
    authCode && setCookie("authCode", authCode);
    if (authCode && !hasToken("openid") && !hasToken("Token")) {
      resolve();
    } else {
      reject();
    }
  });
}

export function getUsersUID() {
  if (hasToken("authCode")) {
    let authCode = getCookie("authCode");
    fetchaliaccredit({ authCode, channel: getChannel() }).then(res => {
      if (res.code === 200) {
        if (res.data.token) {
          setCookie("Token", res.data.token);
        }
        // openid
        if (res.data.openid) {
          setCookie("openid", res.data.openid);
        } else if (res.data.alipayUsers && res.data.alipayUsers.openid) {
          setCookie("openid", res.data.alipayUsers.openid);
        }
      } else {
        Taro.showToast({
          title: "用户授权失效,开始重新授权",
          icon: "loading"
        }).then(() => {
          setTimeout(() => {
            const projectUrl = window.location.hash.split("?")[0];
            let callBackUrl = "";
            if (filterUrlArr.includes(projectUrl)) {
              callBackUrl = serviecUrl + "/" + projectUrl;
            } else {
              callBackUrl = window.location.href;
            }
            // return
            window.location.href = `${alipayLifeAuthorizationUrl}&redirect_uri=${encodeURIComponent(
              callBackUrl
            )}`;
          }, 1000);
        });
      }
    });
  } else {
    Taro.showToast({
      title: "开始用户信息授权",
      icon: "loading"
    }).then(() => {
      setTimeout(() => {
        const projectUrl = window.location.hash.split("?")[0];
        let callBackUrl = "";
        if (filterUrlArr.includes(projectUrl)) {
          callBackUrl = serviecUrl + "/" + projectUrl;
        } else {
          callBackUrl = window.location.href;
        }
        // return
        window.location.href = `${alipayLifeAuthorizationUrl}&redirect_uri=${encodeURIComponent(
          callBackUrl
        )}`;
      }, 1000);
    });
  }
}

// <==========================我是可爱的分割线😊==================================>
/**
 * 微信小程序授权流程
 * 1 调用小程序登陆 api  Taro.login  获取登陆凭证 code()
 * 2 调用小程序 Taro.checkSession  检验登陆接口的的时效性  具体时间由微信端实现判断 失效 ==> 重新登陆
 * 3 通过凭证调用服务端后台接口 换取 openid  token
 * 4 兼容处理用户拒绝授权的情况

 */

// 小程序检验登陆状态
export function appMiniCheckSession() {
  Taro.checkSession().then(
    () => {
      // 授权状态在线 ===> 无需重复登陆
    },
    () => {
      // 授权状态失效 ===> 前往登陆
      appMiniLogin();
    }
  );
}

// 小程序登陆
export function appMiniLogin() {
  Taro.login().then(
    res => {
      res.code && getAppMiniOpeId(res.code);
    },
    res => {}
  );
}

// 跟服务端换取openid
export function getAppMiniOpeId(code) {
  fetchappminiaccredit({ code }).then(res => {
    if (res.code === 200) {
      if (res.data.token) {
        setCookie("Token", res.data.token);
      }
      // openid
      if (res.data.openid) {
        setCookie("openid", res.data.openid);
      }
    }
  });
}

export function appMiniGetSetting() {
  Taro.getSetting().then(
    res => {},
    res => {}
  );
}
// <==========================我是可爱的分割线😊==================================>
// 支付宝小程序登陆授权授权
export function alipayAppauth() {
  return new Promise((resolve, reject) => {
    my.getAuthCode({
      scopes: ["auth_user"],
      success: res => {
        Taro.showLoading({ title: "开始授权" });
        if (res.authCode) {
          getalipayAppMiniOpeId(res.authCode).then(() => {
            Taro.hideLoading();
            resolve(res.authCode);
          });
        }
      },
      fail: res => {
        Taro.showToast({ title: "授权失败" });
        Taro.hideLoading();
        reject();
      }
    });
  });
}

export function getalipayAppMiniOpeId(authCode) {
  return new Promise((resolve, reject) => {
    fetchaliaccredit({ authCode, channel: getChannel() }).then(res => {
      if (res.code === 200) {
        if (res.data.token) {
          setCookie("Token", res.data.token);
        }
        // openid
        if (res.data.openid) {
          setCookie("openid", res.data.openid);
          setBlobalData("openid", res.data.openid); // hack 支付宝小程序环境下 openid 取不到问题
        } else if (res.data.alipayUsers && res.data.alipayUsers.openid) {
          setCookie("openid", res.data.alipayUsers.openid);
          setBlobalData("openid", res.data.alipayUsers.openid); // hack 支付宝小程序环境下 openid 取不到问题
        }
        resolve();
      } else {
        Taro.showToast({ title: "授权失败,请稍后再试" });
        reject();
      }
    });
  });
}

// 查询用户是否绑定手机号
export function getIsBindPhone() {
  return new Promise((resolve, reject) => {
    let params = {
      openid: getCookie("openid"),
      channel: getChannel()
    };
    fetchIsbindPhone({ ...params }).then(res => {
      if (res.code == 200) {
        if (res.data) {
          resolve();
        } else {
          reject();
        }
      }
    });
  });
}
