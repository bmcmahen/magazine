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
}

module.exports = Pane;

Pane.prototype.bind = function(){
  this.events = events(this.el, this);
  this.events.bind('click [data-link]', 'linkto');
}

Pane.prototype.unbind = function(){
  this.emit('close');
  this.events.unbind();
  if (this.docEvents) this.docEvents.unbind();
}

Pane.prototype.activate = function(){
  var self = this;
  setTimeout(function(){
    classes(self.el).add('active');
  }, 500);
  this.emit('active');
  this.active = true;
};

Pane.prototype.deactivate = function(){
  var self = this;
  setTimeout(function(){
    classes(self.el).remove('active');
  }, 500);
  this.emit('inactive');
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

Pane.prototype.show = function(){
  this.emit('show');
  classes(this.el).add('visible');
}

Pane.prototype.hide = function(){
  this.emit('hide');
  classes(this.el).remove('visible');
}
