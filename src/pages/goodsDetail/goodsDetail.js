import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtActivityIndicator } from 'taro-ui'

class Index extends PureComponent {
  config = {
    navigationBarTitleText: ''
  }

  state = {}

  componentWillMount() {
    const no = this.$router.params.sn

    Taro.redirectTo({
      url: `/pages/goods/index?no=${no}`
    })
  }
  render() {
    return (
      <View>
        <AtActivityIndicator />
      </View>
    )
  }
}
export default Index
