
import { getBillById } from "../../https/home";
import { datUnix } from "../../utils/day.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    billInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
    });
  },
  onReady() {
    this.getDetails();
  },
  async getDetails() {

    let { data } = await getBillById({ id: this.data.id });

    console.log('-------data-----',data);

    
    if (data.code === 200) {
      data.data.cdata = datUnix(data.data[0].create_date);
    }
    this.setData({
      billInfo: data.data[0],
    });
  },
  async delete() {},
});
