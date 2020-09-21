import Taro, { Component, hideToast } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { getWindowHeight } from "@utils/style";
import Popup from "../../components/popup/index";
import Loading from "../../components/loading/index";
import { cnzzTrackEvent } from "../../utils/cnzz";
import "./index.scss";
import Gallery from "./gallery/index";
import GoodsInfo from "./goodsInfo/index";
import GoodsPrice from "./goodsPrice/index";
import GoodsAbout from "./goodsAbout/index";
import GoodsDetail from "./goodsDetail/index";
import Footer from "./footer/index";
import Spec from "./spec/index";
import { hasUserState } from "../../utils/accredit";
import { fetchTokenisUseless } from "../../api/accredit";

@connect(({ goods }) => ({
  ...goods
}))
export default class Goods extends Component {
  config = {
    navigationBarTitleText: "商品详情"
  };

  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      selectedInfos: {},
      // isFirst: true,
      visible: false,
      hadStock: true,
      isSpec: true, // 是否多规格表示
      relet: false, // 是否续租
      orderNo: "", // 续租订单号
      isfixed: false
    };
  }

  componentDidShow = () => {
    this.setState({
      loaded: false
    });
  };

  componentDidMount = () => {
    // 获取商品详情
    this.props.dispatch({
      type: "goods/getGoogsDetailById",
      payload: {
        no: this.$router.params.no
      },
      callback: data => {
        //当规格列表为空的时候为无规格商品
        if (
          data &&
          data.specificationVOList &&
          data.specificationVOList.length === 0
        ) {
          this.setState({
            isSpec: false
          });
        } else {
          this.setState({
            isSpec: true
          });
        }
      }
    });
  };

  // 检查是否有库存
  checkSkuStock = skuId => {
    if (skuId) {
      this.props.dispatch({
        type: "goods/checkSkuStock",
        payload: {
          skuId: skuId
        },
        callback: data => {
          this.setState({
            hadStock: data
          });
        }
      });
    }
  };

  // 规格选取事件
  handleSelect = selected => {
    const { selectedGoodsInfo } = this.props;
    Object.assign(selectedGoodsInfo, selected);
    this.setState({ selectedInfos: selectedGoodsInfo }, () => {
      this.props.dispatch({
        type: "goods/pushState",
        payload: {
          ...this.state.selectedInfos
        }
      });
    });
  };

  toggleVisible = () => {
    this.setState(
      {
        visible: !this.state.visible,
        selectedInfos: {}
      },
      () => {
        if (this.state.visible) {
          // 获取商品的sku详情
          this.props.dispatch({
            type: "goods/getGoodsSkuDetailById",
            payload: {
              no: this.$router.params.no
            },
            callback: data => {
              // 如果当前商品为无规格商品提前查询库存
              this.checkSkuStock(data[0].id);
            }
          });
        }
      }
    );
  };

  handleAdd = () => {
    cnzzTrackEvent("商品详情页", "用户点击立即购买/租赁");
    this.toggleVisible();
  };

  // 下单操作
  handleOkForOrder = () => {
    hasUserState().then(
      flag => {
        fetchTokenisUseless().then(res => {
          if (res.code == 200 && res.data == true) {
            if (flag) {
              const {
                selectedGoodsInfo = {},
                goodsDetailData,
                isStock,
                havedSpec
              } = this.props;
              const {
                selectedStageObj = {},
                selectedPayTypeObj = {},
                cnt
              } = selectedGoodsInfo;
              const {
                specificationVOList = [],
                businessType
              } = goodsDetailData;
              //  根据商品的规格列表判断当前商品是否为无多规格商品
              // if(havedSpec){
              //   if(Object.keys(skuStage).length === 0){
              //     Taro.showToast({
              //       icon:'none',
              //       title:'请选择商品规格'
              //     })
              //     return false;
              //   }
              // }
              // 判断当前下单数量是否大于库存
              if (cnt > isStock) {
                Taro.showToast({
                  icon: "none",
                  title: "库存不足"
                });
                return false;
              }

              // 售卖类型和租赁类型规则判断不一样
              if (businessType === 20) {
                // 友盟埋点
                cnzzTrackEvent("商品详情页", "立即购买");
                // 当类型为售卖并且支付方式为一次性支付时不需要判断租期
                if (selectedPayTypeObj.value === "1") {
                  const no = this.$router.params.no;
                  if (!no) return;
                  Taro.navigateTo({
                    url: `/pages/order/orderConfirm/index?no=${no}`
                  });
                } else {
                  if (
                    !!selectedStageObj.stageValue &&
                    Object.keys(selectedStageObj.stageValue).length > 0
                  ) {
                    const no = this.$router.params.no;
                    if (!no) return;
                    Taro.navigateTo({
                      url: `/pages/order/orderConfirm/index?no=${no}`
                    });
                  } else {
                    Taro.showToast({
                      icon: "none",
                      title: "请选择分期期数"
                    });
                  }
                }
              } else if (businessType === 0) {
                // 友盟埋点
                cnzzTrackEvent("商品详情页", "立即购买");
                if (Object.keys(selectedStageObj.stageValue).length > 0) {
                  const no = this.$router.params.no;
                  if (!no) return;
                  Taro.navigateTo({
                    url: `/pages/order/orderConfirm/index?no=${no}`
                  });
                } else {
                  Taro.showToast({
                    icon: "none",
                    title: "请选择商品租期"
                  });
                }
              }
            }
          }
        });
      },
      () => {
        Taro.showToast({ title: "授权成功" });
      }
    );
  };

  // 滚动事件
  handleScroll(e) {
    if (e.detail.scrollTop > 610) {
      this.setState({
        isfixed: true
      });
    } else {
      this.setState({
        isfixed: false
      });
    }
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: "goods/save",
      payload: {
        goodsDetailData: []
      }
    });
  }

  render() {
    const height = getWindowHeight(false);
    const {
      goodsDetailData,
      skuDetailData,
      selectedGoodsInfo,
      havedSpec
    } = this.props;

    const {
      pictureList,
      video = "",
      name,
      brief,
      minPrice,
      maxPrice,
      unit,
      officialPrice,
      businessType,
      goodsLabelList = [],
      specificationVOList = []
    } = goodsDetailData;
    const { hadStock } = this.state;

    const popupStyle =
      process.env.TARO_ENV === "rn"
        ? { transform: [{ translateY: Taro.pxTransform(-100) }] }
        : { transform: `translateY(${Taro.pxTransform(-100)})` };

    if (this.state.loaded) {
      return <Loading />;
    }
    return (
      <View className="goods-page">
        <ScrollView
          scrollY
          className="item__wrap"
          style={{ height }}
          onScroll={this.handleScroll.bind(this)}
        >
          {pictureList && pictureList.length > 0 && (
            <Gallery list={pictureList} video={video} />
          )}
          <GoodsInfo title={name} brief={brief} />
          <GoodsPrice
            minprice={minPrice}
            maxprice={maxPrice}
            goodsLabel={goodsLabelList}
            officialPrice={officialPrice}
            unit={unit}
            businessType={businessType}
          />
          <View className="space-between-20" />
          <GoodsAbout
            onAdd={this.handleAdd}
            goodData={goodsDetailData}
            selectedData={selectedGoodsInfo}
            no={this.$router.params.no}
          />
          <View className="space-between-20" />
          <GoodsDetail data={goodsDetailData} isfixed={this.state.isfixed} />
        </ScrollView>

        <Popup
          visible={this.state.visible}
          onClose={this.toggleVisible}
          compStyle={popupStyle}
        >
          <Spec
            havedSpec={havedSpec}
            data={goodsDetailData}
            skuDetailData={skuDetailData}
            selectedInfos={selectedGoodsInfo}
            onCheckStock={this.checkSkuStock}
            onSelect={this.handleSelect}
          />
        </Popup>

        <View className="item__footer">
          <Footer
            onAdd={this.handleAdd}
            onOK={this.handleOkForOrder}
            status={this.state.visible}
            isStock={hadStock}
            businessType={businessType}
            goods={goodsDetailData}
          />
        </View>
      </View>
    );
  }
}
