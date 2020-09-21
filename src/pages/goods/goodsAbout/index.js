import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui";
import { connect } from "@tarojs/redux";
import CouponPop from "../../../components/RadioSelect/index";
import noCoupon from "../../../images/common/coupon/no-coupon.png";
import couponInfo from "../../../images/common/coupon/coupon-info.png";
import { get as getGlobalData } from "../../../global_data"; // 全局变量文件
import CouposnOption from "./couposnOption";
import { hasUserState } from "../../../utils/accredit";
import RepayInfo from "../../../components/RepayInfo";
import "./index.scss";

@connect(({ goods }) => ({
  ...goods
}))
export default class GoodsAbout extends Component {
  static defaultProps = {
    list: [],
    couponsVisible: false,
    onfreightVisible: false,
    onAdd: () => {},
    onPopupShow: () => {},
    goodData: () => {}
  };

  state = {
    couponsVisible: false,
    onfreightVisible: false,
    showRepayModal: false
  };

  componentWillMount() {
    this.fetchcouponslist();
  }

  componentDidMount() {
    // this.fetchrepaylist()
  }

  componentDidShow() {
    //
  }

  fetchcouponslist() {
    let params = {
      channel: getGlobalData("Channel"),
      spuNo: this.props.no
    };
    this.props.dispatch({
      type: "goods/getGoodscoupons",
      payload: params,
      callback: data => {}
    });
  }
  // fetchrepaylist() {
  //   let params = {
  //     channel: getGlobalData('Channel'),
  //     spuNo: this.props.no
  //   }
  //   this.props.dispatch({
  //     type: 'goods/getRepay',
  //     payload: params,
  //     callback: (data) => {
  //
  //
  //     }
  //   })
  // }

  // 优惠劵窗口开启
  onCouponsPopupShow = () => {
    this.fetchcouponslist();
    // this.fetchrepaylist()
    this.setState({
      couponsVisible: true
    });
  };

  // 优惠劵窗口关闭
  onHandleouponClose = () => {
    this.setState({
      couponsVisible: false
    });
  };

  // 领取优惠券
  onReceiveCoupons = val => {
    hasUserState().then(
      flag => {
        if (flag) {
          let params = {
            userCouponId: val
          };
          this.props.dispatch({
            type: "goods/receiveCoupons",
            payload: params,
            callback: res => {
              if (res.code === 200) {
                Taro.showToast({
                  title: "领取成功",
                  icon: "success",
                  duration: 1000
                });
                this.fetchcouponslist();
              } else {
                Taro.showToast({
                  title: res.msg,
                  icon: "none",
                  duration: 1000
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
  };
  showRepayInfo() {
    this.setState({
      showRepayModal: true
    });
  }
  // 关闭弹窗
  hideRepayInfo() {
    this.setState({
      showRepayModal: false
    });
  }
  // 运费窗口开启
  onfreightPoupShow = () => {
    this.setState({
      onfreightVisible: true
    });
  };

  // 运费关闭窗口
  onHandleonfreightClose = () => {
    this.setState({
      onfreightVisible: false
    });
  };

  render() {
    const { couponsList, repayList, goodData, selectedData } = this.props;
    const { specificationVOList = [] } = goodData;
    const { showRepayModal } = this.state;
    // console.log("优惠券", couponsList);
    return (
      <View className="goods-about">
        {specificationVOList.length !== 0 && (
          <View className="goods-about-item" onClick={this.props.onAdd}>
            <Text className="item-title">规格</Text>
            {!!selectedData.specNoIdDetail ? (
              <Text className="item-value">{selectedData.specNoIdDetail}</Text>
            ) : (
              <Text className="item-value">请选择规格</Text>
            )}
            <View className="at-icon at-icon-chevron-right" />
          </View>
        )}
        {(couponsList.length != 0 || repayList.length != 0) && (
          <View
            className="goods-about-item coupon"
            onClick={this.onCouponsPopupShow}
          >
            <Text className="item-title">优惠</Text>
            <View className="couponCenter">
              {couponsList[0] && (
                <View className="couponItem">
                  <Text className="couponLabel">满减</Text>
                  <Text className="discount-type">
                    {couponsList[0].discountType == 1 ? "首付" : ""}满
                    {couponsList[0].spendMoney}减{couponsList[0].couponMoney}元
                  </Text>
                </View>
              )}
              {repayList[0] && (
                <View className="couponItem">
                  <Text className="couponLabel">返现</Text>
                  <Text className="discount-type">
                    租期
                    {repayList[0].stageVos[0].stage}
                    {repayList[0].stageVos[0].unit == "DAY" ? "天" : "个月"}
                    返现
                    {repayList[0].payBackPercent}%
                  </Text>
                </View>
              )}
            </View>
            {/* <Text className='item-value'>{couponsList.length > 0 ? '优惠券可领' : '暂无优惠券'}</Text> */}
            <View className="at-icon at-icon-chevron-right" />
          </View>
        )}
        <View className="goods-about-item" onClick={this.onfreightPoupShow}>
          <Text className="item-title">运费</Text>
          <Text className="item-value">部分地区包邮</Text>
          <View className="at-icon at-icon-chevron-right" />
        </View>

        <View className="goods-about-item">
          <Text className="item-title">说明</Text>
          <Text className="item-value">正品保证 | 信用免押 | 分期免手续费</Text>
          <View className="item-block" />
        </View>
        <CouponPop
          title="优惠"
          show={this.state.couponsVisible}
          onHandleClose={this.onHandleouponClose}
          noOpertion={false}
        >
          {couponsList.length == 0 && repayList.length == 0 ? (
            <View className="no-coupon">
              <Image src={noCoupon} />
              <Text>还没有券哦</Text>
            </View>
          ) : (
            ""
          )}
          {couponsList.length > 0 ? (
            <View className="couponTitle">
              <Text>可领优惠券</Text>
            </View>
          ) : (
            ""
          )}
          {couponsList.length > 0
            ? couponsList.map((item, index) => {
                if (item !== undefined) {
                  return (
                    <View>
                      <CouposnOption
                        data={item}
                        key={item.id}
                        onReceiveCoupons={this.onReceiveCoupons}
                      />
                    </View>
                  );
                }
              })
            : ""}
          {repayList.length > 0 ? (
            <View className="at-row repay couponTitle">
              <Text>订单返现</Text>
              <View className="at-col rightIcon">
                <Image
                  src={couponInfo}
                  className="couponInfo"
                  onClick={this.showRepayInfo}
                />
              </View>
            </View>
          ) : (
            ""
          )}
          {repayList.length > 0
            ? repayList.map(item => {
                if (item !== undefined) {
                  return <CouposnOption data={item} key={item.id} />;
                }
              })
            : ""}
        </CouponPop>

        <CouponPop
          title="运费说明"
          show={this.state.onfreightVisible}
          onHandleClose={this.onHandleonfreightClose}
          noOpertion={false}
        >
          {/* <Text>不配送地区包括：新疆、西藏、青海、宁夏等地区</Text> */}
          <View>· 不配送地区包括：</View>
          <View className="freight-content"> 新疆、西藏、青海、宁夏等地区</View>
          <View>· 运费详情：</View>
          <View className="freight-content">
            {" "}
            根据您的收件地址、选择商品及租期不同，收取0 -
            30不等运费，具体以订单确认页为准
          </View>
        </CouponPop>
        <RepayInfo show={showRepayModal} onHideRepayInfo={this.hideRepayInfo} />
      </View>
    );
  }
}
