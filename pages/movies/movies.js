var util = require('../../utils/util.js');
var app = getApp();

Page({

  data:{
    inTheaters: {},   // 正在热映数据
    comingSoon: {},   // 即将上映
    top250: {},   // Top250
    searchResult: {},   // 搜索结果
    containerShow: true,    // 电影首页未点击搜索框内容
    searchPanelShow: false,   // 电影首页点击搜索框是搜索页面
  },

  onLoad: function(event){
    var inTheatersUrl = app.globalData.doubanBase +  '/v2/movie/in_theaters' + '?start=0&count=3';
    var comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon' + '?start=0&count=3';
    var top250Url = app.globalData.doubanBase + '/v2/movie/top250' + '?start=0&count=3';

    this.getMovieListData(inTheatersUrl, 'inTheaters', '正在热映');
    this.getMovieListData(comingSoonUrl, 'comingSoon', '即将上映');
    this.getMovieListData(top250Url, 'top250', '豆瓣Top250');
  },

  onMoreTap: function(event){
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category,
    })
  },

  onMovieTap: function(event){
    var movieId = event.currentTarget.dataset.movieid;
    console.log(movieId)
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId
    })
  },

  getMovieListData: function (url, settedKey, categoryTitle){
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/xml'
      },
      success: function (res) {
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function () { // 接口请求未成功 
        console.log('failed')
      }, 
    })
  },

  onCancelImgTap: function(enent){
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    })
  },

  onBindFocus: function(event){
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  onBindBlur: function(event){
    var text = event.detail.value;
    console.log(text)
    var searchUrl = app.globalData.doubanBase + '/v2/movie/search?q=' + text;
    this.getMovieListData(searchUrl, 'searchResult', '')
  },

  processDoubanData: function (moviesDouban, settedKey, categoryTitle){
    var movies = [];
    for(var idx in moviesDouban.subjects){
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if(title.length >= 6){
        title = title.substring(0, 6) + '...';
      }
      var temp = {
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
        stars: util.convertToStarsArray(subject.rating.stars)
      }
      movies.push(temp)
    }
    var readyData = {};
    readyData[settedKey] = {
      movies: movies,
      categoryTitle: categoryTitle
    };
    this.setData(readyData)
  },

})