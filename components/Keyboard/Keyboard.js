
const app = getApp();

import { setBill } from "../../https/bookkeeping";
import { getStorageFun } from "../../utils/storageFun";

import { dayFormat } from "../../utils/day";

Component({
  properties: {
    isShow: Number,
    classid: Number,
    iconclass: String,
    iconname: String,
  },
  data: {
    loadModal: false,
    showBtn: false,
    remark: "", //备注信息
    input_height: "250", //计算输入法的高度
    sum: "0",
    time: "",
    myMap: [],
    KEYBOART_DATA: [
      { id: 1, value: "7", type: "1" },
      { id: 2, value: "8", type: "1" },
      { id: 3, value: "9", type: "1" },
      { id: 4, value: "今天", type: "4" },
      { id: 5, value: "4", type: "1" },
      { id: 6, value: "5", type: "1" },
      { id: 7, value: "6", type: "1" },
      { id: 8, value: "+", type: "2" },
      { id: 9, value: "1", type: "1" },
      { id: 10, value: "2", type: "1" },
      { id: 11, value: "3", type: "1" },
      { id: 12, value: "-", type: "2" },
      { id: 13, value: ".", type: "1" },
      { id: 14, value: "0", type: "1" },
      { id: 15, value: "X", type: "3" },
      { id: 16, value: "完成", type: "5" },
    ],
  },
  ready() {
    let myMap = new Map([
      [
        (sum, val) => {
          return /^0$/.test(sum) && val != ".";
        },
        (sum, val) => {
          return val;
        },
      ],
      [
        (sum, val) => {
          return /\.$/.test(sum) && val === ".";
        },
        (sum, val) => {
          return sum;
        },
      ],
      [
        (sum, val) => {
          return /\.[0-9]{2,}$/.test(sum);
        },
        (sum, val) => {
          return sum;
        },
      ],
      [
        (sum, val) => {
          return /\.[0-9]{1,}$/.test(sum) && val === ".";
        },
        (sum, val) => {
          return sum;
        },
      ],
    ]);

    let time = dayFormat(new Date(), "YYYY/MM/DD")
    
    this.setData({
      time,
      myMap,
    });

    // this.GET_TODAY_DATE();
  },
  methods: {
    //获取键盘高度
    bindfocusfunction({ detail }) {
      this.setData({
        input_height: detail.height,
      });
    },
    finish_enter() {
      this.setData({
        showBtn: false,
      });
    },
    clickbtn() {
      const { showBtn } = this.data;

      this.setData({
        showBtn: true,
      });
    },
    // 日期修改
    bindDateChange(e) {
      let {value} = e.detail
      this.setData({
        time: dayFormat(value, "YYYY/MM/DD")
      });
    },
    async setBill() {

      let ledgerInfo = await getStorageFun("ledgerInfo");
      
      let { userInfo } = app.globalData;

      let bill_Data = {};
      let dataInof = this.data;
      bill_Data.bill_price = dataInof.sum; //价格
      bill_Data.bill_remark = dataInof.remark;
      bill_Data.bill_classid = dataInof.classid;
      bill_Data.bill_iconclass = dataInof.iconclass;
      bill_Data.bill_datetime = dataInof.date;
      bill_Data.bill_ledger = ledgerInfo.id;
      bill_Data.openid = userInfo.user_openid;
      bill_Data.userid = userInfo.id;
      bill_Data.bill_iconname = dataInof.iconname;
      bill_Data.bill_ledger = app.globalData.ledgerid,
      bill_Data.bill_datetime = dataInof.time

      let { data } = await setBill(bill_Data);

      if (data.code === 200) {
        this.setData({
          loadModal: false,
          showBtn: false,
        });
        wx.navigateBack({
          delta: 1,
        });
      }
    },
    enter({ target }) {
      let { value, type } = target.dataset;
      let { sum } = this.data;

      if(+type===4) return
      
      switch (+type) {
        case 1:
          sum = this.is_enter_num(sum, value);
          break;
        case 2:
          sum = this.is_enter_sign(sum, value);
          break;
        case 3:
          sum = this.delete_sum(sum, value);
          break;
        case 5:
          sum = this.is_enter_sign(sum, '=');
          this.setBill();
          break;
      }
      this.setData({
        sum
      })
    },
    delete_sum(sum, val) {
      return sum.slice(0, sum.length - 1);
    },
    is_enter_num(sum, val) {
      let { myMap } = this.data;
      let v = sum + val;


      myMap.forEach((value, key) => {
        if (key(sum, val)) {
          v = value(sum, val);
        }
      });
      return v;
    },
    is_enter_sign(sum, val) {

      val = val === "=" ? "" : val;
      let REG = /([0-9][\+ | \-]{1})|([\.][\+ | \-]{1})/;
      if (!REG.test(sum)) return sum + val;
      if (/\.$|\-$|\+$/.test(sum)) return sum.slice(0, sum.length - 1) + val;

      let v = /\+/.test(sum) ? "+" : "-";
      let sumList = sum.split(v);

      const sumCalculate = (e) =>
        ({
          "+": (sumList[0] * 100 + sumList[1] * 100) / 100 + val,
          "-": (sumList[0] * 100 - sumList[1] * 100) / 100 + val,
        }[e] || sum);

      return sumCalculate(v);
    },
  },
});
