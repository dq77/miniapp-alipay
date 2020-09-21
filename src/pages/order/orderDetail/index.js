import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton, AtModal, AtCurtain, AtList, AtListItem } from "taro-ui";
import Top from "./orderTopInfo"; // 顶部
import GoodInfo from "../../../components/GoodsInfo"; // 商品信息
import LeaseEnd from "../../../components/leaseEnd";
import GoodPric from "./orderPrice"; // 金额明细
import OrderMessage from "./orderMessage";
import {
  payform_h5,
  payOrderMoney_signing,
  withoutCodePay,
  alipayLife_h5,
  preAuthorization,
  appMiniPay,
  appMiniAuthPay
} from "../../../components/payMoney/index";
import { get as getGlobalData } from "../../../global_data";
import { ysfConfig } from "../../../utils/kefu";
import { cnzzTrackEvent } from "../../../utils/cnzz";
import { urlSplit } from "../../../utils/utils";
import { serviecUrl } from "../../../config/index";
import "./index.scss";
import { setSessionItem, getCookie } from "../../../utils/save-token";

@connect(({ orderDetail, home, orderList, bill }) => ({
  ...orderDetail,
  ...home,
  ...orderList,
  ...bill
}))
export default class Test extends Taro.Component {
  constructor() {
    super(...arguments);
    this.state = {
      balance: "", // 抵扣余额
      isTopay: false, // 免密支付确认弹窗
      logistics: false, // 物流跟踪弹窗
      callbackOrderNo: "",
      selectedOrderGood: [],
      isReGoods: false,
      orderNo: "",
      rentInfo: {} // 租赁到期 续租买断价格信息
    };
  }

  config = {
    navigationBarTitleText: "订单详情"
  };

  componentWillMount() {
    const { orderNo, callback } = this.$router.params;
    if (orderNo) {
      this.fetchOrderDetail();
      callback && this.signcallBack(orderNo);
    } else {
      Taro.showToast({
        title: "订单数据有误",
        icon: "none"
      }).then(() => {
        setTimeout(() => {
          Taro.navigateBack({
            delta: 1
          });
        }, 1000);
      });
    }

    this.getBalance();
  }

  componentDidMount() {
    this.getRentInfo();
  }

  componentDidShow() {}

  // 签约回调
  signcallBack = orderNo => {
    this.setState({
      isTopay: true,
      callbackOrderNo: orderNo
    });
  };
  getBalance() {
    this.props.dispatch({
      type: "bill/getBill",
      payload: {
        orderNo: this.$router.params.orderNo
      },
      callback: data => {
        this.setState({
          balance: data.totalBalance
        });
      }
    });
  }
  // 支付
  payPrice = () => {
    // 友盟埋点
    cnzzTrackEvent("订单详情页", "开始支付");
    Taro.showLoading({
      title: "开始支付"
    });
    let siginUrl = "";
    if (
      getGlobalData("Channel") !== "APLIPAY_MINI_PROGRAM" &&
      getGlobalData("Channel") !== "WeChat"
    ) {
      siginUrl = urlSplit(window.location.href); // 截取 url 问号前面字符
    }
    let onepayUrl = "";
    if (getGlobalData("Channel") === "JDBT") {
      onepayUrl = serviecUrl + "/pages/order/payResult/index";
    } else if (getGlobalData("Channel") === "APLIPAY_MINI_PROGRAM") {
      onepayUrl = serviecUrl + "/#/pages/order/payResult/index";
    }
    const Url = this.props.orderDetail.payType * 1 === 1 ? onepayUrl : siginUrl; // 根据支付方式设置不同的回调地址
    let params = {
      orderNo: this.$router.params.orderNo,
      callbackUrl: Url
    };
    this.props.dispatch({
      type: "orderList/payMoney",
      payload: params,
      callback: res => {
        Taro.hideLoading();
        if (res && res.code === 0) {
          // 京东收银台支付
          payform_h5("https://h5pay.jd.com/jdpay/saveOrder", res.data);
        } else if (res && res.code === 10) {
          // 京东免密签约
          payOrderMoney_signing(res.data.requestUrl);
        } else if (res && res.code === 20) {
          // 京东免密代扣支付
          Taro.hideLoading();
          setTimeout(() => {
            this.setState({
              isTopay: true,
              callbackOrderNo: res.data.orderNo
            });
          }, 1000);
        } else if (res.code === 3) {
          // 支付宝收银台支付
          alipayLife_h5(res.data.body);
        } else if (
          res.code === 12 &&
          getGlobalData("Channel") === "ALIPAY_LIFE"
        ) {
          // 支付宝预授权支付
          preAuthorization(res.data.orderStr).then(
            () => {
              // 预授权成功
              Taro.showToast({ title: "预授权成功" }).then(() => {
                if (res.data.isContinue) {
                  Taro.showToast({
                    title: "已为您成功续租",
                    icon: "success",
                    duration: 2000
                  }).then(() => {
                    setTimeout(() => {
                      Taro.navigateTo({
                        url: `/pages/order/payResult/index?orderNo=${res.data.orderNo}`
                      });
                    }, 2000);
                  });
                  return;
                }
                setTimeout(() => {
                  this.WithoutCodePaypay(res.data.orderNo);
                }, 1500);
              });
            },
            () => {
              // 预授权失败
              Taro.showToast({ title: "预授权失败,请稍后再试", icon: "none" });
            }
          );
        } else if (
          res.code === 12 &&
          getGlobalData("Channel") === "APLIPAY_MINI_PROGRAM"
        ) {
          appMiniAuthPay(res.data.orderStr).then(
            () => {
              Taro.showToast({
                title: "预授权成功",
                duration: 1000,
                icon: "success"
              });
              if (res.data.isContinue) {
                Taro.showToast({
                  title: "已为您成功续租",
                  icon: "success",
                  duration: 1000
                });
                Taro.navigateTo({
                  url: `/pages/order/payResult/index?orderNo=${res.data.orderNo}`
                });
                return;
              }
              // 预授权成功
              this.WithoutCodePaypay(res.data.orderNo);
            },
            resCode => {
              if (resCode * 1 === 6001) {
                // 用户点击取消
                Taro.showToast({
                  title: "取消支付",
                  icon: "none"
                });
                this.fetchOrderDetail();
                return;
              }
              // 预授权失败
              Taro.showToast({ title: "预授权失败,稍后再试", icon: "fail" });
            }
          );
        } else if (res.code === 4) {
          appMiniPay(res.data.tradeNo).then(
            () => {
              Taro.navigateTo({
                url: `/pages/order/payResult/index?orderNo=${res.data.orderNo}`
              });
            },
            resCode => {
              if (resCode * 1 === 6001) {
                // 用户点击取消
                Taro.showToast({
                  title: "取消支付",
                  icon: "none"
                });
                this.fetchOrderDetail();
                return;
              }
              Taro.navigateTo({
                url: `/pages/order/payResult/index?orderNo=${res.data.orderNo}&payStatus=false`
              });
            }
          );
        }
      }
    });
  };

  // 京东免密支付
  WithoutCodePaypay(orderNo) {
    Taro.showLoading({ title: "开始支付" });
    withoutCodePay({ orderNo: orderNo })
      .then(res => {
        Taro.hideLoading();
        if (res.code === 200) {
          if (
            process.env.TARO_ENV === "weapp" ||
            process.env.TARO_ENV === "alipay"
          ) {
            Taro.showToast({
              title: "支付成功",
              icon: "success",
              duration: 1000
            });
            Taro.navigateTo({
              url: `/pages/order/payResult/index?orderNo=${orderNo}`
            });
            return;
          }
          Taro.showToast({
            title: "支付成功",
            icon: "success",
            duration: 2000
          }).then(() => {
            setTimeout(() => {
              Taro.navigateTo({
                url: `/pages/order/payResult/index?orderNo=${orderNo}`
              });
            }, 1000);
          });
        } else {
          if (
            process.env.TARO_ENV === "weapp" ||
            process.env.TARO_ENV === "alipay"
          ) {
            Taro.showToast({
              title: res.msg,
              icon: "none",
              duration: 1000
            });
            Taro.navigateTo({
              url: `/pages/order/payResult/index?orderNo=${orderNo}&payStatus=false`
            });
            return;
          }
          Taro.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000
          }).then(() => {
            setTimeout(() => {
              Taro.navigateTo({
                url: `/pages/order/payResult/index?orderNo=${orderNo}&payStatus=false`
              });
            }, 2000);
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  // 联系客服
  service = () => {
    // 友盟埋点
    cnzzTrackEvent("订单详情页", "客服联系");
    if (process.env.TARO_ENV === "weapp" || process.env.TARO_ENV === "alipay") {
      return;
    }
    Taro.showToast({ title: "正在为你连接客服", icon: "loading" });
    ysfConfig(ysf);
  };

  // 取消订单
  cancelOrder(orderNo) {
    // 友盟埋点
    cnzzTrackEvent("订单详情页", "订单取消");
    let params = {
      orderNo
    };
    this.props.dispatch({
      type: "orderDetail/closeOrder",
      payload: params,
      callback: res => {
        if (res.code === 200) {
          Taro.showToast({
            title: "订单成功取消",
            icon: "success"
          }).then(() => {
            setTimeout(() => {
              this.fetchOrderDetail();
            }, 1000);
          });
        } else {
          Taro.showToast({
            title: res.msg,
            icon: "none"
          });
        }
      }
    });
  }

  // 续租
  relet = goodsData => {
    // 友盟埋点
    cnzzTrackEvent("订单详情页", "续租");
    goodsData.payType = this.props.orderDetail.payType; // 将payType 放入goodsData中
    goodsData.parentOrderNo = this.$router.params.orderNo;
    // sessionStorage.setItem('reletInfo', JSON.stringify(goodsData))
    setSessionItem("reletInfo", JSON.stringify(goodsData));
    Taro.navigateTo({
      url: `/pages/order/orderConfirm/index?relet=true&orderNo=${goodsData.oid}`
    });
  };

  // 买断
  buyout = goodsData => {
    // 友盟埋点
    cnzzTrackEvent("订单详情页", "买断");
    // sessionStorage.setItem('buyOutInfo', JSON.stringify(goodsData))
    setSessionItem("buyOutInfo", JSON.stringify(goodsData));
    Taro.navigateTo({
      url: `/pages/order/orderConfirm/index?buyout=true&orderNo=${goodsData.oid}`
    });
  };

  // 物流跟踪
  orderLogistics = params => {
    // 友盟埋点
    cnzzTrackEvent("订单详情页", "物流跟踪");
    this.props.dispatch({
      type: "orderList/getexpressinfo",
      payload: params,
      callback: res => {
        if (res.code === 200) {
          if (res.data.length === 0) {
            Taro.showToast({
              title: "暂无物流信息",
              icon: "none"
            });
          } else if (res.data.length === 1) {
            Taro.navigateTo({
              url: `/pages/address/logistics/index?orderNo=${res.data[0]}`
            });
          } else if (res.data.length > 1) {
            this.setState({
              selectedOrderGood: res.data || [],
              logistics: true
            });
          }
        }
      }
    });
  };

  // 前往物流页面
  navToLogistics() {
    // 友盟埋点
    cnzzTrackEvent("订单详情页", "前往物流详情");
    Taro.navigateTo({
      url: `/pages/address/logistics/index?orderNo=${this.state.orderNo}`
    });
  }

  onlogisticsClose = () => {
    this.setState({
      logistics: false
    });
  };

  // 订单详情
  fetchOrderDetail() {
    let params = {
      orderNo: this.$router.params.orderNo
    };
    Taro.showLoading({
      title: "loading"
    });
    this.props.dispatch({
      type: "orderDetail/getorederdetail",
      payload: params,
      callback: () => {
        Taro.hideLoading();
      }
    });
  }

  // 获取租赁到期 买断续租价格信息
  getRentInfo = () => {
    let params = {
      orderNo: this.$router.params.orderNo
    };
    this.props.dispatch({
      type: "orderDetail/getRentInfo",
      payload: params,
      callback: data => {
        if (data.code == 200 && data.data.length > 0) {
          this.setState({
            rentInfo: data.data[0]
          });
        }
      }
    });
  };

  // 查看协议(分渠道)
  navToagreement() {
    // 友盟埋点
    cnzzTrackEvent("订单详情页", "租赁协议");
    if (getGlobalData("Channel") === "JDBT") {
      Taro.navigateTo({
        // 京东
        url: "/pages/userAgreement/jdbtAgreement/index"
      });
    } else if (getGlobalData("Channel") === "weapp") {
      // 微信
    } else if (
      getGlobalData("Channel") === "ALIPAY_LIFE" ||
      getGlobalData("Channel") === "APLIPAY_MINI_PROGRAM"
    ) {
      // 支付宝
      Taro.navigateTo({
        url: "/pages/userAgreement/alipayAgreement/index"
      });
    }
  }

  // 添加goodType
  formart(item) {
    item.productInfo.goodType = item.businessType ? false : true;
    // item.productInfo.showPrice = item.periodAmount  // 订单详情里showPrice 取periodAmount值
    item.Buyout = this.props.orderDetail.tradeType === "Buyout" ? true : false;
    return item;
  }

  // 确认收货
  confirmReceGoods(orderNo) {
    this.setState({
      isReGoods: true,
      orderNo
    });
  }

  handleReGoodsCancel() {
    this.setState({
      isReGoods: false
    });
  }

  handleReGoodsConfirm() {
    this.setState({
      isReGoods: false
    });
    this.recepit();
  }

  // 收货
  recepit = () => {
    // 友盟埋点
    cnzzTrackEvent("订单详情页", "确认收货");
    let params = {
      orderNo: this.state.orderNo
    };
    this.props.dispatch({
      type: "orderList/receiveGoods",
      payload: params,
      callback: res => {
        if (res.code === 200) {
          Taro.showToast({
            title: "收货成功",
            icon: "success"
          }).then(() => {
            setTimeout(() => {
              this.fetchOrderDetail();
            }, 1000);
          });
        } else {
          Taro.showToast({
            title: res.msg,
            icon: "none"
          });
        }
      }
    });
  };

  render() {
    const { orderDetail, goodsList } = this.props;
    const {
      isTopay,
      logistics,
      selectedOrderGood,
      isReGoods,
      balance,
      rentInfo
    } = this.state;
    // const height = getWindowHeight();
    const openid = getCookie("openid");
    return (
      <View className="orderDetail">
        <View className="top">
          <Top topData={orderDetail} />
        </View>
        <View className="main">
          {/* 商品信息 */}
          {orderDetail.orderDetailVos
            ? orderDetail.orderDetailVos.map(item => (
                <GoodInfo
                  detailBtn
                  showLease={false}
                  showUnit
                  goodData={this.formart(item)}
                  key={item}
                  onRelet={this.relet}
                  onBuyout={this.buyout}
                />
              ))
            : null}

          {/* 金额明细 */}
          <GoodPric
            priceData={orderDetail}
            balance={balance}
            orderNo={this.$router.params.orderNo}
          />

          {/* 租期结束后可选择方案 */}
          {rentInfo.tradeType &&
          orderDetail.tradeType !== "Sales" &&
          orderDetail.tradeType !== "Buyout" ? (
            <View className="leaseEnd">
              <LeaseEnd isOpen={true} rentInfo={rentInfo}></LeaseEnd>
            </View>
          ) : (
            ""
          )}

          {/* 订单编号 时间 支付方式  备注 */}
          <OrderMessage mesData={orderDetail} />

          {/* 租赁协议 */}
          <View className="lease" onClick={this.navToagreement}>
            <Text>租赁协议</Text>
            <Text className="lease_right">
              查看 <View className="at-icon at-icon-chevron-right vgn" />
            </Text>
          </View>

          {/* 猜你喜欢 */}
          {/* <View className='moer'>
            <AtDivider content='猜你喜欢'  fontColor='#999' lineColor='##D9D9D9;' />
            <ScrollView scrollY
              className='item__wrap'
              style={{ height }}
            >
              <GoodGrid goodDatas={goodsList} />
            </ScrollView>
          </View> */}
        </View>
        <View className="footer">
          <View className="at_btn">
            <View className="pos">
              <contact-button
                tnt-inst-id="MBNCBMCN"
                scene="SCE00005174"
                alipay-card-no={openid}
                size="140rpx"
                icon="https://iph.href.lu/879x200"
              />
            </View>
            <Text className="">联系客服</Text>
          </View>

          {// 待收货
          orderDetail.status === 10042 ? (
            <AtButton
              type="secondary"
              size="small"
              onClick={() => this.confirmReceGoods(orderDetail.orderNo)}
            >
              确认收货
            </AtButton>
          ) : null}
          {// 待收货  已完成 并且非续租买断订单才可以查看物流
          (orderDetail.status === 10042 &&
            orderDetail.tradeType !== "Buyout" &&
            orderDetail.tradeType !== "Renewal") ||
          (orderDetail.status === 10065 &&
            orderDetail.tradeType !== "Buyout" &&
            orderDetail.tradeType !== "Renewal") ? (
            <AtButton
              type="secondary"
              size="small"
              onClick={() =>
                this.orderLogistics({ orderNo: orderDetail.orderNo })
              }
            >
              物流跟踪
            </AtButton>
          ) : null}
          {// 待支付显示订单取消按钮
          orderDetail.status === 10010 ? (
            <AtButton
              size="small"
              onClick={() => this.cancelOrder(orderDetail.orderNo)}
            >
              取消订单
            </AtButton>
          ) : null}
          {// 待支付
          orderDetail.status === 10010 || orderDetail.status === 10020 ? (
            <AtButton type="secondary" size="small" onClick={this.payPrice}>
              去支付
            </AtButton>
          ) : null}
        </View>
        {/* 物流跟踪 */}
        <AtCurtain isOpened={logistics} onClose={this.onlogisticsClose}>
          <AtList>
            {selectedOrderGood.length > 1
              ? selectedOrderGood.map(option => {
                  return (
                    <AtListItem
                      title="物流编号"
                      note={option}
                      extraText="查看物流"
                      arrow="right"
                      key={option}
                      onClick={() => this.navToLogistics(option)}
                    />
                  );
                })
              : null}
          </AtList>
        </AtCurtain>

        {/* 免密支付提示 */}
        <AtModal
          isOpened={isTopay}
          confirmText="确认支付"
          onConfirm={() => this.WithoutCodePaypay(this.state.callbackOrderNo)}
          closeOnClickOverlay={false}
          content="您已签约免密支付,是否立即支付"
        />

        {/* 确认收货 */}
        <AtModal
          isOpened={isReGoods}
          cancelText="取消"
          confirmText="确认"
          onCancel={() => this.handleReGoodsCancel()}
          onConfirm={() => this.handleReGoodsConfirm()}
          content="确认收货"
        />
      </View>
    );
  }
}
