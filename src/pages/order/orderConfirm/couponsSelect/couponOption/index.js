import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtButton } from "taro-ui";
import { formartUnit } from "../../../../../utils/utils";
import "./index.scss";
import checkedImg from "../../../../../images/orderConfirm/checked.png";
import unCheckedImg from "../../../../../images/orderConfirm/unchecked.png";
import blueChecked from "../../../../../images/orderConfirm/blueChecked.png";

export default class Test extends Taro.Component {
  // 优惠券选择回调父组件
  receiveCoupons = id => {
    this.props.onReceiveCoupons(id);
  };

  render() {
    const {
      checkedValue,
      data = { couponType: 31, stageVos: [], couponTimeUnit: "" }
    } = this.props;
    // console.log("data",data);
    return (
      <View className="couponsInfo">
        <View className="common-coupon">
          <View className="at-row at-row__justify--between at-row__align--center">
            {data !== undefined ? (
              <View className="at-col at-col-9">
                {data.couponType === 31 ? (
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
                            {Object.keys(data).length > 0 && data.couponTimeUnit
                              ? formartUnit(data.couponTimeUnit)
                              : "天"}
                            到期
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                ) : data.couponType === 32 ? (
                  <View className="discount-info">
                    <View className="discount-price">
                      <Text className="money">{data.payBackPercent}</Text>
                      <Text className="symbol-money">%</Text>
                    </View>
                    <View className="discount-time">
                      <Text className="discount-type">{data.couponName}</Text>
                      <Text>
                        订单租期为
                        {data.stageVos.map((item, index) => (
                          <Text>
                            {index !== 0 && <Text>、</Text>}
                            {item.stage}
                            {item.unit === "MONTH" && <Text>个</Text>}
                            {formartUnit(item.unit)}
                          </Text>
                        ))}
                        可用
                      </Text>
                      <View className="discount-valid">
                        {data.validStartTime ? (
                          <Text>
                            有效期：{data.validStartTime}至{data.validEndTime}
                          </Text>
                        ) : (
                          <Text>
                            领取后{data.couponTime}至
                            {Object.keys(data).length > 0 && data.couponTimeUnit
                              ? formartUnit(data.couponTimeUnit || "DAY")
                              : "天"}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                ) : null}
                {/* <View className='discount-valid'>
                    {
                     data.validStartTime ?  
                      <Text>有效期：{data.validStartTime}至{data.validEndTime}</Text>
                      : <Text>领取后{data.couponTime}至{formartUnit(data.couponTimeUnit)}</Text>
                    }
                  </View> */}
              </View>
            ) : (
              ""
            )}
            <View className="at-col at-col-3">
              <View
                className={
                  data.couponType === 32 ? "use-coupon repay" : "use-coupon"
                }
                onClick={() => this.receiveCoupons(data)}
              >
                {data.couponType === 31 ? (
                  <Image
                    src={checkedValue == data.id ? blueChecked : unCheckedImg}
                    className="checkImg"
                  ></Image>
                ) : (
                  <Image
                    src={checkedValue == data.id ? checkedImg : unCheckedImg}
                    className="checkImg"
                  ></Image>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
