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
  1: {
    duration: 20,
    html: "<div class='quick-view cf'><img src='sample_images/margaret_thompson.jpg'><p class='caption'><a href='#'>Dr. Margaret Thompson's</a> professional career was devoted to human genetics and its relevant to childhood diseases.</p></div>",
  },

  46: {
    duration: 15,
    html: '<div class="quick-view"><img src="sample_images/aerial.jpg"><p class="caption">The University of Alberta, located in Edmonton Alberta, played an important role in the history of eugenics in Alberta. Learn more <a href="http://127.0.0.1:3000/discover/mindmap/5233c9235c2ec50000000094">here.</a></p></div>'
  },

  101: {
    duration: 15,
    html: '<p class="caption">When the Alberta Sexual Sterilization Act was passed into law in March of 1928, it created a <a href="http://127.0.0.1:3000/discover/mindmap/5233c4865c2ec5000000008b">Eugenics Board</a> with the power to authorize the sexual sterilization of individuals whom the state and psychiatric establishment had found "mentally defective" in some way.</p>'
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

  this.events.bind('click [data-toggle-playback]', 'togglePlayback');
  this.events.bind('click .start-video', 'playVideoURL');
  this.events.bind('click .icon-play-circle', 'playVideoURL');

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
    console.log('hi');

  }
}

Pane.prototype.playVideoURL = function(e){
  var target = e.target;
  var url = target.getAttribute('data-play-video');
  if (this.video){
    this.videoEvents = events(this.video.video, this);
    this.videoEvents.bind('play', 'onplay');
    this.videoEvents.bind('pause', 'onpause');
    this.videoEvents.bind('end', 'onpause');
    this.videoEvents.bind('stop', 'onpause');

    this.video.video.src = url;
    this.video.play();
  }
  if (target.getAttribute('data-popup-video')){
    this.popup = new PopupVideo(this.video.video, textJSON);
  } else {
    this.popup.remove();
  }
}

Pane.prototype.onpause = function(){
  classes(this.el).remove('video-playing');
  this.video.isPlaying = false;
};

Pane.prototype.onplay = function(){
  classes(this.el).add('video-playing');
  this.video.isPlaying = true;
};

Pane.prototype.resizeVideo = function(){
  this.video.calcSize();
};

Pane.prototype.togglePlayback = function(e){
  if (e) e.preventDefault();
  console.log('toggle playback');
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

