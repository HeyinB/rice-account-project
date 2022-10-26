
Page({
    /**
     * 页面的初始数据
     */
    data: {
        istrigger: false,
        list: []
    },
    onShow() {
        wx.hideHomeButton()
        this.getLedger()
    },
    onLoad: function(options) {
        wx.hideHomeButton()
    },
    onPulling(e) {
        console.log("==onPulling==", e)
        setTimeout(() => {
            console.log('ssss')
            this.setData({
                istrigger: false
            })
        }, 2000);
    },
    async getLedger() {
        let res = {}
        this.setData({
            list: res.result
        })

    },
    tolower(e) {
        let { list } = this.data
        let a = [
            { id: 1 },
            { id: 1 },
            { id: 1 },
            { id: 1 },
            { id: 1 },
            { id: 1 },
        ]
        list.push(...a)
        console.log('----list----', list);

        this.setData({
            list
        })
    }
})