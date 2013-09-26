var Swipe = require('swipe');
var events = require('events');
var css = require('css');
var each = require('each');
var map = require('map');
var EmitterManager = require('emitter-manager');
var k = require('k')(window);

var ButtonView = require('./buttons');

function Magazine(el){
  this.el = el;
  this.content = this.el.querySelector('#magazine-content');
  this.buttons = this.el.querySelector('.magazine-navigation');
  this.items = this.el.querySelectorAll('li.swipe-pane');
  this.list = this.el.querySelector('ul.swipe');
  this.swipe = new Swipe(this.content).duration(600);
  this.bind();
  this.setWidth();
  this.buildButtons();
  this.onShow(0);
}

module.exports = Magazine;

EmitterManager(Magazine.prototype);

Magazine.prototype.bind = function(){
  this.listenTo(this.swipe, 'showing', this.onShow);

  this.events = events(this.el, this);
  this.events.bind('click .exit', 'onExit');
  this.events.bind('click .continue', 'showNext');
  this.events.bind('click [data-link]', 'linkTo');

  this.docEvents = events(window, this);
  this.docEvents.bind('resize', 'setWidth');

  var self = this;
  k('right', function(){ self.swipe.next(); });
  k('left', function(){ self.swipe.prev(); });
}

Magazine.prototype.linkTo = function(e){
  e.preventDefault();
  console.log('link to', e.target.getAttribute('data-link'));
}

Magazine.prototype.buildButtons = function(){
  var self = this;
  var fragment = document.createDocumentFragment();
  this.subViews = map(this.items, function(item, i){
    var view = new ButtonView(i, self);
    fragment.appendChild(view.el);
    return view;
  });
  this.buttons.appendChild(fragment);
}

Magazine.prototype.onShow = function(i){
  if (this.subViews){
    if (typeof this.current !== 'undefined') {
      if (i === this.current) return;
      this.subViews[this.current].deselect();
    }
    this.current = i;
    console.log(this.subViews, i);
    this.subViews[i].select();
  }
}

Magazine.prototype.showSwipe = function(i){
  console.log('show', i);
  this.swipe.show(i);
}

Magazine.prototype.onExit = function(e){

}

Magazine.prototype.showNext = function(e){
  if (e) e.preventDefault();
  this.swipe.next();
}


Magazine.prototype.setWidth = function(){
  var w = this.content.clientWidth;
  each(this.items, function(item){
    css(item, { width: w + 'px' });
  });
  this.swipe.refresh();
}