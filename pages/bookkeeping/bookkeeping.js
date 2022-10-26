// pages/bookkeeping/bookkeeping.js
import { getOwnClassIcon } from "../../https/bookkeeping";

const app = getApp();

Page({
  data: {
    iconList: [],
    keyyboardShow: false,
    isShow: 1,
    classid: null,
    iconclass:null,
    iconname:null
  },
  onLoad() {
    this.getIconfont();
  },
  showKeyboard(e) {
    const { id, name,iclass } = e.target.dataset;
    
    if (id && name) {
      this.setData({
        keyyboardShow: true,
        isShow: 2,
        classid:id,
        iconclass:iclass,
        iconname:name
      });
    } else {
      this.closeKeyboard();
    }
  },
  async getIconfont() {
    let { userInfo } = app.globalData;
    let { id, user_openid } = userInfo;

    let { data } = await getOwnClassIcon({ id, openid: user_openid });

    if (data.code === 200) {
      this.setData({
        iconList: data.data,
      });
    }
  },
  closeKeyboard() {
    this.setData({
      isShow: 1,
    });
    setTimeout(() => {
      this.setData({
        keyyboardShow: false,
        classid: null,
      });
    }, 1000);
  },
});
