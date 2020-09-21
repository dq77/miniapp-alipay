import { alipayAppauth } from "../../utils/accredit";
import { rqRedpacket } from "../../api/accredit";
export const handleRedPacket = params => {
  try {
    alipayAppauth().then(authCode => {
      getRedPacke(authCode)
        .then
        // 执行红包弹窗显示
        ();
    });
  } catch (error) {
    my.showToast({
      content: error.message
    });
  }
};

// 请求后台的红包领取接口
const getRedPacke = authCode => {
  return new Promise((resolve, reject) => {
    rqRedpacket({ authCode }).then(res => {
      if (res.code === 200) {
        resolve();
      } else {
        reject({
          ...res.data
        });
      }
    });
  });
};
