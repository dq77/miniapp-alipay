// 我的优惠券

import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtTabs, AtTabsPane } from "taro-ui";
import Coupon from "../../../components/Coupon";
import NoCoupon from "../../../components/Coupon/no-coupon";
import getChannel from "../../../utils/channel";
import "./index.scss";

@connect(({ user }) => ({
  ...user
}))
export default class Mycoupon extends Component {
  config = {
    navigationBarTitleText: "我的优惠券"
  };
  state = {
    current: 0
  };

  componentDidMount = () => {
    this.getMyCouponList();
  };

  getMyCouponList = () => {
    let params = {
      status: this.formart(this.state.current),
      channel: getChannel()
    };
    this.props.dispatch({
      type: "user/getMyCoupon",
      payload: params,
      callback: res => {
        Taro.hideLoading();
      }
    });
  };

  formart(current) {
    switch (current) {
      case 0:
        return "41";
      case 1:
        return "42";
      case 2:
        return "43";
    }
  }

  handleClick(value) {
    Taro.showLoading({ title: "loading" });
    this.setState(
      {
        current: value
      },
      () => {
        this.getMyCouponList();
      }
    );
  }

  render() {
    const tabList = [
      { title: "未使用" },
      { title: "已使用" },
      { title: "已过期" }
    ];
    const { couponList } = this.props;

    return (
      <View className="mycoupon">
        {/* <BackHeader title='优惠券' /> */}
        <AtTabs
          current={this.state.current}
          tabList={tabList}
          onClick={this.handleClick.bind(this)}
        >
          <AtTabsPane current={this.state.current} index={0}>
            {couponList.length > 0 ? (
              couponList.map(item => <Coupon type={1} data={item} key={item} />)
            ) : (
              <NoCoupon />
            )}
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            {couponList.length > 0 ? (
              couponList.map((item, index) => (
                <Coupon type={2} data={item} key={index} />
              ))
            ) : (
              <NoCoupon />
            )}
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={2}>
            {couponList.length > 0 ? (
              couponList.map((item, index) => (
                <Coupon type={3} data={item} key={index} />
              ))
            ) : (
              <NoCoupon />
            )}
          </AtTabsPane>
        </AtTabs>
      </View>
    );
  }
}
