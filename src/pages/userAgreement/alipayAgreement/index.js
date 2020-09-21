import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

export default class Test extends Taro.Component {
  config = {
    navigationBarTitleText: '淘租公租赁协议'
  }

  render() {
    return (
      <View className='agreement'>
        <View className='title'>淘租公租赁协议</View>
        <View className='body'>
          <View>甲方:杭州淘租公科技有限公司</View>
          <View>甲方地址: 浙江省杭州市江干区彭埠街道红普路759号汇禾禧福汇5号楼308室</View>
          <View>联系方式: 0571-8518-0735</View>
          <View>乙方:</View>
          <View>乙方身份证号:</View>
          <View>乙方联系方式:</View>
          <View className='text_blod'>(甲方、乙方关系说明: 【甲方】系指淘租公平台<Text className="text_red">（以下称“甲方”或“平台”）</Text>，【乙方】系指通过淘租公平台下单租用甲方产品的租户。乙方有权选择是否签署《租赁服务协议》。乙方在淘租公平台一旦勾选本协议，代表已阅读并同意本协议所有条款，认可本协议的法律效力。)甲方依据本 《租赁服务协议》.(“本协议”)的约定通过淘租公平台(“甲方”)为乙方提供租赁服务，请乙方务必审慎阅读本协议，乙方勾选“我同意《租赁服务协议》”并成功下单后，即视为乙方已经充分阅读并接受本协议全部条款，甲乙双方租赁服务关系即成立，本协议立即生效且具有法律效力。</View>
          <View className="text_w600 space">第一条 关于设备</View>
          <View className='paragraph'>
            1.1 设备由甲方向乙方提供，双方一致确认甲方注册地为合同签订地。
          </View>
          <View className='paragraph'>
            1.2设备的详细信息，包括品牌、型号、配置、租金单价、总价、租期等，以下单页面为准。
          </View>
          <View className='paragraph'>
            1.3 乙方在租用设备下单前应当向平台及甲方提供自己的身份证真实姓名和号码，同时还应当提供租赁设备准确的邮寄送达地址及联系方式（包括但不限于手机号码、 微信号、QQ及邮箱等)。乙方提供的身份证地址与邮寄送达地址不一致的，以乙方确认的下单页或发货时确认的邮寄送达地址为准。在租赁期限内，乙方地址及联系方式变更时应及时通知甲方和平台，否则由此导致租赁设备无法送达或丢失、电话信息失联等一切损失均由乙方承担。
          </View>
          <View className='paragraph'>
            1.4 乙方在租用设备过程中，需确保设备完好，未经甲方同意，不得私自拆卸、私自升级系统或软件服务，否则视为违约。
          </View>
          <View className="text_w600 space">第二条 租金和押金</View>
          <View className='paragraph'>
            2.1 产品租金及押金由甲方自主确定，租户在下单时，由平台收取相应租金、押金。
          </View>
          <View className='paragraph'>
            2.2 平台根据租户信用资质授予免押金额度，设备押金在免押金额度范围内的，不需要支付押金；超出部分，应支付押金；甲乙双方未确认发货前，甲方有权决定变更减免押金的额度，且须经过甲乙双方同意后订单才生效。租赁期限届满，租户应及时将设备归还甲方，甲方在收到设备后经检测确认无损坏的，应当在3个工作日退还押金，节假日顺延。租户在租赁期限届满后未及时归还设备的，甲方除有权继续按协议约定标准收取租金外还可按10元/天收取违约金；租户逾期归还设备超过15天的，甲方可直接扣除租户全部押金。
          </View>
          <View className='paragraph'>
            2.3 甲方产品租金收取方式分两种: 一期及多期。 乙方提交订单时需支付至少一期租金。平台在下一个交租周期自动从乙方的注册账户中扣除下一期租金。甲乙双方未确认发货前，甲方有权决定预收几期租金，且须经过甲乙双方同意后订单才生效。乙方应保证在租金付款日账户中有足够金额，以免造成租金支付逾期。
          </View>
          <View className='paragraph'>
            2.4 乙方应当按时足额支付租金，否则，甲方有权提前终止本协议，收回租赁设备，并要求乙方付清所欠的租金并加收租金总额30%的违约金。
          </View>
          <View className='paragraph'>
            2.5 租期期间正常设备折旧，设备自然产生的硬件故障由甲方免费更换，软件问题由甲方协助。因人为损坏，拆解，划痕等问题导致维修的，乙方应承担配件成本和维修费用，维修期间的租期费用继续计算。如设备无法修复或修复价格超过设备本身价值或设备丢失的， 乙方应当按下单页中约定的官网售价进行原价赔偿。
          </View>
          <View className='paragraph'>
            2.6 设备使用过程中因软件造成设备不能使用的问题不包含在租赁服务中，但可要求甲方尽力协助解决。
          </View>

          <View className="text_w600 space">第三条 关于订单取消、租期计算和提前归还</View>

          <View className='paragraph'>
            3.1 租赁产品发货后非设备质量问题，甲方有权拒绝退货。
          </View>
          <View className='paragraph'>
            3.2 租期自甲方快递派单(签收)第二天起算或甲方上门送货安装当天起算至设备归还甲方并检测合格之日止。
          </View>
          <View className='paragraph'>
            3.3 除非甲方设备介绍页面约定可随借随还，否则乙方不能提前归还，按原租期计算租金，已交总租金不退。
          </View>
          <View className="text_w600 space">第四条 售卖商品七天无理由退换条款</View>

          <View className='paragraph'>
            4.1 售卖商品签收之日起七天内（按照签收后的第二天开始计算时间），商品完好可申请7天无理由退货（租赁及特殊商品除外）。完好标准：能够保持原有品质、功能，商品本身、配件、商标标识齐全的，视为商品完好。如赠品丢失，退款需扣除赠品费用。部分商品因商品属性问题，不支持7天无理由退货，详情请查看商品详情页介绍及售后政策。
          </View>
          <View className='paragraph'>
            4.2 退换货要求具备商品收到时完整的外包装、配件、吊牌等；如购买物品被洗过、影响二次销售，人为破坏或标牌拆卸的不予退换；所有预定或订制特殊尺码的不予退换；亲肤类美容仪或拆封后导致商品品质发生变化影响人身安全、生命健康等特殊物品一旦拆封或使用不得退换。
  得退换。
          </View>
          <View className='paragraph'>
            4.3 非质量问题的情况下因乙方或消费者原因要求更换、或退回产品，在不影响产品二次销售的情况下（包装完好，未曾安装，未曾使用，非定制产品等），甲方方可安排退换货，责任方应承担相应费用（如往返运费、搬运费等）。
          </View>

          <View className="text_w600 space">第五条 续租</View>

          <View className='paragraph'>
            租赁期限届满后，租户需要续租的，可以申请续租即在“我的订单”找到待归还的设备，点击续租按钮，商户同意后，租户继续按原租赁协议约定标准及期限支付租金，无需另行支付押金。
          </View>

          <View className="text_w600 space">第六条 支付方式</View>
          <View className='paragraph'>
            甲方平台提供支付宝、信用卡、芝麻信用授权等支付方式。
          </View>

          <View className="text_w600 space">第七条 订单审核</View>
          <View className='paragraph text_blod'>
            乙方提交订单后，甲方对乙方订单信息进行评估，若判定乙方风险系数较高，甲方有权让乙方补交押金或授权或提供担保，若乙方未补交押金或担保物的，甲方有权无需通知乙方直接关闭该订单，已经支付的款项原路退还乙方。
          </View>

          <View className="text_w600 space">第八条 发票开取</View>
          <View className='paragraph'>
            发票由甲方提供。乙方需开具发票的，下单时候，索取发票，填写发票抬头，以及开票详细资料，且需主动与甲方联系。开票内容可为“租期赁服务费”，类型可以为增值税普通发票或增值税专用票。
          </View>

          <View className="text_w600 space">第九条 甲方的权利与义务</View>
          <View className='paragraph'>
            9.1 甲方在租赁期间拥有租赁设备的所有权。
          </View>
          <View className='paragraph'>
            9.2 甲方有权按租赁协议收取租金。
          </View>
          <View className='paragraph'>
            9.3 甲方有权对乙方提交申请租赁的信用信息有知情权并可合法使用该信息讲行风控评估、甲方承诺不泄露乙方在平台留存的资料信息。
          </View>
          <View className='paragraph'>
            9.4 甲方应当对设备的自然故障提供更换或维修的服务。
          </View>
          <View className='paragraph'>
            9.5 甲方应当向乙方交付运行正常的设备，保证设备配置和乙方在订单中标明的一致。
          </View>
          <View className='paragraph'>
            9.6 甲方负责乙方归还设备检测并有权在乙方违约时进行追偿。
          </View>
          <View className='paragraph'>
            9.7 当乙方逾期不缴纳租金时，甲方有权立即收回租赁设备、终止履行协议并要求乙方承担相应的违约责任。无法收回租赁设备的，甲方有权要求乙方照价赔偿。
          </View>
          <View className='paragraph'>
            9.8 甲方不承担由乙方使用租赁设备引发纠纷的任何连带责任，包括但不限于各种人身伤害、财产损失、影响商誉，以及其他对第三方造成的损失。
          </View>

          <View className="text_w600 space">第十条 乙方权利与义务</View>
          <View className='paragraph'>
            10.1 在租赁期间拥有租赁设备的合法使用权。
          </View>
          <View className='paragraph'>
            10.2 租赁商品均可买断（买断价=官网售价+官网售价*8%/365*租赁天数-已付租金）。
          </View>
          <View className='paragraph'>
            10.3 按租赁协议之约定按时、足额向甲方支付租金。
          </View>
          <View className='paragraph'>
            10.4 在租期结束时，按甲方要求主动归还租赁设备。
          </View>
          <View className='paragraph'>
            10.5 不得擅自变动、修理、拆卸、更改租赁设备硬件任何部件。
          </View>
          <View className='paragraph'>
            10.6（1）承担因使用不当造成租赁设备修理的费用，（2）承担因不当使用租赁设备或其他故意或者过失造成的任何损失。
          </View>

          <View className="text_w600 space">第十一条 关于信息保护</View>
          <View className='paragraph'>
            退租时，为保障乙方的隐私及信息安全，乙方需配合甲方妥善处理保存在租赁设备上的数据信息，对于退还的设备，甲方将抹除所有数据，将其还原设备出租前的初始状态，无义务保留设备中的相关信息。
          </View>

          <View className="text_w600 space">第十二条 失信客户的处理</View>
          <View className='paragraph'>
            12.1 以下情况之一的，乙方将被认定为失信客户:
          </View>
          <View className='paragraph'>
            (1) 逾期1个月不支付设备租金的或逾期后不缴纳逾期租金的
          </View>
          <View className='paragraph'>
            (2) 租赁期满，但拒不归还的。
          </View>
          <View className='paragraph'>
            (3) 归还的设备严重损坏，但拒不偿付维修费用的。
          </View>
          <View className='paragraph'>
            12.2 对于被列入失信客户名单的乙方，平台及甲方有权利采取包括但不限于以下的措施:
          </View>
          <View className='paragraph'>
            (1) 将乙方信息及相应负责人个人信息在甲方及相关平台网站等地公布。
          </View>
          <View className='paragraph'>
            (2) 有权将违约信息反馈给依法设立的征信机构(包括但不限于芝麻信用管理有限公司)乙方了解上述违约信息可能影响乙方在征信机构处的信用状况，并可能影响其申请或办理相关服务。
          </View>
          <View className='paragraph'>
            (3) 向公安机关报案。
          </View>
          <View className='paragraph'>
            (4) 向法院起诉。
          </View>

          <View className="text_w600 space">第十三条 隐私政策</View>
          <View className='paragraph'>
            13.1 本协议所指的“隐私”包括《电信和互联网用户个人信息保护规定》第4条规定的用户个人信息的内容以及未来不定时制定或修订的法律法规中租金明确规定的隐私应包括的内容。
          </View>
          <View className='paragraph'>
            13.2 当乙方注册淘租公账号以及在使用淘租公平台租赁服务时，乙方须向平台提供个人信息。甲方收集个人信息的目的是为用户提供尽可能多的个人服务以及风险评估，从而乙方享有免押租赁服务，在此过程中，平台不会泄露个人信息。
          </View>
          <View className='paragraph'>
            13.3 甲方不会在未经合法用户授权时，公开、编辑或透露其个人信息及保存在淘租公平台中的非公开内容，除非有下列情况:
          </View>
          <View className='paragraph'>
            (1) 事先获得用户的明确授权。
          </View>
          <View className='paragraph'>
            (2) 根据有关的法律法规要求。
          </View>
          <View className='paragraph'>
            (3) 按照相关政府主管部门的要求。
          </View>
          <View className='paragraph'>
            (4) 为维护社会公众的利益。
          </View>
          <View className='paragraph'>
            (5) 用户已成为严重失信用户。
          </View>
          <View className='paragraph'>
            13.4 为提升服务的质量，甲方可能会与第三方合作共同向用户提供相关服务，此类合作可能需要包括但不限于用户数据与第三方用户数据的互通。在此情况下，乙方知晓并同意如该第三方同意承担与甲方同等的保护用户隐私的责任，则甲方有权将用户的注册资料等提供给该第三方，并与第三方约定用户数据仅为双方合作之目的使用;并且甲方将对该等第三方使用用户数据的行为进行监督和管理，尽一切合理努力保护乙方个人信息的安全性。
          </View>
          <View className='paragraph'>
            13.5 甲方可以向乙方的电子邮箱、手机号码发送服务所必须的商业信息。
          </View>

          <View className="text_w600 space">第十四条 协议终止</View>
          <View className='paragraph'>
            14.1 租赁期满，乙方归还设备，经甲方检测并结清所有费用后，该协议终止。
          </View>
          <View className='paragraph'>
            14.2 如乙方下单后设备交付前取消订单，经甲方与乙方协商一致，该协议终止。
          </View>
          <View className='paragraph'>
            14.3 在租赁期内，乙方主动要求终止协议，并与甲方达成一致，该协议终止。
          </View>

          <View className="text_w600 space">第十五条 争议处理</View>
          <View className='paragraph'>
            因本协议履行过程中引起的或与本协议相关的任何争议，双方应以友好协商的方式解决，若经协商仍未解决，双方均可向甲方所在地人民法院提起诉讼，甲方为实现债权所产生案件受理费、诉讼保全费、公告费、律师费(最低按2000元/件计算，具体以委托合同及发票数额为准)、差旅行费等一切费用由违约方承担。
          </View>

          <View className="text_w600 space">第十六条 通知方式</View>
          <View className='paragraph'>
            甲乙双方共同确认的有效通讯地址如下：
          </View>
          <View className='paragraph'>
            甲方邮件地址：developer@taozugong.onaliyun.com
          </View>
          <View className='paragraph'>
            寄送地址：浙江省杭州市西湖区文一西路益乐路口浙江财经大学文华校区学博楼People2办公室107
          </View>
          <View className='paragraph'>
            联系人及电话号码：0571-8518-0735
          </View>
          <View className='paragraph'>
            乙方邮件地址：
          </View>
          <View className='paragraph'>
            寄送地址：
          </View>
          <View className='paragraph'>
            联系人及电话号码：
          </View>
          <View className='paragraph'>
            双方确认以合同中预留联系方式作为双方之间往来以及仲裁机构仲裁和法院（包括一审、二审、执行等）的相关资料、通知、法律文书（包括裁决书、裁定、判决等）的送达地址。任何一方在本合同履行期间发生变更通讯地址的，均有义务书面通知另一方，否则，由此产生的风险由未履行告知义务一方承担。双方可以用电子邮件、快递、传真等方式作为书面通知方式。以电子邮件方式通知的，自邮件发出的第48小时，视为通知已经送达；以快递方式通知的，自快递发出的第72小时，视为通知已经送达；以传真方式通知的，以对方确认收到传真之时视为通知已经送达。以手机短信方式通知的，自短信发出的第24小时，视为通知已经送达。任何一方当事人、仲裁机构或者执行法院向上述方式发送法律文件被邮件系统或者短信系统退回的，均按照上述约定视为已经完成送达。
          </View>

          <View className="text_w600 space">第十七条 其他</View>
          <View className='paragraph'>
            本协议有效期自乙方下单并依约支付租金日起至甲方收回设备检测合格且乙方结清所有租金等费用之日止。
          </View>
          <View className='paragraph'>
            下单页面、甲方发货单等均是本协议附件，与本协议有同等法律效力。
          </View>

          <View className="text_w600 space">第十八条 免责条款</View>
          <View className='paragraph'>
            本协议有效期内，因国家相关主管部门颁布、变更的法律法规、政策导致甲方不能提供约定服务的，不视为其违约，各方可根据相关的法律法规、政策变更协议内容或提前终止本协议。
          </View>
          <View className='paragraph'>
            如果乙方对本协议修改后的任何条款表示异议，乙方可以主动取消或不再使用甲方服务；如果乙方继续选择使用甲方服务，则视为乙方已经完全接受本协议及其修改。
          </View>

          <View className="text_w600 space">第十九条 法律是适用和争议的解决</View>
          <View className='paragraph'>
            本协议受中华人民共和国法律管辖并按中华人民共和国法律解释
          </View>
        </View>
      </View>
    )
  }
}
