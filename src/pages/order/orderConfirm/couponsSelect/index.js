import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui";
import RadioSelect from "../../../../components/RadioSelect";
import CouponPop from "../../../../components/RadioSelect/index";
import { connect } from "@tarojs/redux";
import couponInfo from "../../../../images/common/coupon/coupon-info.png";
import CouponOption from "./couponOption";
import {
  setSessionItem,
  getSessionItem,
  getCookie
} from "../../../../utils/save-token";
import { get as getGlobalData } from "../../../../global_data";
import Popup from "../../../../components/popup";
import unChecked from "../../../../images/orderConfirm/unchecked.png";
import blueChecked from "../../../../images/orderConfirm/blueChecked.png";
import "./index.scss";
import RepayInfo from "../../../../components/RepayInfo";

@connect(({ orderConfirm }) => ({
  ...orderConfirm
}))
export default class Test extends Taro.Component {
  constructor() {
    super(...arguments);
    this.state = {
      // couponList: [], // 优惠券数据
      // repayList: [], // 订单返现数据
      useCoupon: true, // 使用优惠券选框
      showRepayModal: false, // 固定返现弹窗boolean
      couponShow: false,
      checkedValue:
        (this.props.optimalCoupos && this.props.optimalCoupos.id) || "",
      couponType:
        (this.props.optimalCoupos && this.props.optimalCoupos.couponType) || "" // 优惠类型
    };
  }

  componentWillMount() {
    console.log("this.props.radioCouponsData", this.props.radioCouponsData);
  }

  componentDidMount() {
    console.log("this.props.radioCouponsData-2", this.props.radioCouponsData);
  }

  componentDidShow() {
    // console.log("componentDidShow");
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.optimalCoupos &&
      this.props.optimalCoupos.id !== nextProps.optimalCoupos.id
    ) {
      this.setState({
        checkedValue: nextProps.optimalCoupos.id || "",
        couponType: nextProps.optimalCoupos.couponType || "",
        useCoupon: nextProps.optimalCoupos.couponType
      });
    }
  }

  open = () => {
    this.setState({
      couponShow: true
    });
    this.props.onFooterShow(false); // hack IOS 遮挡问题
  };

  // 浮窗关闭
  onHandleClose = () => {
    this.setState(
      {
        couponShow: false
      },
      () => {
        this.props.onFooterShow(true); //  hack IOS 遮挡问题
      }
    );
  };
  // 单位格式化
  unitForamrt(data) {
    if (data.businessType) {
      // 售卖
      if (data.selectedPayTypeObj.value * 1 === 1) {
        // 一次性支付
        return "";
      } else if (data.selectedPayTypeObj.value * 1 === 2) {
        // 分期付
        return data.selectedStageObj.stageValue.unit === "MONTH" ? "月" : "天";
      }
    } else {
      // 租赁
      return data.selectedStageObj.stageValue.unit === "MONTH" ? "月" : "天";
    }
  }
  // 期数格式化
  stageNumberFormart(data) {
    if (data.businessType) {
      // 售卖
      if (data.selectedPayTypeObj.value * 1 === 1) {
        // 一次性支付
        return "";
      } else if (data.selectedPayTypeObj.value * 1 === 2) {
        // 分期付
        return data.selectedStageObj.stageValue.stageNumber;
      }
    } else {
      // 租赁
      return data.selectedStageObj.stageValue.stageNumber;
    }
  }
  // 选择优惠券
  handleOk = data => {
    let value = data.id;
    let coupon = {};
    this.props.radioCouponsData.map(item => {
      if (item.value === value) {
        coupon = {
          couponMoney: item.couponMoney,
          couponId: item.value,
          discountType: item.discountType,
          couponType: item.couponType,
          discountMoney: item.discountMoney
        };
        return;
      }
    });
    this.setState(
      {
        checkedValue: value,
        couponType: coupon.couponType || "",
        useCoupon: true
      },
      () => {
        // this.onHandleClose()
      }
    );
    this.props.onSelectCoupons(coupon);
  };

  // 格式化value
  formartValue(val) {
    let Money = "";
    this.props.radioCouponsData.map(item => {
      if (item.value * 1 === val * 1) {
        Money =
          item.couponType === 31
            ? item.couponMoney
            : item.couponType === 32
            ? item.payBackPercent
            : "";
      }
    });
    return Money;
  }
  // 显示固定返现弹窗
  showRepayInfo() {
    this.setState({
      showRepayModal: true
    });
  }
  // 隐藏返现弹窗信息
  hideRepayInfo() {
    this.setState({
      showRepayModal: false
    });
  }
  // 是否使用优惠
  useDiscount() {
    this.setState(
      {
        useCoupon: !this.state.useCoupon,
        checkedValue: "",
        couponType: ""
      },
      () => {
        // this.onHandleClose()
        this.props.onSelectCoupons({});
      }
    );
  }

  render() {
    const { hasCoupons, radioCouponsData } = this.props;
    let {
      checkedValue,
      showRepayModal,
      couponType
      // couponList,
      // repayList
    } = this.state;
    let couponList = [];
    let repayList = [];
    radioCouponsData.map(item => {
      if (item.couponType === 31) {
        couponList.push(item);
      } else if (item.couponType === 32) {
        repayList.push(item);
      }
    });
    // console.log("couponList", couponList);
    return (
      <View>
        <View className="coupons">
          <Text>优惠</Text>
          {hasCoupons ? (
            <View className="coupons_status" onClick={this.open}>
              {couponType === 31 ? (
                <Text>-¥{this.formartValue(this.state.checkedValue)}</Text>
              ) : couponType === 32 ? (
                <Text>
                  返现{this.formartValue(this.state.checkedValue)}%至余额
                </Text>
              ) : (
                "不使用优惠"
              )}
              <View className="at-icon at-icon-chevron-right vgn" />
            </View>
          ) : (
            <View className="coupons_status">
              <Text>无可用优惠券</Text>
            </View>
          )}
          <CouponPop
            title="可领取优惠"
            show={this.state.couponShow}
            onHandleClose={this.onHandleClose}
            noOpertion={false}
          >
            {radioCouponsData.length == 0 && repayList.length == 0 ? (
              <View className="no-coupon">
                <Text>还没有券哦</Text>
              </View>
            ) : (
              ""
            )}
            {couponList.length > 0 ? (
              <View className="couponTitle">
                <Text>优惠券</Text>
              </View>
            ) : (
              ""
            )}
            {couponList.length > 0
              ? couponList.map((item, index) => {
                  return (
                    <CouponOption
                      data={item}
                      key={item.value}
                      onReceiveCoupons={this.handleOk}
                      checkedValue={checkedValue}
                    />
                  );
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
                  ></Image>
                </View>
              </View>
            ) : (
              ""
            )}
            {repayList.length > 0
              ? repayList.map(item => {
                  return (
                    <CouponOption
                      data={item}
                      key={item.value}
                      onReceiveCoupons={this.handleOk}
                      checkedValue={checkedValue}
                    />
                  );
                })
              : ""}
            <View className="use-discount">
              <Text>不使用优惠券</Text>
              <View onClick={this.useDiscount.bind(this)}>
                {this.state.useCoupon ? (
                  <Image
                    src={unChecked}
                    className="check-img"
                    mode="widthFix"
                  />
                ) : (
                  <Image
                    src={blueChecked}
                    className="check-img"
                    mode="widthFix"
                  />
                )}
              </View>
            </View>
          </CouponPop>
          {/* <RadioSelect
            show={this.state.couponShow}
            title='选择优惠券'
            checkedValue={this.state.checkedValue}
            radioData={radioCouponsData}
            onHandleOk={this.handleOk}
            onHandleClose={this.onHandleClose}
            noOpertion
          /> */}
        </View>
        <RepayInfo show={showRepayModal} onHideRepayInfo={this.hideRepayInfo} />
      </View>
    );
  }
}
