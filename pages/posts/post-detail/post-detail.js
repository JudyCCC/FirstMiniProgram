var { posts_content } = require('../../../data/posts-data.js');

Page({
  data: {
    postData: [],
  },

  onLoad: function(option){
    var postId = option.id;
    this.data.currentPostId = postId;
    var postData = posts_content[postId]
    // 如果在onLoad方法中，不是异步的去执行一个数据绑定
    // 则不需要使用this.setData方法
    // 只需对this.data赋值即可实现数据绑定
    // 此处直接赋值无作用
    this.setData({
      postData
    });

    // var postsCollected = {
    //   1: 'true',
    //   2: 'false',
    //   3: 'true'
    // }

    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    }else{
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected)
    }
  
  },

  onCollectionTap:function(event){
    var postsCollected = wx.getStorageSync('posts_collected');

    var postCollected = postsCollected[this.data.currentPostId]; 
    // 收藏状态取反
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;

    this.showToast(postsCollected, postCollected);
    // this.showModal(postsCollected, postCollected);
  },

  showToast: function (postsCollected, postCollected ){
    // 更新文章是否收藏的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    // 更新数据绑定变量，切换收藏图标颜色
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
      duration: 1000,
    })
  },

  showModal: function (postsCollected, postCollected ){
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '收藏该文章' : '取消收藏该文章？',
      showCancel: 'true',
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确认',
      confirmColor: '#405f80',
      success: function(res){
        if(res.confirm){
          // 更新文章是否收藏的缓存值
          wx.setStorageSync('posts_collected', postsCollected);
          // 更新数据绑定变量，切换收藏图标颜色
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  }

})