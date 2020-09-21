import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtButton } from "taro-ui";
import RadioSelect from "../../components/RadioSelect";
import LeaseEnd from "../../components/leaseEnd";
import propTypes from "prop-types";
import "./index.scss";

export default class Test extends Taro.Component {
  static propTypes = {
    goodData: propTypes.object
  };
  static defaultProps = {
    goodData: () => {}
  };
  state = {
    leaseTimeShow: false,
    leaseTimeData: [],
    leaseSelectValue: ""
  };

  dealText(data, Buyout, relet) {
    const flag = data.goodType; // true 租赁  false  售卖
    if (Buyout) {
      return "买断价:";
    }
    if (relet) {
      return "续租租金:";
    }
    if (flag) {
      return "租金:";
    } else {
      return "销售价:";
    }
  }

  openLeaseShow = () => {
    if (!this.state.goodData.relet) {
      return;
    }
    this.props.onIsShow(true);
    // this.setState({
    //   leaseTimeShow: true,
    //   leaseTimeData: this.props.goodskuStageVOList,
    //   leaseSelectValue: String(this.props.goodData.productInfo.stageNumber)
    // })
    this.props.onFooterShow(false);
  };

  handlePayOk = checkedValue => {
    this.setState({
      leaseTimeShow: false
    });
    this.props.onStageNumberChange(checkedValue);
    this.props.onFooterShow(true);
  };

  onHandlePayClose = () => {
    this.setState({
      leaseTimeShow: false
    });
    this.props.onFooterShow(true);
  };

  render() {
    const {
      goodData = {},
      showUnit,
      showLease,
      detailBtn,
      freight,
      rentInfo
    } = this.props;
    return (
      <View className="GoodsInfo">
        <View
          className={
            this.props.showLease ? "goodsContent pdBottom" : "goodsContent"
          }
        >
          <View className="imgWrap">
            <Image
              mode="aspectFit"
              src={(goodData.productInfo && goodData.productInfo.cover) || ""}
              className="imgStyle"
            />
            <View className="leasePopover">
              {goodData.productInfo.goodType || goodData.relet
                ? "到期归还"
                : !goodData.productInfo.goodType || goodData.Buyout
                ? "无需归还"
                : ""}
            </View>
          </View>
          <View
            className={
              goodData.productInfo.detail ? "goods" : "goods flexColumn"
            }
          >
            <View className="good_name">
              <Text className="name_text">
                {(goodData.productInfo && goodData.productInfo.name) || "--"}
              </Text>
            </View>
            {goodData.productInfo && goodData.productInfo.detail ? (
              <View className="good_detail">
                <Text>规格：</Text>
                <Text>
                  {(goodData.productInfo && goodData.productInfo.detail) ||
                    "--"}
                </Text>
              </View>
            ) : null}
            <View className="good_price">
              <Text>
                {goodData.productInfo &&
                  this.dealText(
                    goodData.productInfo,
                    goodData.Buyout,
                    goodData.relet
                  )}
              </Text>
              <Text style="margin-left:10px;">
                ¥{goodData.productInfo && goodData.productInfo.showPrice}
              </Text>
              {// goodType  true 显示单位  false 不显示（租赁商品显示  分期商品不显示）
              showUnit &&
              goodData.productInfo &&
              goodData.productInfo.goodType ? (
                <Text>
                  {goodData.productInfo && goodData.productInfo.unit ? "/" : ""}
                  {goodData.productInfo && goodData.productInfo.unit}
                </Text>
              ) : null}
              <Text className="counts">
                {" "}
                ×{(goodData.productInfo && goodData.productInfo.count) || "--"}
              </Text>
            </View>
          </View>
        </View>
        {/* 租期 */}
        {showLease ? (
          <View className="GoodsLease">
            <View className="lease" onClick={this.openLeaseShow}>
              {/* <View className='lease'> */}
              <Text className="lease_label">租期</Text>
              <Text className="lease_brief">自物流签收第二天开始计算</Text>
              <Text className="lease_time">
                {goodData.productInfo && goodData.productInfo.stageNumber}
                {goodData.productInfo && goodData.productInfo.unit === "月"
                  ? "个"
                  : ""}
                {goodData.productInfo && goodData.productInfo.unit}
                {goodData.relet ? (
                  <View className="at-icon at-icon-chevron-right vgn" />
                ) : null}
              </Text>
            </View>
          </View>
        ) : null}
        {/* 租期结束后可选择方案 */}
        {!detailBtn && ((goodData.productInfo && goodData.productInfo.goodType) || goodData.relet) ? (
          <View className="leaseModel">
            <LeaseEnd rentInfo={rentInfo}></LeaseEnd>
          </View>
        ) : null}
        {/* 运费 */}
        {!detailBtn && !goodData.relet && !goodData.Buyout ? (
          <View className="GoodsLease">
            <View className="lease">
              <Text className="lease_label">运费</Text>
              {showLease && <Text className="lease_brief">含来回运费</Text>}
              <Text className="lease_time">
                {freight ? "￥" + freight : "免运费"}
              </Text>
            </View>
          </View>
        ) : null}
        {/* 商品 续租 买断按钮 */}
        {detailBtn ? (
          <View className="GoodsLease" style={{ marginTop: 10 }}>
            <View className="btn">
              {goodData.productInfo && goodData.renewal ? (
                <AtButton
                  type="secondary"
                  size="small"
                  onClick={() => this.props.onRelet(goodData)}
                >
                  续租
                </AtButton>
              ) : null}

              {goodData.productInfo && goodData.buyout ? (
                <AtButton
                  type="secondary"
                  size="small"
                  onClick={() => this.props.onBuyout(goodData)}
                >
                  买断
                </AtButton>
              ) : null}
            </View>
          </View>
        ) : null}
        <RadioSelect
          show={this.state.leaseTimeShow}
          title="选择租期"
          checkedValue={this.state.leaseSelectValue}
          radioData={this.state.leaseTimeData}
          onHandleOk={this.handlePayOk}
          onHandleClose={this.onHandlePayClose}
          noOpertion
        />
      </View>
    );
  }
}
