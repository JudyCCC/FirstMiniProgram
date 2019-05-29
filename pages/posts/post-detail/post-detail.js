var { posts_content } = require('../../../data/posts-data.js');

Page({
  data: {
    postData: [],
    isPlayingMusic: false,    // 是否播放音乐
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

    var that = this;
    wx.onBackgroundAudioPlay(function(){
      that.setData({
        isPlayingMusic: true,
      })
    });
    wx.onBackgroundAudioPause(function(){
      that.setData({
        isPlayingMusic: false,
      })
    });
  
  },

  onCollectionTap:function(event){
    this.getPostsCollectedSyc();
    // this.getPostsCollectedAsy();
  },

  getPostsCollectedAsy:function(){
    var that = this;
    wx.getStorage({
      key:'posts_collected',
      success:function(res){
        var postsCollected = wx.getStorageSync('posts_collected');

        var postCollected = postsCollected[that.data.currentPostId];
        // 收藏状态取反
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;

        that.showToast(postsCollected, postCollected);
      }
    })
  },

  getPostsCollectedSyc:function(){
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
  },

  onShareTap:function(event){
    var itemList = [
      '分享给微信好友',
      '分享到朋友圈',
      '分享到QQ',
      '分享到微博'
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success:function(res){
        // res.cancel 用户是不是点击了取消按钮
        // res.tapIndex 数组元素的序号，从0开始
        wx.showModal({
          title: '用户分享到了' + itemList[res.tapIndex],
          content: '用户是否取消' + res.cancel + '现在无法实现分享功能，什么时候能实现呢？',
        })
      }
    })
  },

  onMusicTap:function(event){
    var currentPostId = this.data.currentPostId;
    var postData = posts_content[currentPostId];
    var isPlayingMusic = this.data.isPlayingMusic;
    if(isPlayingMusic){
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    }else{
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      });
      this.setData({
        isPlayingMusic: true
      });
    }
  }

})