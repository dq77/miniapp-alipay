// 我的优惠券

import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtButton } from "taro-ui";
import "./index.scss";
import overdue from "../../images/common/coupon/overdue.png";
import used from "../../images/common/coupon/used.png";
import { cnzzTrackEvent } from "../../utils/cnzz";
import { couponUnitFilte } from "../../utils/utils";

export default class Mycoupon extends Component {
  componentDidMount = () => {};

  onNavtohome() {
    // 友盟
    cnzzTrackEvent("优惠券", "优惠券使用");
    Taro.navigateTo({
      url: "/pages/home/index"
    });
  }

  render() {
    const { type, data } = this.props;
    return (
      <View className="my-coupon">
        <View className="discount-info">
          <View className="discount-price">
            <Text className="money">{data.couponMoney}</Text>
            <Text className="symbol-money">￥</Text>
          </View>
          <View className="discount-time">
            <Text className="discount-type">{data.couponName}</Text>
            {data.discountType && data.discountType === 1 ? (
              <Text>
                首付满{data.spendMoney}减{data.couponMoney}
              </Text>
            ) : (
              <Text>
                满{data.spendMoney}减{data.couponMoney}
              </Text>
            )}
            <View className="discount-valid">
              {data.validStartTime ? (
                <Text>
                  有效期：{data.validStartTime}至{data.validEndTime}
                </Text>
              ) : (
                <Text>
                  领取后{data.couponTime}
                  {data && Object.keys(data).length > 0 && data.couponTimeUnit
                    ? couponUnitFilte(data.couponTimeUnit)
                    : "天"}
                  到期
                </Text>
              )}
            </View>
          </View>
        </View>
        {type === 1 && (
          <View className="coupon-btn" onClick={this.onNavtohome}>
            <Text>立即使用</Text>
          </View>
        )}
        {type === 2 && (
          <View className="coupon-btn coupon-expire" onClick={this.onNavtohome}>
            <Text>已使用</Text>
          </View>
        )}
        {type === 3 && (
          <View className=" coupon-btn coupon-expire">
            <Text>已过期</Text>
          </View>
        )}
      </View>
    );
  }
}
