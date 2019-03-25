<template>
  <div id="home" v-if="onload">
    <div class="Main" v-if="!loginOut">
      <div class="homeTop rowFlex">
        <div class="homeTopLeft">
          <div class="homeTopLeftOne">
            <span>当前青豆</span>
            <label>约{{user.user.money}}元</label>
          </div>
          <div class="homeTopLeftTwo">
            <span>{{user.user.score}}</span>
            <!-- 这里区分版本号 小于1.4.3的是满1元提现  大于1.4.3的是立即提现 -->
            <label v-if="user.is_version_143=='1'" @click="goCash">立即提现</label>
            <label v-if="user.is_version_143=='0'" @click="goCash">满1元提现</label>
          </div>
        </div>
        <div class="homeTopRightTwo" v-if="downTime" @click="goHotTime">
          <div class="downTime">{{downTimeNum}}</div>
        </div>
        <div class="homeTopRightTop" v-if="!downTime">
          <div class="homeTopRight" v-if="!downTime" @click="goHotTime">
            <span>{{user.red.is_red}}</span>
            <div class="downTime">定时红包</div>
          </div>
          <!-- <div class="redInfo" v-if="redInfo">定时红包搬家啦 可直接领取</div> -->
        </div>
      </div>
      <!-- 签到 -->
      <div class="signIn columnFlex">
        <div class="signTop rowFlex spaceBetween columnCenter">
          <div class="signTopLeft">
            <div class="signInDay">
              <label>已连续签到</label>
              <span>{{user.sign_day}} </span>天
            </div>
            <div class="signDayInfo">
              <label v-if="user.is_sign=='0'">
                今日签到可得
                <span>{{user.sign_score}}</span> 青豆
              </label>
              <label v-if="user.is_sign!='0'">
                明日签到可得
                <span>{{user.sign_score}}</span> 青豆
              </label>
            </div>
          </div>
          <div class="signTopRight scale" v-if="user.is_sign=='0'" @click="signOut ">立即签到</div>
          <div class="signTopRight" v-if="user.is_sign!='0'" @click="showShareWx">赚更多青豆</div>
        </div>
        <div class="dayList rowFlex spaceBetween">
          <div
            :class="item.hasSign?'listItemActive':'listItem'"
            v-for="(item,index) in dayList"
            :key="index"
          >
            <div class="itemTop rowFlex allCenter">
              <div class="itemTopNum">{{item.newScore[0]}}</div>
            </div>
            <div class="itemDay">{{item.day}}天</div>
            <div class="itemNum" v-if="item.newScore[1]">{{item.newScore[1]}}</div>
          </div>
        </div>
      </div>
      <!-- 跳转 -->
      <div class="newTask">
        <div
          class="newTaskAdd rowFlex spaceBetween"
          @click="domePlay"
          v-if="is_bsg==0 && user.swz.title"
        >
          <div class="newTaskAddLeft rowFlex allCenter">
            <img :src="user.swz.logo" alt="">
            <p>{{user.swz.title[0]}}</p>
            <label v-if="user.swz.title[1]">·</label>
            <span v-if="user.swz.title[1]">{{user.swz.title[1]}}</span>
          </div>
          <div
            class="newTaskAddRight rowFlex allCenter"
            :class="this.user.swz.is_swz=='0'?'NewShank':''"
          >
            <img src="https://res.youth.cn/201903_11_11h_5c861fd54a72e.png" alt="">
          </div>
        </div>
        <div class="navList rowFlex spaceAround">
          <div
            class="navListItem columnFlex allCenter"
            @click="goLuck(item)"
            v-for="(item,index) in user.heard"
            :key="index"
          >
            <div class="itemIcon">
              <img class="" :src="item.logo" alt="">
            </div>
            <p class="iconText">{{item.title}}</p>
            <div class="icon" v-if="item.minlogo">
              <img class="img" :src="item.minlogo" alt="">
            </div>
          </div>
        </div>
      </div>
      <!-- 新手任务  -->
      <div class="dayActive" v-if="newTaskShow">
        <div class="dayActiveTitle rowFlex spaceBetween columnCenter">
          <div class="titleLeft rowFlex allCenter">
            <img class="leftImg" src="https://res.youth.cn/newActive/taskCenter/hotBg.png">
            <span>稳拿{{newTask.new_total}}元现金</span>
          </div>
          <div class="titleRight">
            距离结束还有
            <span>{{newTask.remainDay}}</span> 天
          </div>
        </div>
        <div class="activeList allCenter">
          <div
            class="activeItem rowFlex spaceBetween columnCenter"
            v-for="(item,index) in newTask.data"
            :key="index"
            @click="goDetails(item)"
          >
            <div class="itemLeft">
              <div class="itemLeftImg">
                <img :src="item.logo" alt="">
              </div>
              <div class="leftInfo">
                <div class="titleText">{{item.title}}</div>
                <div class="textInfo">
                  <div :class="item.class?'leftImgHb':'leftImgDou'"></div>
                  <span class="score">{{item.score}}</span>
                </div>
              </div>
            </div>
            <div v-if="item.status==0" class="itemRight">{{item.but}}</div>
            <div v-if="item.status==1" class="itemRighted">已完成</div>
            <!-- 新增绑定手机号后可领取奖励状态 -->
            <div
              v-if="item.status==2 && item.action=='bindPhoneNumber'"
              @click.stop="receiveRewrad"
              class="itemRight"
            >可领取</div>
          </div>
        </div>
      </div>
      <!-- 日常任务 -->
      <div class="dayilyTasks" v-if="dayTaskListShow">
        <div class="taskTitle rowFlex columnCenter">
          <p></p>
          <span>日常任务</span>
        </div>
        <div class="taskList">
          <div
            class="taskItem columnFlex spaceBetween columnCenter"
            @click="itemClick($event,item)"
            v-for=" (item,index) in dayTaskList"
            :key="index"
          >
            <div class="taskItemTwo rowFlex spaceBetween columnCenter">
              <div class="taskItemLeft rowFlex columnCenter">
                <p class="taskItemLeftTitle">{{item.title }}</p>
                <div :class="item.class?'leftImgHb':'leftImgDou'"></div>
                <span class="numText">{{item.score}}</span>
              </div>
              <div class="taskItemRight rowFlex columnCenter spaceBetween">
                <img
                  v-if="item.title!='周日享双倍'"
                  class="down"
                  src="https://res.youth.cn/newActive/taskCenter/down.png"
                >
                <img
                  class="down"
                  v-if="item.title=='周日享双倍'"
                  src="https://res.youth.cn/newActive/taskCenter/up.png"
                >
                <div class="goBtn" @click.stop="goDetails(item)">{{item.but}}</div>
              </div>
            </div>
            <div class="taskItemInfo" v-if="item.title!='周日享双倍'">
              <div v-html="item.desc"></div>
            </div>
            <div class="taskItemInfo" style="display:block;" v-if="item.title=='周日享双倍'">
              <div class="dayli" v-if="item.data">
                <div
                  :class="items=='已分享' || items=='已获得'?'itemActive':'item'"
                  v-for="(items,zindex) in dayilShare"
                  :key="zindex"
                >
                  <span v-if="zindex!=6">{{items}}</span>
                  <span v-if="zindex==6 && dayilShareGif">
                    <img src="https://res.youth.cn/newActive/taskCenter/newUser.png" alt="">
                  </span>
                  <span v-if="zindex==6 && !dayilShareGif">已获得</span>
                  <!-- <span v-if="zindex==6 && !dayilShareGif"><img src="https://res.youth.cn/newActive/taskCenter/newUserActive.png" alt=""></span> 老版图标 -->
                </div>
              </div>
              <div v-html="item.desc"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="dayilyTasks" v-if="redTaskShow">
        <div class="taskTitle rowFlex columnCenter">
          <p></p>
          <span>进阶任务</span>
        </div>
        <div class="taskList">
          <div
            class="taskItem columnFlex spaceBetween columnCenter"
            @click="itemClick($event,item)"
            v-for=" (item,index) in redTask"
            :key="index"
          >
            <div class="taskItemTwo rowFlex spaceBetween columnCenter">
              <div class="taskItemLeft rowFlex columnCenter">
                <p class="taskItemLeftTitle">{{item.title}}</p>
                <div :class="item.class?'leftImgHb':'leftImgDou'"></div>
                <span class="numText">{{item.score}}</span>
              </div>
              <div class="taskItemRight rowFlex columnCenter spaceBetween">
                <img class="down" src="https://res.youth.cn/newActive/taskCenter/down.png">
                <div class="goBtn" @click.stop="goDetails(item)">{{item.but}}</div>
              </div>
            </div>
            <div class="taskItemInfo">{{item.desc}}</div>
          </div>
        </div>
      </div>
      <!-- 返回弹窗1 1元未提现弹窗 -->
      <div class="layer" v-if="goBack" @click="closeLayer">
        <div class="cash" @click.stop>
          <p>您还有1元现金未提现哟
            <br>确定要离开吗？
          </p>
          <div class="yybtn">
            <span id="not_withdraw" @click="goBackPage">放弃提现</span>
            <span id="to_withdraw" @click="goCash">立即去提现</span>
          </div>
        </div>
      </div>
      <!-- 新手任务未完成弹窗 -->
      <div class="tanchuang-bg" v-if="newGetMoney" @click="closeLayer">
        <div class="fh_xinshou" @click.stop>
          <p>您今日还有现金任务待领取</p>
          <div class="xsmoney">
            <div class="moy">
              &yen;
              <span>{{newTask.new_total}}</span>元
            </div>
            <h5>- 新人专享福利 -</h5>
          </div>
          <div class="xslingqu" @click="closeLayer">立即去领取</div>
          <h6 @click="goBackPage">直接退出</h6>
        </div>
      </div>
      <!-- 新手分享任务 弹窗 -->
      <div class="tanchuang-bg" v-if="newShare" @click="closeLayer">
        <div class="tc-share-quests" @click.stop>
          <img
            class="off-tc"
            src="https://res.youth.cn/20181011-rwzx/img/tc-off.png"
            @click="closeLayer"
            alt=""
          >
          <p>新手分享任务</p>
          <p>每天分享文章到朋友圈即可获得相应奖励</p>
          <ul class="week-reward">
            <div class="weekRewardItem" v-for="(item,index) in newShareList" :key="index">
              <!-- 以前 -->
              <li class="normal-day guoqi-day" v-if="item.taskLast">
                <!-- 未领取 -->
                <div class="readTaskLast" v-if="!item.lastSign">
                  <img
                    class="guoqi-icon"
                    src="https://res.youth.cn/20181011-rwzx/img/guoqi-icon.png"
                    alt=""
                  >
                  <p>￥{{item.score}}</p>
                  <p class="bottomText">已过期</p>
                </div>
                <!-- 已领取 -->
                <div class="readTaskNow" v-if="item.lastSign">
                  <img
                    class="guoqi-icon"
                    src="https://res.youth.cn/20181011-rwzx/img/huode-icon.png"
                    alt=""
                  >
                  <p>￥{{item.score}}</p>
                  <p class="bottomText">已获得</p>
                </div>
              </li>
              <!-- 现在 -->
              <li class="normal-day guoqi-day" v-if="item.taskNow">
                <!-- 未领取 -->
                <div class="readTaskFurter" v-if="!item.nowSign">
                  <p>￥{{item.score}}</p>
                  <p class="bottomText">可领取</p>
                </div>
                <!-- 未领取 -->
                <div class="readTaskNow" v-if="item.nowSign">
                  <img
                    class="guoqi-icon"
                    src="https://res.youth.cn/20181011-rwzx/img/huode-icon.png"
                    alt=""
                  >
                  <p>￥{{item.score}}</p>
                  <p class="bottomText">已获得</p>
                </div>
              </li>
              <!-- 未来未领取 -->
              <li class="normal-day guoqi-day" v-if="item.taskFuture ">
                <div class="readTaskFurter">
                  <p>￥{{item.score}}</p>
                  <p class="bottomText">第{{index+1}}天</p>
                </div>
              </li>
            </div>
          </ul>
          <p class="tips-text">分享后每次被好友有效阅读你都会获得500青豆</p>
          <ul class="article-list">
            <!--  data-item="3"
            data-id="13579031"-->
            <li
              class="shareBtn"
              @click="shareWxf(item)"
              v-for="(item,index) in artList"
              :key="index"
            >
              <img :src="item.thumb" alt="">
              <div>
                <p>{{item.title}}</p>
                <p>点击分享 &gt;&gt;</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 去阅读 -->
      <div class="goRead tanchuang-bg" v-if="goReadLayer" @click="closeLayer">
        <div class="tc-share-quests" @click.stop>
          <img
            class="off-tc"
            src="https://res.youth.cn/20181011-rwzx/img/tc-off.png"
            @click="closeLayer"
            alt=""
          >
          <p>新手阅读奖励</p>
          <p>每日认真阅读文章即可获得相应奖励</p>
          <ul class="week-reward">
            <div class="weekRewardItem" v-for="(item,index) in newReadList" :key="index">
              <!-- 以前 -->
              <li class="normal-day guoqi-day" v-if="item.taskLast">
                <!-- 未领取 -->
                <div class="readTaskLast" v-if="!item.lastSign">
                  <img
                    class="guoqi-icon"
                    src="https://res.youth.cn/20181011-rwzx/img/guoqi-icon.png"
                    alt=""
                  >
                  <p>￥{{item.score}}</p>
                  <p class="bottomText">已过期</p>
                </div>
                <!-- 已领取 -->
                <div class="readTaskNow" v-if="item.lastSign">
                  <img
                    class="guoqi-icon"
                    src="https://res.youth.cn/20181011-rwzx/img/huode-icon.png"
                    alt=""
                  >
                  <p>￥{{item.score}}</p>
                  <p class="bottomText">已获得</p>
                </div>
              </li>
              <!-- 现在 -->
              <li class="normal-day guoqi-day" v-if="item.taskNow">
                <!-- 未领取 -->
                <div class="readTaskFurter" v-if="!item.nowSign">
                  <p>￥{{item.score}}</p>
                  <p class="bottomText">可领取</p>
                </div>
                <!-- 未领取 -->
                <div class="readTaskNow" v-if="item.nowSign">
                  <img
                    class="guoqi-icon"
                    src="https://res.youth.cn/20181011-rwzx/img/huode-icon.png"
                    alt=""
                  >
                  <p>￥{{item.score}}</p>
                  <p class="bottomText">已获得</p>
                </div>
              </li>
              <!-- 未来未领取 -->
              <li class="normal-day guoqi-day" v-if="item.taskFuture ">
                <div class="readTaskFurter">
                  <p>￥{{item.score}}</p>
                  <p class="bottomText">第{{index+1}}天</p>
                </div>
              </li>
            </div>
          </ul>
          <div class="share-steps">
            <img src="https://res.youth.cn/20181015/img/share-steps.jpg" style="width:100%;" alt="">
            <p class="go-read-now" @click="goRead">去阅读</p>
          </div>
        </div>
      </div>
      <!-- 示例 -->
      <div class="example-bg" v-if="shiliShow" @click="closeLayer">
        <div class="example" @click.stop>
          <p>示例</p>
          <img src="https://res.youth.cn/201806_20_20w_5b2a3277f08f4.jpg" alt="">
          <p>当您的手机收到类似这样的文章推送时，点开浏览即可赚到青豆</p>
          <p class="understand" @click="closeLayer">明白了</p>
        </div>
      </div>
    </div>
    <!-- 未登录状态 -->
    <div class="weidenglu" v-if="loginOut">
      <p class="xianjin-hb">你有一个现金红包未领取</p>
      <div class="weidenglu-hb">
        <p>最高可领取100现金</p>
        <p>满1元即可提现</p>
        <img
          class="denglulingqu"
          src="https://res.youth.cn/20180916-rwzx-lww/img/denglulingqu.png"
          alt="登录领取"
          @click="login"
        >
        <!--swiper轮播-->
        <div class="weidenglu-container swiper-container">
          <ul class="weidenglu-wrapper swiper-wrapper">
            <li
              class="weidenglu-slide swiper-slide swiper-no-swiping"
              v-for="(item,index) in swiperData"
              :key="index"
            >
              <img :src="item.avatar" alt="">
              <p>{{item.nickname}}</p>
              <p>
                刚兑换
                <span>{{item.score}}</span> 元
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 签到弹窗  -->
    <div class="layer" v-if="layerSign" @click="closeLayer">
      <div class="sign" @click.stop>
        <img
          class="close"
          @click.stop="closeLayer"
          src="https://res.youth.cn/newActive/taskCenter/close.png"
        >
        <div class="signImg rowFlex allCenter">
          <img src="https://res.youth.cn/newActive/taskCenter/layerDou.png" alt="">
          <div class="imgText">
            <p class="text">签到成功</p>
            <p class="num">
              +{{signData.user.score}}
              <span>青豆</span>
            </p>
          </div>
        </div>
        <div class="layerSubTitle">
          明日继续签到可得
          <span>{{signData.user.nextScore}}</span> 青豆
        </div>
        <!--  -->
        <div v-for="(item,index) in signData.imgList" :key="index" v-if="index==signData.user.type">
          <div class="vipImg">
            <img :src="item.img" alt="" @click="signOutBtn(item.type)">
          </div>
          <div class="goShare" @click="signOutBtn(item.type)">{{item.text}}</div>
        </div>
      </div>
    </div>
    <!-- 签到后的分享弹窗 -->
    <div class="layer" v-if="shareLayer" @click="closeLayer">
      <div class="layerMain" @click.stop>
        <img
          class="close"
          @click="closeLayer"
          src="https://res.youth.cn/20181011-rwzx/img/tc-off2.png"
          alt=""
        >
        <p class="title">分享赚青豆</p>
        <p class="info">新用户下载获得6~15元</p>
        <div class="line">
          <span class="radio"></span>
          <p>
            您的好友通过您分享的链接首次下载并登录，您将获得
            <span>6~15元</span>
          </p>
        </div>
        <div class="line">
          <span class="radio"></span>
          <p>
            您的好友通过您分享的链接启动APP并签到，您将获得
            <span>随机红包</span>
          </p>
        </div>
        <div class="shareBtn" @click.stop="shareImgWx()">
          <img src="https://res.youth.cn/20181011-rwzx/img/wechat-icon.png" alt="">
          <p>分享到微信群</p>
        </div>
      </div>
    </div>
    <!-- 新人红包 这里做版本区分 is_version_143==0 小于 1.4.3 显示该弹窗 -->
    <div class="tanchuang-bg" @click="newUserLayer" v-if="oldisNewUser && user.is_version_143=='0'">
      <div class="tc-newUser-hb" @click.stop>
        <img class="user-img" :src="newUserInfo.avatar" alt="">
        <p>恭喜您获得新人红包</p>
        <p>
          {{newUserInfo.score}}
          <span>元</span>
        </p>
        <p>分享后并成功返回现金翻倍</p>
        <p class="get-money-btn-ani" @click="shareImgWx">分享到微信群翻倍</p>
        <img
          class="off-tc"
          @click="newUserLayer"
          src="https://res.youth.cn/201809_14_14l_5b9b876c73651.png"
          alt=""
        >
      </div>
    </div>
    <!-- 分享完成的收入弹窗 -->
    <div class="canvasSuccess" v-if="showSuccessLayer">
      <div class="imgBg">
        <img src="https://res.youth.cn/20181019/img/icon_gold.png" alt="">
      </div>
      <div class="canvasSuccessInfo" v-if="todaySign.score">{{todaySign.score}}元</div>
      <div class="canvasSuccessText">分享成功</div>
    </div>
    <!-- 小程序弹窗 -->
    <div class="tanchuang-bg" v-if="miniApp" @click="closeMiniLayer">
      <div class="miniAppLayer" @click.stop>
        <div class="miniApptitle">收益提醒</div>
        <div class="layerText">
          招财幸运树
          <span>零钱已到账</span>
        </div>
        <div class="layerText">完成任务还可赚取更多零钱</div>
        <div class="miniAppBtn" @click="closeMiniLayer">赚更多零钱</div>
      </div>
    </div>
    <!-- 新增任务链接 任务列表 -->
    <div class="tanchuang-bg" v-if="signTaskList">
      <div class="signTaskList">
        <div class="signTaskTop columnFlex allCenter">
          <div class="signSuccess rowFlex allCenter">
            <div class="signImg">
              <img src="https://res.youth.cn/newActive/taskCenter/layerDou.png" alt="">
            </div>
            <div class="signText">
              <p class="successText">签到成功</p>
              <p class="successInfo">
                <span>+100</span>青豆
              </p>
            </div>
          </div>
          <div class="textInfo">明日继续签到可得328青豆</div>
        </div>
        <div class="mainList">
          <div class="mainListTitle">- 大家都在赚 -</div>
          <div class="TaskList">
            <div
              v-if="index<3"
              class="taskItem rowFlex columnCenter"
              v-for="(item,index) in signTaskData"
              :key="index"
            >
              <p class="title">{{item.title}}</p>
              <div class="rowFlex" v-if="item.class=='red_hb'">
                <div class="leftImgHb"></div>
                <div class="num">2323232</div>
              </div>
              <div class="rowFlex" v-if="item.class==''">
                <div class="leftImgDou"></div>
                <div class="numMoney">+0.1元</div>
              </div>
              <div class="btn">去看看</div>
            </div>
          </div>
          <div class="resize rowFlex allCenter">
            <div class="resizeImg">
              <img src="https://res.youth.cn/newActive/taskCenter/resize.png" alt="">
            </div>
            <div class="resizeText" @click="randomData">换一批</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新加新用户弹窗 第一天-->
    <div class="tanchuang-bg" @click="newUserLayer" v-if="isNewUser && user.is_version_143 =='1'">
      <div class="newMain columnFlex columnCenter" @click.stop>
        <div class="title">恭喜获得新人红包</div>
        <div class="divnewGift">
          <div class="left columnFlex allCenter">
            <p class="text">现金红包</p>
            <p class="info">可以直接提现</p>
          </div>
          <div class="right rowFlex allCenter">
            <div class="num">
              <span>{{newUserInfo.score}}</span>元
            </div>
          </div>
        </div>
        <div class="divnewGift divnewGiftTwo">
          <div class="left columnFlex allCenter">
            <p class="text">新人红包</p>
            <p class="info">限时领取</p>
          </div>
          <div class="right rowFlex allCenter">
            <div class="num">
              <span>18</span>元
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="bottomBtn" @click="goCash">立即去提现</div>
        </div>
        <div class="closeLayer" @click="newUserLayer">先去逛逛</div>
      </div>
    </div>
    <!-- 新加新用户弹窗 第二天 第3天-->
    <div
      class="tanchuang-bg"
      v-if="isNewUserTwo && user.is_version_143 =='1'"
      @click="newUserLayer"
    >
      <div class="newMain newMainTwo columnFlex columnCenter" @click.stop>
        <div class="textTitle">恭喜获得新人红包</div>
        <div class="moneyNum">
          {{newUserInfo.score}}
          <span>元</span>
        </div>
        <div
          class="mingInfo rowFlex allCenter"
          v-if="newUserInfo.day!='3'"
        >明天还可继续领{{newUserInfo.score}}元呦~</div>
        <div class="mingInfo rowFlex allCenter" v-if="newUserInfo.day=='3'">直接提现,秒到账!</div>
        <div class="bottom">
          <div class="bottomBtn" @click="goCash">立即去提现</div>
        </div>
        <div class="closeLayer" @click="newUserLayer">先去逛逛</div>
      </div>
    </div>
    <!-- 绑定手机号成功后的弹窗 -->
    <div class="canvasSuccess" v-if="bindPhoneLayer">
      <div class="imgBg">
        <img src="https://res.youth.cn/20181019/img/icon_gold.png" alt="">
      </div>
      <div class="canvasSuccessText" style="margin-top:0.2rem;">绑定成功</div>
      <div class="canvasSuccessText">+{{bindPhoneReward.money}}元</div>
    </div>
  </div>
</template>
<script>
//  还需要邀请的好友数
var num = 1;
import LDZS from "@utils/LDZS";
import urlHttp from "../../../build/url.js";
export default {
  data() {
    return {
      // 控制弹窗
      newGetMoney: false, // 领取新手红包弹窗
      newGetMoneyTwo: false,
      newGetMoneyThree: false,
      layerSign: false, //签到弹窗
      goBack: false, // 返回弹窗
      miniApp: false, //小程序新手弹窗
      goBackTwo: false,
      shareLayer: false, // 签到后再次点击签到 的邀请弹窗
      newShare: false, // 去阅读文章的新手分享任务的弹窗
      goReadLayer: false, // 新手阅读奖励的弹窗
      shiliShow: false, // 示例的弹窗
      loginOut: false, // 未登录状态弹窗
      onload: false, //接口请求成功
      miniPro: false, // 种树小程序的弹窗
      newTaskShow: true,
      dayTaskListShow: true,
      redTaskShow: true,
      signTaskList: false,
      signTaskData: [], //新增签到任务弹窗数据
      zfbUrl:
        "https://render.alipay.com/p/f/jfxb4alj/pages/receive-redpacket/index.html",
      newTask: [],
      dayTaskList: [],
      artList: [],
      redTask: {},
      urlParam: LDZS.getUrlPrmt(),
      downTimeNum: "",
      isNewUser: false,
      isNewUserTwo: false,
      newUserInfo: {}, // 如果是新用户的头像
      user: {
        user: {},
        red: {
          is_red: ""
        },
        swz: {
          title: ["试玩赚", "日赚2元"],
          logo: "https://res.youth.cn/newActive/taskCenter/game%20%281%29.png",
          url: "https://www.baidu.com"
        }
      },
      dayilShare: [
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六",
        "https://res.youth.cn/newActive/taskCenter/newUser.png"
      ],
      dayilShareGif: false,
      downTime: false,
      dayList: [], // 签到的列表
      newShareList: [], // 新手分享的签到列表
      newReadList: [], // 新手阅读的的列表
      is_bsg: "", //用户是否是北上广用户
      showSuccessLayer: false, //分享到朋友圈成功的给的奖励的弹窗
      isBigUser: "",
      open: true,
      signData: {
        imgList: [
          {
            img: "https://res.youth.cn/20190304/newImg/newInviteImg2.png",
            text: "立即邀请去赚钱",
            type: "0"
          },
          {
            img: "https://res.youth.cn/newActive/taskCenter/支付宝.png",
            text: "立即领取去提现",
            type: "1"
          },
          {
            img: "https://res.youth.cn/newActive/taskCenter/双倍卡.png",
            text: "去分享，得双倍",
            type: "2"
          },
          {
            img: "https://res.youth.cn/newActive/taskCenter/分享引导.png",
            text: "去分享，赚更多",
            type: "3"
          },
          {
            //img: "https://res.youth.cn/newActive/taskCenter/红包拉新.png",
            img: "http://c.juhuitui.cn/92345579",
            text: "立即去抢",
            type: "4"
          },
          {
            img: "https://res.youth.cn/newActive/taskCenter/红包裂变.png",
            text: "分享"
          }
        ],
        user: {
          score: "100",
          type: 0,
          nextScore: 0
        }
      },
      swiperData: [],
      todaySign: { show: false, score: 0 },
      oldisNewUser: false,
      bindPhoneLayer: false, // 绑定手机号成功的弹窗
      bindPhoneReward: {} // 绑定手机号后的弹窗
      //redInfo: true
    };
  },

  components: {},
  mounted() {
    this.$loading("加载中", "open");
    this.getTask();
    this.userInfo();
    this.articleList();
    this.initBridge();
  },
  methods: {
    //赚更多青豆
    showShareWx: function() {
      this.shareLayer = true;
    },
    returnHost(str) {
      if (str.indexOf("https") != "-1" || str.indexOf("http") != "-1") {
        // 有协议名
        return str;
      } else {
        var protocol = location.protocol;
        var host = window.location.host;
        return protocol + "//" + host + str;
      }
    },
    newUserLayer: function() {
      this.isNewUser = false;
      this.isNewUserTwo = false;
      this.oldisNewUser = false;
      this.userInfo();
    },
    randomData(data) {
      let dataList = [];
      let newDataList = [];

      // 获取并且处理数据

      //取数据
      for (let i = 0; i < this.dayTaskList.length; i++) {
        let a = Math.floor(Math.random(0, 1) * this.dayTaskList.length);
        dataList.push(this.dayTaskList[a]);
      }

      // 去重
      for (let k = 0; k < dataList.length; k++) {
        if (newDataList.indexOf(dataList[k]) == -1) {
          newDataList.push(dataList[k]);
        }
      }

      this.signTaskData = newDataList.slice(0, 3);
    },
    closeLayer: function() {
      this.layerSign = false;
      this.goBack = false;
      this.goBackTwo = false;
      this.shareLayer = false;
      this.newShare = false;
      this.goReadLayer = false;
      this.shiliShow = false;
      this.newGetMoney = false;
      this.loginOut = false;
      this.miniPro = false;
      this.isNewUser = false;
      this.newGetMoneyThree = false;
      this.isNewUserTwo = false;
      this.oldisNewUser = false;
    },
    closeMiniLayer: function() {
      this.miniApp = false;
      this.userInfo();
    },
    //
    taskrefresh: function() {
      this.userInfo();
    },
    initBridge: function() {
      // 初始化
      console.log("初始化webview");
      var that = this;
      var needCallBack = { name: "taskrefresh" };
      window.WebViewJavascriptBridge.callHandler(
        "needCallBack",
        needCallBack,
        function(response) {}
      );
      function connectWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
          callback(WebViewJavascriptBridge);
        } else {
          document.addEventListener(
            "WebViewJavascriptBridgeReady",
            function() {
              callback(WebViewJavascriptBridge);
            },
            false
          );
        }
      }
      connectWebViewJavascriptBridge(function(bridge) {
        // 自运行的一个方法 而不是函数调用
        bridge.init(function(message, responseCallback) {
          var data = {
            "Javascript Responds": "Wee!"
          };
          console.log("JS responding with", data);
          responseCallback(data);
        });

        /*  
          监听原生的方法 function 为 用户动作触发时 执行的本地代码 
          执行本地刷新的方法
        */

        bridge.registerHandler("taskrefresh", function(data, responseCallback) {
          // 返回弹窗状态
          if (that.todaySign.show) {
            console.log("弹窗");
            that.showSuccessLayer = true;
            setTimeout(() => {
              that.showSuccessLayer = false;
              that.todaySign.show = false;
              that.userInfo();
              that.getTask(); // 更新状态
            }, 2000);
          }

          that.userInfo(); // 监听浏览器返回，然后调用本地方法
          that.getTask();
        });
        bridge.registerHandler("rewardVideoAdCallback", function(
          data,
          responseCallback
        ) {});
        //注册回调方法
        bridge.registerHandler("web_start_double_bean_callback", function(
          // 开钱翻倍任务
          data,
          responseCallback
        ) {
          console.log("开启翻倍成功");
          that.$toast.center("开启翻倍成功");
        });

        bridge.registerHandler("web_start_sign_callback", function(
          // 开启签到任务
          data,
          responseCallback
        ) {
          console.log("签到开启成功");
          that.$toast.center("签到开启成功");
        });

        bridge.registerHandler("testJavascriptHandler", function(
          data,
          responseCallback
        ) {
          var responseData = {
            "Javascript Says": "Right back atcha!"
          };
          console.log("JS responding with", responseData);
          responseCallback(responseData);
        });
      });
    },

    domePlay: function() {
      // 试玩赚

      if (this.open) {
        console.log(this.user.swz.url);
        this.open = false;
        LDZS.openUrl("openSourceUrl", {
          url: this.user.swz.url,
          type: 0
        });
      }
      setTimeout(() => {
        this.open = true;
      }, 1000);
    },
    articleList: function() {
      urlHttp.post("/article/getShareArticle", this.urlParam).then(res => {
        console.log(res);
        if (res.data.status == "1") {
          this.artList = res.data.data;
        } else {
          this.$toast.center("获取分享文章失败");
        }
      });
    },
    downTimeFn: function(time) {
      var index = this.user.red.nextRed;
      var timer;
      if (index <= 0) {
        return false;
      }
      clearInterval(timer);
      timer = setInterval(() => {
        index--;
        this.downTimeNum = LDZS.downTime(index);
      }, 1000);
    },
    //获取轮播数据
    getSwiperData: function() {
      urlHttp.post("/TaskCenter/getOrder").then(res => {
        if (res.data.status == "1") {
          this.swiperData = res.data.list;
          setTimeout(() => {
            this.swiper();
          });
        } else {
          this.$toast.center("获取轮播数据失败");
        }
      });
    },
    userInfo: function() {
      let that = this;
      // 获取用户信息
      urlHttp
        .post("/TaskCenter/getSign", {
          cookie: this.urlParam.cookie,
          cookie_id: this.urlParam.cookie,
          app_version: this.urlParam.app_version,
          channel: this.urlParam.channel,
          device_type: this.urlParam.device_type
        })
        .then(res => {
          this.onload = true;

          if (res.data.status == "1") {
            this.user = res.data.data;

            this.is_bsg = res.data.data.is_bsg;
            if (this.user.red.is_red == "0") {
              this.downTime = true;
              //this.redInfo = false;
            } else {
              this.downTime = false;
              //this.redInfo = true;
            }
            //5s后 红包的注释弹窗消失
            // setTimeout(() => {
            //   this.redInfo = false;
            // }, 6000);

            this.downTimeFn(this.user.red.nextRed);

            if (res.data.data.sign) {
              this.dayList = res.data.data.sign;
              this.dayList.map((item, index) => {
                item.newScore = [];
                item.newScore[0] = "+" + item.score[0];
                if (item.score[1] == "0") {
                  item.newScore[1] = "";
                } else {
                  item.newScore[1] = "+" + item.score[1];
                }
              });
            }

            let zindex = 0;
            this.user.sign.map(function(item, index) {
              if (item.status == "1") {
                zindex++;
              }
              if (index < zindex) {
                item.hasSign = true;
              } else {
                item.hasSign = false;
              }
            });
            this.listenBack();
          } else if (res.data.status == "2") {
            // 未登录
            this.loginOut = true;
            this.getSwiperData();
          } else {
            this.$toast.center("数据错误");
          }
        });
    },
    getTask: function() {
      // 获取任务列表
      urlHttp.get("/TaskCenter/getTaskList", this.urlParam).then(res => {
        this.$loading("加载中", "close");

        if (res.data.status == "1" && JSON.stringify(res.data.list) != "[]") {
          res.data.list.new.newtask
            ? (this.newUserInfo = res.data.list.new.newtask)
            : ((this.isNewUser = false), (this.oldisNewUser = false));
          res.data.list.daily && JSON.stringify(res.data.list.daily) != "[]"
            ? (this.dayTaskList = res.data.list.daily)
            : (this.dayTaskListShow = false);
          res.data.list.recommend &&
          JSON.stringify(res.data.list.recommend) != "[]"
            ? (this.redTask = res.data.list.recommend)
            : (this.redTaskShow = false);
          res.data.list.new.data &&
          JSON.stringify(res.data.list.new.data) != "[]"
            ? (this.newTask = res.data.list.new)
            : (this.newTaskShow = false);

          if (this.newUserInfo.new_status != "0" && res.data.list.new.newtask) {
            //普通新用户
            if (this.newUserInfo.type == "0") {
              // 这里需要区分新老版本  is_version_143==0 是老版本  is_version_143==1 是新版本 day 老版本是0 新版本是 第一天是1 第二天是2 第三天是3 以后都是0；

              if (this.user.is_version_143 == "0") {
                //老版本
                this.oldisNewUser = true;
                return false;
              }

              // 新用户第一天打开
              if (this.newUserInfo.day == "1") {
                this.isNewUser = true;
                // 新用户第二天或者第三天打开
              } else if (
                this.newUserInfo.day == "2" ||
                this.newUserInfo.day == "3"
              ) {
                this.isNewUserTwo = true;
              } else {
                // 不显示弹窗
                console.log("新手红包已领完");
              }
            } else {
              //小程序用户
              this.miniApp = true;
              this.isNewUser = false;
              this.oldisNewUser = false;
            }
          } else {
            this.isNewUser = false;
            this.oldisNewUser = false;
          }

          this.dayTaskList.map((item, index) => {
            if (item.title == "周日享双倍") {
              if (item.data && item.data.list) {
                let that = this;
                let zindex = 0;
                item.data.list.map((item, index) => {
                  if (item.status == "1") {
                    Vue.set(that.dayilShare, index, "已分享");
                    zindex++;
                  }
                });
                if (zindex >= "5") {
                  //显示已获得
                  Vue.set(that.dayilShare, 6, "已获得");
                } else {
                  //显示图片
                  this.dayilShareGif = true;
                }
              }
            }
          });

          //获取支付宝红包的路径
          if (this.redTask) {
            let that = this;
            this.redTask.map((item, index) => {
              if (item.title == "支付宝现金") {
                that.zfbUrl = item.url;
              }
            });
          }
        } else if (res.data.status == "2") {
          // 未登录
          this.loginOut = true;
        } else {
          this.$toast.center("数据错误");
        }
      });
    },

    goCash: function() {
      // 去提现 需要判断是否是大用户
      LDZS.goCash(this.user.user.is_open_large);
      this.closeLayer();
    },
    goDetails: function(item) {
      let that = this;
      this.showLoading();
      if (item.jump_type == "0") {
        // JumpTask
        // jumpTask 跳转 从一个任务跳另一个 type  没有url 和 type  是任务跳转  type: 0 是任务跳转 用JumpTask  1,2,3 是浏览器跳转   openSourceUrl 4 是定制 需根据需求进行控制
        console.log("type=0", item.action);
        window.WebViewJavascriptBridge.callHandler(
          "JumpTask",
          { action_name: item.action },
          function() {}
        );
      } else if (item.jump_type == "1") {
        // 带交互 的浏览器跳转 向原生传参时 type=0
        console.log("type=1", item.action);

        // 带交互的原生跳转 原生 type 为 0
        LDZS.openUrl("openSourceUrl", {
          url: that.returnHost(item.url),
          type: 0
        });
      } else if (item.jump_type == "2") {
        // 不带交互的浏览器跳转向原生传参时 type=1
        console.log("type=2", item.action);
        // 不带交互的浏览器跳转
        LDZS.openUrl("openSourceUrl", {
          url: that.returnHost(item.url),
          type: 1
        });
      } else if (item.jump_type == "3") {
        // 打开系统浏览器跳转向原生传参时 type=2
        console.log("type=3", item.action);
        // 系统浏览器跳转
        LDZS.openUrl("openSourceUrl", {
          url: that.returnHost(item.url),
          type: 2
        });
      } else if (item.jump_type == "4") {
        //定制功能 根据不同需求进行定制
        console.log("type=4", item.action);

        if (item.action == "push_read_article") {
          // 开启推送功能
          // 阅读推送文章
          window.WebViewJavascriptBridge.callHandler(
            "isNotificationEnabled",
            { method: "notificationCallback" },
            function() {}
          );
          this.shiliShow = true;
        } else if (item.action == "beread") {
          // 新手分享任务 分享文章到朋友圈
          this.newShare = true;
          console.log(item);
          this.newShareList = item.list;
          console.log(this.newShareList);
          this.newShareList.map(function(item, index) {
            // 如果当天没有签到 签到后就显示签到弹窗

            if (item.today_day == 1 && item.status == 0) {
              that.todaySign.show = true;
              that.todaySign.score = item.score;
            }
            console.log(that.todaySign.show);
            // 过去的状态 1 未签到  已签到
            // 现在的状态 未签到  已签到
            // 未来的状态  未签到

            item.today_day == "0" && item.future_day == "0"
              ? (item.taskLast = true)
              : (item.taskLast = false); // 标识过去
            item.today_day == "0" &&
            item.future_day == "0" &&
            item.status == "0"
              ? (item.lastSign = false)
              : ""; //过去未签到
            item.today_day == "0" &&
            item.future_day == "0" &&
            item.status != "0"
              ? (item.lastSign = true)
              : ""; //过去已签到
            item.today_day == "1" ? (item.taskNow = true) : ""; // 标识现在
            item.today_day == "1" &&
            item.future_day == "0" &&
            item.status == "0"
              ? (item.nowSign = false)
              : ""; //今天未签到
            item.today_day == "1" &&
            item.future_day == "0" &&
            item.status != "0"
              ? (item.nowSign = true)
              : ""; //今天已签到
            item.future_day != "0" ? (item.taskFuture = true) : ""; // 标识未来
            item.today_day == "0" && item.future_day != "0"
              ? (item.futureSign = true)
              : ""; //未来
          });
        } else if (item.action == "read_article") {
          // 去阅读文章
          this.goReadLayer = true;
          this.newReadList = item.list;

          this.newReadList.map(function(item, index) {
            // 过去的状态 1 未签到  已签到
            // 现在的状态 未签到  已签到
            // 未来的状态  未签到

            item.today_day == "0" && item.future_day == "0"
              ? (item.taskLast = true)
              : (item.taskLast = false); // 标识过去
            item.today_day == "0" &&
            item.future_day == "0" &&
            item.status == "0"
              ? (item.lastSign = false)
              : ""; //过去未签到
            item.today_day == "0" &&
            item.future_day == "0" &&
            item.status != "0"
              ? (item.lastSign = true)
              : ""; //过去已签到
            item.today_day == "1" ? (item.taskNow = true) : ""; // 标识现在
            item.today_day == "1" &&
            item.future_day == "0" &&
            item.status == "0"
              ? (item.nowSign = false)
              : ""; //今天未签到
            item.today_day == "1" &&
            item.future_day == "0" &&
            item.status != "0"
              ? (item.nowSign = true)
              : ""; //今天已签到
            item.future_day != "0" ? (item.taskFuture = true) : ""; // 标识未来
            item.today_day == "0" && item.future_day != "0"
              ? (item.futureSign = true)
              : ""; //未来
          });
        } else if (item.action == "web_start_double_bean") {
          window.WebViewJavascriptBridge.callHandler(
            item.action,
            "",
            function() {}
          );
        } else if (item.action == "web_start_sign") {
          window.WebViewJavascriptBridge.callHandler(
            item.action,
            "",
            function() {}
          );
        } else if (item.action == "everyday_red") {
          LDZS.openUrl("openSourceUrl", {
            url: that.returnHost(item.url),
            type: 1,
            task_id: "everyday_red",
            record_time: 60,
            task_type: 2,
            need_slide: 0
          });
          // 新增对ASO的项目的支持
        } else if (item.action == "ios_share") {
          var obj = {
            url: "http://aso.baertt.com/dist/list",
            thumb: "https://res.youth.cn/201903_20_20g_5c920a78a2cbd.png",
            thumbs: ["https://res.youth.cn/201903_20_20g_5c920a78a2cbd.png"],
            title: "钱多多赚钱",
            share_desc: "加入钱多多，轻轻松松月入上万！全网最火赚钱产品!",
            from: 100,
            share_way: 1
          };
          window.WebViewJavascriptBridge.callHandler("shareWxf", obj, function(
            response
          ) {});
        } else {
        }
        this.$loading("跳转中", "close");
      } else if (item.jump_type == "5") {
        let device_type = LDZS.browserInfo("iphone");
        this.$loading("跳转中", "close");
        //jump_type 为5 直接调用原生的方法

        
        if(device_type){ // 是ios
          window.WebViewJavascriptBridge.callHandler("JumpTask",
            { action_name: "bind_phone_number"}, function(
              response
            ) {});
        }else{ // 不是ios
          window.WebViewJavascriptBridge.callHandler(item.action, {}, function(
            response
          ) {});
        }

      } else {
      }
    },
    //新手分享
    shareWxf: function(item) {
      var device_type = LDZS.browserInfo("android");
      if (device_type) {
        var d = {
          url: item.url,
          thumb: item.thumb,
          thumbs: [item.thumb],
          title: item.title,
          from: 100,
          share_desc: item.title,
          share_way: 0
        };
      } else {
        var d = {
          url: item.url,
          thumb: item.thumb,
          thumbs: [item.thumb],
          title: item.title,
          from: 100,
          share_desc: item.title,
          share_way: 1
        };
      }

      window.WebViewJavascriptBridge.callHandler("shareWxf", d, function(
        response
      ) {});

      this.newShare = false;

      this.shareCallback(item.id);
    },
    goRead: function() {
      this.showLoading();
      this.closeLayer();
      window.WebViewJavascriptBridge.callHandler(
        "JumpTask",
        { action_name: "read_article" },
        function() {}
      );
    },
    shareCallback: function(id) {
      let channel, client_version;
      this.urlParam.channel
        ? (channel = this.urlParam.channel)
        : (channel = this.urlParam.channel_code);
      this.urlParam.app_version
        ? (client_version = this.urlParam.app_version)
        : (client_version = this.urlParam.client_version);
      let obj = {
        cookie: this.urlParam.cookie,
        cookie_id: this.urlParam.cookie_id,
        app_version: this.urlParam.app_version,
        channel: channel,
        channel_code: channel,
        device_type: this.urlParam.device_type,
        article_id: id,
        client_version: client_version
      };
      urlHttp.post("/Cash/getShareIncome", obj).then(res => {
        console.log(res, "新手分享完成");
      });
    },
    listenBack: function() {
      //监听返回函数
      let that = this;

      window.history.pushState({}, document.title, "#");
      window.addEventListener(
        "popstate",
        function() {
          that.listenBackFn();
        },
        false
      );
    },

    listenBackFn: function() {
      let that = this;
      //优先提现
      this.closeLayer();
      //is_version_143  0 小于  1 大于等于
      if (
        this.user.user.money >= 1 &&
        this.user.user.is_one_withdraw == "0" &&
        this.user.is_version_143 != 1
      ) {
        this.goBack = true;
        return false;
      }

      let showOne = false;
      let showTwo = false;
      let showThree = false;
      // 循环新手任务，未完成显示窗口
      //判断新手分享是否完成
      if (this.newTask.data) {
        this.newTask.data.map((items, zindex) => {
          if (items.title == "新手分享任务") {
            items.list.map((item, index) => {
              if (item.today_day == "1" && item.status == "1") {
                //今天已分享
                showOne = true;
              }
            });
          } else if (items.title == "新手阅读任务") {
            items.list.map((item, index) => {
              if (item.today_day == "1" && item.status == "1") {
                //今天已分享
                showTwo = true;
              }
            });
          } else if (items.title == "观看新手教程") {
            if (items.status == "1") {
              //判断是否观看新手教程
              showThree = true;
            }
          } else {
          }
        });
      }

      if (showOne && showTwo && showThree) {
        // 今日任务都完成
        this.newGetMoneyTwo = true;
      } else {
        this.newGetMoneyTwo = false;
      }
      if (this.newTask.data) {
        this.newTask.data.map((item, index) => {
          if (this.newGetMoneyTwo) {
            // 今日任务完成

            this.newGetMoney = false;
          } else {
            //未完成

            this.newGetMoney = true;
          }
        });
      }
    },
    itemClick: function(e, item) {
      //详情里面有签到日期
      console.log(this.dayilShare);
      if (item.data && item.data.list) {
        let that = this;
        let zindex = 0;
        item.data.list.map((item, index) => {
          if (item.status == "1") {
            Vue.set(that.dayilShare, index, "已分享");
            zindex++;
          }
        });
        if (zindex >= "5") {
          //显示已获得
          Vue.set(that.dayilShare, 6, "已获得");
        } else {
          //显示图片
          this.dayilShareGif = true;
        }
      }
      if (
        e.currentTarget.getElementsByClassName("down")[0].src ==
        "https://res.youth.cn/newActive/taskCenter/down.png"
      ) {
        e.currentTarget.getElementsByClassName("down")[0].src =
          "https://res.youth.cn/newActive/taskCenter/up.png";
        e.currentTarget.getElementsByClassName(
          "taskItemInfo"
        )[0].style.display = "block";
        e.currentTarget
          .getElementsByClassName("taskItemInfo")[0]
          .classList.add("height-enter-active");
      } else {
        e.currentTarget.getElementsByClassName("down")[0].src =
          "https://res.youth.cn/newActive/taskCenter/down.png";
        e.currentTarget.getElementsByClassName(
          "taskItemInfo"
        )[0].style.display = "none";
      }
    },
    //签到
    signOut: function() {
      let that = this;
      urlHttp.post("/TaskCenter/sign", this.urlParam).then(res => {
        console.log(res);
        if (res.data.status == "1") {
          this.signData.user = res.data;
          this.userInfo(); //签到成功更新数据
        } else {
          this.$toast.center("签到失败");
        }
      });
      this.layerSign = true;
    },
    signOutBtn: function(type) {
      //签到完成弹窗的按钮
      // 0 默认 邀请好友  1、支付宝 2、双倍卡  3、前天未分享:分享引导  4、前天有分享：红包广告引导

      /**
       *
       *
       * 双倍卡 https://kd.youth.cn/html/shareread/index.html?from=1&access=WIFI&app-version=1.4.1&app_version=1.4.1&carrier=%E6%97%A0%E6%9C%8D%E5%8A%A1&channel=c1005&cookie=MDAwMDAwMDAwMJCMpN-w09Wtg5-Bb36eh6CPqHualIej366FuWayp3mxhoyp4LDPyGl9onqkj3ZqYJa8Y898najWsJupY7G3dWuFoordrt-uapqGcXY&cookie_id=dbb9b00ef28b5746ed49ae996a8c698e&device_brand=OPPO&device_id=17477640&device_model=OPPO%20A57&device_type=android&mc=02:00:00:00:00:00&openudid=9e51810e009fd8d2&os_api=23&os_version=A57_11_A.30_181206&request_time=1550718169&resolution=720.0x1280.0&sim=2&sm_device_id=20181211184138635de6ea3c3dfb2e66d3fd95c9b5430d0164e4e3a1b25a6a&subv=1.2.2&uid=21588119&version_code=25&zqkey=MDAwMDAwMDAwMJCMpN-w09Wtg5-Bb36eh6CPqHualq2jmrCarauwt4lthnx63rC4qmqXr6NthJl7mI-shMmXeqDau4StacS3o7GFjIrdr8-6Y4N5l2yEY2Ft&zqkey_id=b5cccc06c2aa807ff13b1781cc073002&access=WIFI&app-version=1.4.1&app_version=1.4.1&carrier=%E6%97%A0%E6%9C%8D%E5%8A%A1&channel=c1005&cookie=MDAwMDAwMDAwMJCMpN-w09Wtg5-Bb36eh6CPqHualIej366FuWayp3mxhoyp4LDPyGl9onqkj3ZqYJa8Y898najWsJupY7G3dWuFoordrt-uapqGcXY&cookie_id=dbb9b00ef28b5746ed49ae996a8c698e&device_brand=OPPO&device_id=17477640&device_model=OPPO%20A57&device_type=android&mc=02:00:00:00:00:00&openudid=9e51810e009fd8d2&os_api=23&os_version=A57_11_A.30_181206&request_time=1550718172&resolution=720.0x1280.0&sim=2&sm_device_id=20181211184138635de6ea3c3dfb2e66d3fd95c9b5430d0164e4e3a1b25a6a&subv=1.2.2&uid=21588119&version_code=25&zqkey=MDAwMDAwMDAwMJCMpN-w09Wtg5-Bb36eh6CPqHualq2jmrCarauwt4lthnx63rC4qmqXr6NthJl7mI-shMmXeqDau4StacS3o7GFjIrdr8-6Y4N5l2yEY2Ft&zqkey_id=b5cccc06c2aa807ff13b1781cc073002&access=WIFI&app-version=1.4.1&app_version=1.4.1&carrier=%E6%97%A0%E6%9C%8D%E5%8A%A1&channel=c1005&cookie=MDAwMDAwMDAwMJCMpN-w09Wtg5-Bb36eh6CPqHualIej366FuWayp3mxhoyp4LDPyGl9onqkj3ZqYJa8Y898najWsJupY7G3dWuFoordrt-uapqGcXY&cookie_id=dbb9b00ef28b5746ed49ae996a8c698e&device_brand=OPPO&device_id=17477640&device_model=OPPO+A57&device_type=android&mc=02%3A00%3A00%3A00%3A00%3A00&openudid=9e51810e009fd8d2&os_api=23&os_version=A57_11_A.30_181206&request_time=1550718175&resolution=720.0x1280.0&sim=2&sm_device_id=20181211184138635de6ea3c3dfb2e66d3fd95c9b5430d0164e4e3a1b25a6a&subv=1.2.2&uid=21588119&version_code=25&zqkey=MDAwMDAwMDAwMJCMpN-w09Wtg5-Bb36eh6CPqHualq2jmrCarauwt4lthnx63rC4qmqXr6NthJl7mI-shMmXeqDau4StacS3o7GFjIrdr8-6Y4N5l2yEY2Ft&zqkey_id=b5cccc06c2aa807ff13b1781cc073002
       *
       * 支付宝
       *
       */
      var that = this;

      if (type == "0") {
        window.WebViewJavascriptBridge.callHandler(
          "openSourceUrl",
          {
            url: that.user.red_url,
            type: 0
          },
          function() {}
        );
      } else if (type == "1") {
        window.WebViewJavascriptBridge.callHandler(
          "openSourceUrl",
          {
            url: that.zfbUrl,
            type: 1
          },
          function() {}
        );
      } else if (type == "2") {
        window.WebViewJavascriptBridge.callHandler(
          "openSourceUrl",
          {
            url: that.returnHost("") + "/html/shareread/index.html",
            type: 0
          },
          function() {}
        );
      } else if (type == "3") {
        window.WebViewJavascriptBridge.callHandler(
          "to_hot_article",
          function() {}
        );
      } else if (type == "4") {
        window.WebViewJavascriptBridge.callHandler(
          "openSourceUrl",
          {
            url: "http://c.juhuitui.cn/94eb3adb",
            type: 1
          },
          function() {}
        );
      } else {
        LDZS.shareWx("shareWxhy");
      }
      this.closeLayer();
    },
    showLoading: function() {
      this.$loading("跳转中", "open");
      setTimeout(() => {
        this.$loading("跳转中", "close");
      }, 500);
    },
    shareImgWx: function() {
      // 分享到微信群
      this.$loading("分享中", "open");
      setTimeout(() => {
        this.$loading("分享中", "close");
      }, 1000);
      LDZS.shareWx("shareWxhy");
      this.closeLayer();
    },
    closeShare: function() {
      this.shareLayer = false;
    },
    shiliClick: function() {
      this.shiliShow = true;
    },
    goBackPage: function() {
      // 返回上一个页面
      window.WebViewJavascriptBridge.callHandler("closeWindow", {}, function(
        response
      ) {});
      this.closeLayer();
    },

    goHotTime: function() {
      let that = this;
      if (this.open) {
        this.open = false;
        //去定时红包页面 修改页面跳转
        window.WebViewJavascriptBridge.callHandler(
          "openSourceUrl",
          {
            url: that.user.red_url,
            type: 0
          },
          function() {}
        );
      }
      clearTimeout(timer);
      var timer = setTimeout(() => {
        this.open = true;
      }, 1000);
    },
    goLuck: function(item) {
      let url;
      let jumpTaskType = 0;

      if (
        item.url.indexOf("youth.cn") != "-1" ||
        item.url.indexOf("baertt.com") != "-1"
      ) {
        url = item.url;
        jumpTaskType = 0;
      } else {
        url = item.url;
        jumpTaskType = 1;
      }

      if (this.open) {
        this.open = false;
        window.WebViewJavascriptBridge.callHandler(
          "openSourceUrl",
          { url: url, type: jumpTaskType },
          function() {}
        );
      }
      clearTimeout(timer);
      var timer = setTimeout(() => {
        this.open = true;
      }, 1000);
    },
    swiper: function() {
      console.log(Swiper);

      let mySwiper = new Swiper(".swiper-container", {
        direction: "vertical", // 垂直切换选项
        loop: true, // 循环模式选项
        autoplay: 2000
      });
    },
    login: function() {
      // 用户登录
      window.WebViewJavascriptBridge.callHandler("wap_login", {}, function(
        response
      ) {});
    },

    goGetMoney() {
      let that = this;
      // 去提现 页面
      this.$loading("跳转中", "open");
      setTimeout(() => {
        this.$loading("跳转中", "close");
      }, 1000);

      if (this.isBig == "1") {
        // 非大额用户
        window.WebViewJavascriptBridge.callHandler("toExchange", "{}");
      } else {
        window.WebViewJavascriptBridge.callHandler(
          "openSourceUrl",
          {
            url: that.returnHost("") + "/withdraw/large",
            type: 0
          },
          function() {}
        );
      }
    },
    //首次绑定手机号成功的弹窗
    bindPhoneSuccess() {
      return urlHttp
        .post("/WebApi/user/bindMobileReward", this.urlParam)
        .then(res => {
          if (res.data.status == "1") {
            this.bindPhoneReward = res.data.data;
            this.bindPhoneLayer = true;
          } else {
            this.$toast.center(res.data.msg);
          }
        });
    },
    //绑定手机号成功以后领取奖励
    receiveRewrad() {
      this.bindPhoneSuccess();
      setTimeout(() => {
        //更新数据
        this.userInfo();
        this.getTask();
        this.bindPhoneLayer = false;
      }, 2000);
    }
  }
};
</script>
<style lang="less" scoped>
@import "./index.less";

/*
  1.未登录状态下 的轮播滚动接口

  弹窗类型 
  1.邀请好友
  2.支付宝新用户拉新
  3.双倍卡
  4.分享引导
  5.红包逛好引导

this.newUserInfo ={
 avatar: "https://res.youth.cn/avatar_201807_02_02x_5b3a3e6121efc12912316a.jpg",
  day: 2,
  new_status: 1,
  score: 0.3,
  type: 0,
}
 


*/
</style>





