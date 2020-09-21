import Taro, { PureComponent } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { AtCurtain } from "taro-ui";
import "./index.scss";

const url = "http://tzg-static.oss-cn-hangzhou.aliyuncs.com";

class Index extends PureComponent {
  config = {
    navigationBarTitleText: "关注淘租公生活号,领现金红包"
  };

  state = {
    isShowRed: true,
    goodNo: [
      "181113183159106840",
      "190118102105748928",
      "181106112526321896",
      "180904150034368485"
    ]
  };

  componentWillMount() {}
  componentDidMount() {}

  receiveRed() {
    console.log("点击关注");
  }

  onClose() {
    console.log("红包领取弹窗关闭");
    this.setState({
      isShowRed: false
    });
  }

  navToDetail(no) {
    Taro.navigateTo({
      url: `/pages/goods/index?no=${no}`
    });
  }

  render() {
    return (
      <View className="redPage">
        <lifestyle
          publicId="2017091208699638"
          memo="关注领红包"
          onFollow={this.receiveRed}
        />
        <Image src={`${url}/activity/redpage/redh5.png`} mode="widthFix" />
        <View className="goodwrap">
          {this.state.goodNo.map(item => (
            <View className="goods_card" onClick={this.navTodetail}></View>
          ))}
        </View>
        <AtCurtain
          isOpened={this.state.isShowRed}
          onClose={this.onClose.bind(this)}
        >
          <Image
            style="width:100%;height:250px"
            src={`${url}/activity/redpage/redmd.png`}
          />
          <View className="red_price">
            <Text>0.02</Text>
          </View>
        </AtCurtain>
      </View>
    );
  }
}
export default Index;
