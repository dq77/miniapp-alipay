import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtActivityIndicator } from 'taro-ui'

class Index extends PureComponent {
  config = {
    navigationBarTitleText: ''
  }

  state = {}

  componentWillMount() {
    Taro.redirectTo({
      url: `/pages/home/index`
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
