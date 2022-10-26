// pages/home/home.js
const app = getApp();

import request from "../../utils/request";
import { dayFormat } from "../../utils/day";
import { getBill } from "../../https/home";
import { getStorageFun } from "../../utils/storageFun";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    ledger_name: "",
    scrollViewHeight: "",
    ledgetDataList: [],
    BillList: [],
    budgerInfo: {
      sumBudert: 0,
      sum: 0,
      lave: 0,
      percen: 0,
    },
  },
  onHide() {
    this.setData({
      show: false,
    });
  },
  onShow() {
    wx.hideHomeButton();
    this.getBillData();
    this.setData({
      show: true,
    });
  },
  onLoad: function (options) {
    wx.hideHomeButton();
  },
  async getBillData() {
    const { userInfo } = app.globalData;

    let { data } = await getBill({
      id: userInfo.id,
      openid: userInfo.user_openid,
    });
    
    if (data.code === 200) {
      let { billInfo, ledgetDataList } = data.data;
      let { BillList, sumBudert } = this.formatPrice(billInfo);

      let { budget } = await getStorageFun("userInfo");

      let { ledger_name,id:ledgerid } = ledgetDataList.filter((e) => {
        return +e.ledger_isSelected === 1;
      })[0];

      let lave = (budget - sumBudert).toFixed(2) > 0 ? budget - sumBudert : 0;
      let percen =
        ((lave * 100) / budget).toFixed(2) > 0
          ? ((lave * 100) / budget).toFixed(2)
          : 0;

      let budgerInfo = {
        sumBudert,
        sum: budget,
        lave,
        percen,
      };

      app.globalData.ledgerid = ledgerid

      this.setData({
        ledger_name,
        BillList,
        ledgetDataList,
        budgerInfo,
      });
    }
  },
  formatPrice(billInfo) {
    let BillList = [],
      sumBudert = 0;
    billInfo.forEach((e) => {
      sumBudert += Number(e.bill_price);
      let i = BillList.findIndex(
        (val) => e.bill_datetime === val.bill_datetime
      );
      if (i === -1) {
        let item = { sum: 0 };
        item.bill_datetime = e.bill_datetime;
        item.time = dayFormat(e.bill_datetime, "YYYY-MM-DD");
        e.time = dayFormat(e.bill_datetime, "HH:mm");
        item.sum = Number(item.sum) + Number(e.bill_price);
        item.List = [];
        item.List.push(e);

        BillList.push(item);
      } else {
        BillList[i].List.push(e);
      }
    });

    return { BillList, sumBudert };
  },
  tostatistics() {
    // wx.navigateTo({
    //     url: '../statistics/statistics',
    // })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
    });
  },
  hideModal(e) {
    this.setData({
      modalName: null,
    });
  },
  tabSelect(e) {
    this.TabCur = e.currentTarget.dataset.id;
    this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
  },
  async getUser() {
    let res = await request({ url: "user/findUserInfo", data: { id: 14 } });
    console.log(res);
  },
});
