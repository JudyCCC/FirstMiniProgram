App({
  globalData:{
    g_isPlayingMusic: false,    // 是否有音乐播放
    g_currentMusicPostId:null,    // 哪一个音乐正在被播放
  }
})
// 先onLaunch再onShow
// onHide切后台触发