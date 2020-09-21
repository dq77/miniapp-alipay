import Taro, { PureComponent } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { View, Image, Text } from "@tarojs/components";
import { cnzzTrackEvent } from "../../../utils/cnzz";
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
    // specialPriceCouponId: ['88', '89', '95'], // 三件特价商品的 id
    // specialPrice: ['180727190003306640', '343105030833831936', '180727191541607519'], // 特价商品
    couponId: ["97", "98", "99", "88", "89", "95"], // 优惠券 id
    oneList: [
      "181113183159106840",
      "190118102105748928",
      "180904150034368485",
      "181013110506789887",
      "344160542643978240",
      "180919094620005707",
      "180730135646922001",
      "180730162050925081",
      "366999242075537408",
      "181115154430722969"
    ],
    twoList: [
      "180727181621706645",
      "180727193219119764",
      "354324786911903744",
      "180919100554903441",
      "180728132714102521",
      "180906185024995379"
    ],
    threeList: [
      "181106112526321896",
      "346032318982389760",
      "190409201715480845",
      "344165657962610688",
      "354326708553252864",
      "181210163734988964"
    ]
  };

  componentWillMount() {
    // cnzzTrackPageview();
    this.fetchCouponList();
  }

  componentDidMount() {}

  componentDidShow() {}

  // 跳转商品详情
  navToGood = no => {
    Taro.navigateTo({
      url: `/pages/goods/index?no=${no}`
    });
  };

  // 跳转首页
  navToHome = () => {
    Taro.switchTab({
      url: `/pages/home/index`
    });
  };

  // 查询优惠券列表
  fetchCouponList = () => {
    this.props.dispatch({
      type: "doubleEleven/couponList",
      payload: {
        list: this.state.couponId
      }
    });
  };

  // 领取优惠券
  receiveCoupon = item => {
    cnzzTrackEvent("租赁好生活狂欢节", "点击领取");
    hasUserState().then(
      flag => {
        if (flag) {
          this.props.dispatch({
            type: "doubleEleven/getCoupon",
            payload: {
              couponId: item.id
            },
            callback: (code, data, msg) => {
              this.fetchCouponList();
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
        this.fetchCouponList();
      }
    );
  };

  //  根据coupId 获取优惠券信息
  couponFilter(id) {
    if (this.props.couponList.length < 1) return {};
    let list = this.props.couponList.filter(item => item.id === id * 1);
    return list[0];
  }

  render() {
    return (
      <View className='doubleEleven'>
        <Image src={`${URL}/activity/double11/11_01.png`} mode='widthFix' />
        <View className='wrap'>
          <Image src={`${URL}/activity/double11/11_02.png`} mode='widthFix' />
          <View
            className='specialprice_one'
            onClick={() => this.receiveCoupon(this.couponFilter("88"))}
          ></View>
          <View
            className='specialprice_two'
            onClick={() => this.receiveCoupon(this.couponFilter("89"))}
          ></View>
          <View
            className='specialprice_three'
            onClick={() => this.receiveCoupon(this.couponFilter("95"))}
          ></View>
          <View
            className='specialprice_four'
            onClick={() => this.navToGood("180727190003306640")}
          ></View>
          <View
            className='specialprice_five'
            onClick={() => this.navToGood("343105030833831936")}
          ></View>
          <View
            className='specialprice_six'
            onClick={() => this.navToGood("180727191541607519")}
          ></View>
        </View>
        <View className='wrap'>
          <Image src={`${URL}/activity/double11/11_03.png`} mode='widthFix' />
          <View
            className='couponsRecive'
            style='top:25%'
            onClick={() => this.receiveCoupon(this.couponFilter("97"))}
          >
            <Text className='taroText'>
              {this.couponFilter("97").useStatus &&
              this.couponFilter("97").useStatus === 40
                ? "立即领取"
                : "领取成功"}
            </Text>
          </View>
          <View
            className='couponsRecive'
            style='bottom:39%'
            onClick={() => this.receiveCoupon(this.couponFilter("98"))}
          >
            <Text className='taroText'>
              {this.couponFilter("98").useStatus &&
              this.couponFilter("98").useStatus === 40
                ? "立即领取"
                : "领取成功"}
            </Text>
          </View>
          <View
            className='couponsRecive'
            onClick={() => this.receiveCoupon(this.couponFilter("99"))}
          >
            <Text className='taroText'>
              {this.couponFilter("99").useStatus &&
              this.couponFilter("99").useStatus === 40
                ? "立即领取"
                : "领取成功"}
            </Text>
          </View>
        </View>
        <Image src={`${URL}/activity/double11/11_04.png`} mode='widthFix' />
        <View className='wrap'>
          <Image src={`${URL}/activity/double11/11_05.png`} mode='widthFix' />
          <Image src={`${URL}/activity/double11/11_06.png`} mode='widthFix' />
          <View className='goodsWrap'>
            {this.state.oneList.map(item => (
              <View
                className='goods_card'
                key={item}
                onClick={() => this.navToGood(item)}
              >
                {item}
              </View>
            ))}
          </View>
        </View>
        <View className='wrap'>
          <Image src={`${URL}/activity/double11/11_07.png`} mode='widthFix' />
          <View className='goodsWrap' style='top:12%'>
            {this.state.twoList.map(item => (
              <View
                className='goods_card'
                key={item}
                onClick={() => this.navToGood(item)}
              >
                {item}
              </View>
            ))}
          </View>
        </View>
        <View className='wrap'>
          <Image src={`${URL}/activity/double11/11_08.png`} mode='widthFix' />
          <Image src={`${URL}/activity/double11/11_09.png`} mode='widthFix' />
          <View className='goodsWrap' style='top:12%'>
            {this.state.threeList.map(item => (
              <View
                className='goods_card'
                key={item}
                onClick={() => this.navToGood(item)}
              >
                {item}
              </View>
            ))}
          </View>
          <View className='toHome' onClick={() => this.navToHome()}></View>
        </View>
      </View>
    );
  }
}
export default Index;
