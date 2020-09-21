import Taro, { PureComponent } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { sourceNavigateTo } from "../../../utils/utils";
import { cnzzTrackEvent, cnzzTrackPageview } from "../../../utils/cnzz";
import {
  set as setGlobalData,
  get as getGlobalData
} from "../../../global_data";
import { setCookie } from "../../../utils/save-token";
import { hasUserState } from "../../../utils/accredit";

import "./index.scss";

const URL = "https://assets.taozugong.com";

@connect(({ doubleEleven }) => ({
  ...doubleEleven
}))
class Index extends PureComponent {
  config = {
    navigationBarTitleText: ""
  };

  state = {
    goodList_one: [
      "180904150034368485",
      "180730135646922001",
      "180730135646922001",
      "181113183159106840",
      "190118102105748928",
      "180919094620005707",
      "181013110506789887",
      "344160542643978240",
      "366999242075537408",
      "181115154430722969"
    ],
    goodList_two: [
      "181106112526321896",
      "346032318982389760",
      "190409201715480845",
      "344165657962610688",
      "354326708553252864",
      "181210163734988964",
      "356061144898600960",
      "354318702318977024",
      "181106112441456962",
      "190306160232590306"
    ],
    linkUrl: [
      "alipays://platformapi/startapp?appId=68687187",
      "alipays://platformapi/startapp?appId=68687059&url=%2Fwww%2FhomeV4.html&canPullDown=NOalipays://platformapi/startapp?appId=68687059&url=%2Fwww%2FhomeV4.html&canPullDown=NO",
      "alipays://platformapi/startapp?appId=77700148&query=tabId%3Drentalipays://platformapi/startapp?appId=77700148&query=tabId%3Drent"
    ],

    couponsId: ["131", "132", "133"]
  };

  componentWillMount() {}
  componentDidMount() {}

  // 跳转商品详情
  navTodetail = no => {
    Taro.navigateTo({
      url: `/pages/goods/index?no=${no}`
    });
  };

  // 去信用生活
  navToLife = url => {
    my.ap.navigateToAlipayPage({
      // 例如跳转到共享单车页面，其 schema 格式为：
      // alipays://platformapi/startapp?appId=60000155&chInfo=ch_${appid}，${appid} 替换为自己的16位 appid，例如：
      path: url,
      success: res => {
        // my.alert({ content: "系统信息" + JSON.stringify(res) });
      },
      fail: error => {
        // my.alert({ content: "系统信息" + JSON.stringify(error) });
      }
    });
  };

  // 领取优惠券
  receiveCoupon(id) {
    hasUserState().then(
      flag => {
        if (flag) {
          this.props.dispatch({
            type: "doubleEleven/getCoupon",
            payload: {
              couponId: id
            },
            callback: (code, data, msg) => {
              if (code === 200) {
                this.setState(
                  Taro.showToast({
                    title: "领取成功",
                    icon: "success"
                  })
                );
              } else {
                Taro.showToast({
                  title: msg,
                  icon: "none"
                });
              }
            }
          });
        }
      },
      () => {
        Taro.showToast({ title: "授权成功" });
      }
    );
  }

  // 跳转收藏有礼页
  navToCollection() {
    my.navigateToMiniProgram({
      appId: 2018122562686742,
      path:
        "pages/index/index?originAppId=2018032002414150&newUserTemplate=KP20191120000002129805"
    });
  }

  render() {
    return (
      <View className="creditNewLife">
        <View className="wrap">
          <Image
            src={`${URL}/activity-test/creditLife/1-min.png`}
            mode="widthFix"
          />
          <Image
            src={`${URL}/activity-test/creditLife/2-min.png`}
            mode="widthFix"
          />
          <View
            className="topWrap"
            onClick={() =>
              this.navToLife(
                "alipays://platformapi/startapp?appId=77700148&query=tabId%3Drent"
              )
            }
          ></View>
          {this.state.couponsId.map((item, index) => (
            <View
              className={`coupons coupons_${index}`}
              key={item}
              onClick={() => this.receiveCoupon(item)
              }
            ></View>
          ))}
        </View>

        <View className="wrap">
          <Image
            src={`${URL}/activity-test/creditLife/3-min.png`}
            mode="widthFix"
          />
          <Image
            src={`${URL}/activity-test/creditLife/4-min.png`}
            mode="widthFix"
          />
          <Image
            src={`${URL}/activity-test/creditLife/5-min.png`}
            mode="widthFix"
          />
          <View className="good_wrap">
            {this.state.goodList_one.map(item => (
              <View
                className="good_one"
                onClick={() => this.navTodetail(item)}
                key={item}
              ></View>
            ))}
          </View>
        </View>
        <View className="wrap">
          <Image
            src={`${URL}/activity-test/creditLife/6-min.png`}
            mode="widthFix"
          />
          <View className="good_wrap_one">
            {this.state.goodList_two.map(item => (
              <View
                className="good_two"
                onClick={() => this.navTodetail(item)}
                key={item}
              ></View>
            ))}
          </View>
        </View>
        <View className="wrap">
          <Image
            src={`${URL}/activity-test/creditLife/7-min.png`}
            mode="widthFix"
          />
          <View
            className="mainlife"
            onClick={() =>
              this.navToLife(
                "alipays://platformapi/startapp?appId=2019071165809378&page=/pages/list1/list1&chInfo=ch_appxagg__chsub_2019071165809378_pages_list1_list1"
              )
            }
          ></View>
        </View>
        <View className="wrap">
          <Image
            src={`${URL}/activity-test/creditLife/8-min.png`}
            mode="widthFix"
          />
          <View className="bottom_wrap">
            {this.state.linkUrl.map(item => (
              <View
                className="life"
                onClick={() => this.navToLife(item)}
                key={item}
              ></View>
            ))}
          </View>
          <View
            className="life_number"
            onClick={() =>
              this.navToLife(
                "alipays://platformapi/startapp?appId=20000042&publicBizType=LIFE_APP&publicId=2015060900116695&sourceId=xinshougonglue01alipays://platformapi/startapp?appId=20000042&publicBizType=LIFE_APP&publicId=2015060900116695&sourceId=xinshougonglue01"
              )
            }
          ></View>
        </View>
      </View>
    );
  }
}
export default Index;
