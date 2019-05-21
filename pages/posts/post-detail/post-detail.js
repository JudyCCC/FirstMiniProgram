var { posts_content } = require('../../../data/posts-data.js');

Page({
  data: {
    postData: [],
  },

  onLoad: function(option){
    var postId = option.id;
    var postData = posts_content[postId]
    // 如果在onLoad方法中，不是异步的去执行一个数据绑定
    // 则不需要使用this.setData方法
    // 只需对this.data赋值即可实现数据绑定
    // 此处直接赋值无作用
    this.setData({
      postData
    })
  }
})