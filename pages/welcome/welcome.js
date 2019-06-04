Page({
  onTap: (event) => {
    // 新页面没有返回按钮
    // wx.redirectTo({
    //   url: '../posts/post',
    // })

    wx.navigateTo({
      url: '../posts/post',
    })
  },
})