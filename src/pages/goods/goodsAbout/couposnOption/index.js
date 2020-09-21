import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtButton } from "taro-ui";
import { formartUnit } from "../../../../utils/utils";
import "./index.scss";

export default class Test extends Taro.Component {
  // 优惠券领取回调父组件
  receiveCoupons = id => {
    this.props.onReceiveCoupons(id);
  };

  render() {
    const {
      isShowName,
      data = { couponType: 31, stageVos: [], couponTimeUnit: "" }
    } = this.props;
    return (
      <View className="couponsInfo">
        {data ? (
          <View>
            {data.couponType === 31 ? (
              <View
                className={
                  data.useStatus === 41 ? "common-coupon used" : "common-coupon"
                }
              >
                {/* 41 未领取 40已领取 */}
                <View className="at-row at-row__justify--between at-row__align--center">
                  <View className="at-col at-col-9">
                    <View className="discount-price">
                      <Text className="money">{data.couponMoney}</Text>
                      <Text className="symbol-money">￥</Text>
                    </View>
                    {!isShowName ? (
                      <Text className="discount-type">
                        {data.discountType == 1 ? "首付" : ""}满
                        {data.spendMoney}减{data.couponMoney}元
                      </Text>
                    ) : (
                      <Text className="discount-type">{data.couponName}</Text>
                    )}
                    {data.validStartTime ? (
                      <View className="discount-time">
                        <Text>使用有效期：</Text>
                        <Text>
                          {data.validStartTime}至{data.validEndTime}
                        </Text>
                      </View>
                    ) : (
                      <View className="discount-time">
                        <Text>
                          领取后{data.couponTime}
                          {data.couponTimeUnit &&
                            formartUnit(data.couponTimeUnit)}
                          后过期
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="at-col at-col-3">
                    {data.useStatus === 41 ? (
                      <AtButton
                        type="primary"
                        size="small"
                        className="use-coupon"
                      >
                        已领取
                      </AtButton>
                    ) : (
                      <AtButton
                        type="primary"
                        size="small"
                        className="use-coupon"
                        onClick={() => this.receiveCoupons(data.id)}
                      >
                        立即领取
                      </AtButton>
                    )}
                  </View>
                </View>
              </View>
            ) : (
              <View className="common-coupon">
                <View className="at-row at-row__justify--between at-row__align--center">
                  <View className="at-col at-col-9">
                    <View className="discount-price">
                      <Text className="money">{data.payBackPercent}%</Text>
                    </View>
                    <Text className="discount-type">
                      {/* {data.discountType == 1 ? '首付' : ''}满{data.spendMoney}减{data.couponMoney}元 */}
                      {data.couponName}
                    </Text>
                    {data.validStartTime ? (
                      <View className="discount-time">
                        <Text>使用有效期：</Text>
                        <Text>
                          {data.validStartTime}至{data.validEndTime}
                        </Text>
                      </View>
                    ) : (
                      <View className="discount-time">
                        <Text>
                          领取后{data.couponTime}
                          {data.couponTimeUnit &&
                            formartUnit(data.couponTimeUnit)}
                          后过期
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="at-col at-col-3">
                    <AtButton
                      type="primary"
                      size="small"
                      className="use-coupon repay"
                      onClick={() => {}}
                    >
                      <View className="repayInnerText">
                        <View>订单租期</View>
                        <Br />
                        <View>
                          为
                          {data.stageVos.length > 0 &&
                            data.stageVos.map((item, index) => (
                              <Text>
                                {index !== 0 && <Text>、</Text>}
                                {item.stage}
                                {item.unit === "MONTH" && <Text>个</Text>}
                                {formartUnit(item.unit)}
                              </Text>
                            ))}
                          可用
                        </View>
                      </View>
                    </AtButton>
                  </View>
                </View>
              </View>
            )}
          </View>
        ) : (
          ""
        )}
      </View>
    );
  }
}
