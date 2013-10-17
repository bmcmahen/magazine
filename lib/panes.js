var events = require('events');
var css = require('css');
var BackgroundVideo = require('background-video');
var classes = require('classes');
var PopupVideo = require('popup-video');

function Pane(el, i, parent){
  this.el = el;
  this.i = i;
  this.parent = parent;
  this.bind();
  this.findVideo();
}

module.exports = Pane;

var textJSON = {
  2: {
    duration: 10,
    html: '<h5> Michener Center </h5> <p> <a href="#">learn more </a></p>'
  },

  4: {
    duration: 15,
    html: '<p> world </p>'
  }
};

Pane.prototype.bind = function(){
  this.events = events(this.el, this);
  this.events.bind('click [data-link]', 'linkto');
}

Pane.prototype.unbind = function(){
  this.events.unbind();
  if (this.docEvents) this.docEvents.unbind();
}

Pane.prototype.findVideo = function(){
  var url;
  var el = this.el.getAttribute('data-background-video')
    ? this.el
    : this.el.querySelector('[data-background-video');

  this.videoEl = el;

  if (el){
    url = el.getAttribute('data-background-video');
    this.video = new BackgroundVideo(el, url);
    if (el.getAttribute('data-video-loop')){
      this.video.loop();
    }
    this.video.append();
    this.docEvents = events(window, this);
    // consider throlling this
    this.docEvents.bind('resize', 'resizeVideo');
    this.events.bind('click [data-toggle-playback]', 'togglePlayback');
    this.events.bind('click .start-video', 'playVideoURL');
    this.events.bind('click .icon-play-circle', 'playVideoURL');
  }
}

Pane.prototype.playVideoURL = function(e){
  var target = e.target;
  var url = target.getAttribute('data-play-video');
  if (this.video){
    this.video.video.src = url;
    this.video.play();
  }
  if (target.getAttribute('data-popup-video')){
    console.log('hiya');
    this.popup = new PopupVideo(this.video.video, textJSON);
  }
}

Pane.prototype.resizeVideo = function(){
  this.video.calcSize();
};

Pane.prototype.togglePlayback = function(){
  if (this.video.isPlaying) {
    this.pauseVideo();
  } else {
    this.playVideo();
  }
}

Pane.prototype.playVideo = function(e){
  if (e) e.preventDefault();
  this.video.play();
};

Pane.prototype.pauseVideo = function(e){
  if (e) e.preventDefault();
  this.video.pause();
};

Pane.prototype.activate = function(){
  if (this.videoEl && this.videoEl.getAttribute('data-autoplay')){
    this.video.play();
  }
  var self = this;
  setTimeout(function(){
    classes(self.el).add('active');
  }, 500);
  this.active = true;
};

Pane.prototype.deactivate = function(){
  if (this.video) this.pauseVideo();
  var self = this;
  setTimeout(function(){
    classes(self.el).remove('active');
  }, 500);
  this.active = false;
};

Pane.prototype.linkto = function(e){
  e.preventDefault();
  var to = e.target.getAttribute('data-link').toLowerCase();
  if (to === 'next') this.parent.next();
  else if (to === 'previous') this.parent.prev();
  else this.parent.show(parseInt(to));
}

Pane.prototype.setWidth = function(w){
  css(this.el, { width: w + 'px' });
}

