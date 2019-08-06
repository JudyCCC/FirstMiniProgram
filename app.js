App({
  globalData:{
    g_isPlayingMusic: false,    // 是否有音乐播放
    g_currentMusicPostId:null,    // 哪一个音乐正在被播放
    doubanBase: 'https://douban.uieee.com',   // 豆瓣地址
    // doubanBase: 'http://t.yushu.im',   // 豆瓣地址
  }
})
// 先onLaunch再onShow
// onHide切后台触发