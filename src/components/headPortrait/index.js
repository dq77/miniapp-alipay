import Taro from '@tarojs/taro';
import { View,Image ,Input, Label} from '@tarojs/components';
import { AtAvatar } from 'taro-ui'
import './index.scss'

export default class Avatar extends Taro.Component {

  constructor(){
    super(...arguments)
    this.state ={
      ImagePrivew:this.props.avatarUrl
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.state.ImagePrivew !== nextProps.avatarUrl){
      this.setState({
        ImagePrivew:nextProps.avatarUrl
      })
    }
  }

  onChangeFile =(e) =>{
    let file = e.target.files[0]
    if(!this.fileFromart(file)){
      Taro.showToast({
        title:'大小不能超过1M',
        icon:'none'
      })
      return
    }
    const reader = new FileReader()
    const _this = this
    reader.onload = (event) => {
      const src = event.target.result;
      const image = new Image();
      image.src = src
      _this.setState({
        ImagePrivew:src
      })
      _this.props.onReadImageURL(file)
    }
    reader.readAsDataURL(file);
  }

  fileFromart(file){
    let fileSize = file.size / 1024 / 1024 < 1;
    if(!fileSize){
      return false
    }
    return true
  }

  render() {
    const {ImagePrivew} = this.state
    return (
      <View className='Avatar'>
        <Input
          type='file'
          accept='image/*'
          className='input-file'
          id='file'
          onInput={(e) => this.onChangeFile(e)}
          value={ImagePrivew}
        />
        <Label for='file' class='label-file'>
          {
            ImagePrivew ?  <Image className='user-photo' src={ImagePrivew} /> :  <AtAvatar className='user-photo' circle text='租'></AtAvatar>
          }
          {/* <Image className='image-picker' src={ImagePicker} onClick={this.upload} /> */}
        </Label>
      </View>
    );
  }
}
