var events = require('events');
var css = require('css');
var BackgroundVideo = require('background-video');
var classes = require('classes');

function Pane(el, i, parent){
  this.el = el;
  this.i = i;
  this.parent = parent;
  this.bind();
  this.findVideo();
}

module.exports = Pane;

Pane.prototype.bind = function(){
  this.events = events(this.el, this);
  this.events.bind('click [data-link]', 'linkto');
}

Pane.prototype.unbind = function(){
  this.events.unbind();
  if (this.docEvents) this.docEvents.unbind();
}

Pane.prototype.findVideo = function(){
  var url = this.el.getAttribute('data-background-video');
  if (url) {
    this.video = new BackgroundVideo(this.el, url)
      .loop()
      .append();

    this.docEvents = events(window, this);
    this.docEvents.bind('resize', 'resizeVideo');
  }
}

Pane.prototype.resizeVideo = function(){
  this.video.calcSize();
};

Pane.prototype.activate = function(){
  if (this.video) this.video.play();
  classes(this.el).add('active');
  this.active = true;
};

Pane.prototype.deactivate = function(){
  if (this.video) this.video.pause();
  classes(this.el).remove('active');
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

