var Swipe = require('swipe');
var events = require('events');
var css = require('css');
var each = require('each');
var map = require('map');
var Emitter = require('emitter');
var k = require('k')(window);
var Cycle = require('cycle');
var nextTick = require('next-tick');

var ButtonView = require('./buttons');
var PaneView = require('./panes');

function Magazine(el){
  this.el = el;
  this.content = this.el.querySelector('#magazine-content');
  this.nav = this.el.querySelector('.magazine-navigation');
  this.swipe = new Swipe(this.content).duration(600);
  this.bind()
    .createSubviews()
    .setWidth()
    .onshowing(0);
  this.cycle.show(0);
}

module.exports = Magazine;

Emitter(Magazine.prototype);

/**
 * Universal events
 * @return {Magazine}
 */

Magazine.prototype.bind = function(){
  this.swipe.on('showing', this.onshowing.bind(this));
  this.swipe.on('show', this.onshow.bind(this));

  this.events = events(this.el, this);
  this.events.bind('click .exit', 'onExit');

  this.docEvents = events(window, this);
  this.docEvents.bind('resize', 'setWidth');

  k('right', function(){ this.swipe.next(); }.bind(this));
  k('left', function(){ this.swipe.prev(); }.bind(this));
  return this;
}

/**
 * Allow plugins
 * @param  {Function} fn
 * @return {Magazine}
 */

Magazine.prototype.use = function(plugin, options){
  plugin(this, options);
  return this;
};


/**
 * Create subviews and our buttons for each subview.
 * @return {Magazine}
 */

Magazine.prototype.createSubviews = function(){
  var lis = this.el.querySelectorAll('li.swipe-pane');
  this.panes = [];
  this.buttons = [];
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < lis.length; i++) {
    var button = new ButtonView(i, this);
    fragment.appendChild(button.el);
    this.buttons.push(button);

    var pane = new PaneView(lis[i], i, this);
    this.panes.push(pane);
    this.emit('paneCreated', pane);
  }

  this.createCycle();
  this.nav.appendChild(fragment);
  return this;
};

Magazine.prototype.createCycle = function(){
  this.cycle = new Cycle(this.panes, 2, { unload: true });
  this.cycle.on('enter', function(i, pane){ pane.show(); });
  this.cycle.on('exit', function(i, pane){ pane.hide(); });
  return this;
};

Magazine.prototype.onshowing = function(i){
  if (typeof this.current !== 'undefined') {
    if (i === this.current) return;
    this.buttons[this.current].deselect();
    this.panes[this.current].deactivate();
  }
  this.current = i;
  this.buttons[i].select();
  this.panes[i].activate();
  this.emit('show', i);
  return this;
};

Magazine.prototype.onshow = function(i){
  this.cycle.show(i);
  this.swipe.refresh();
};

/**
 * Show a particular pane
 * @param  {Number} i index of pane to show
 */

Magazine.prototype.show = function(i){
  this.swipe.show(i);
  this.cycle.show(i);
}

/**
 * Show the next pane
 */

Magazine.prototype.next = function(){
  this.swipe.next();
}

/**
 * Show the previous pane
 */

Magazine.prototype.prev = function(){
  this.swipe.prev();
}

Magazine.prototype.onExit = function(e){

}


/**
 * Set the width of each pane to that of the
 * content element. This is necessary because we can't set
 * the width to 100% since the parent element is
 * the total width of all the panes combined.
 */

Magazine.prototype.setWidth = function(){
  nextTick(function(){
    var w = this.content.clientWidth;
    each(this.panes, function(pane){
      pane.setWidth(w);
    });
    this.swipe.refresh();
  }.bind(this));

  return this;
}


Magazine.prototype.close = function(){
  this.events.unbind();
  this.swipeEvents.unbind();
  this.docEvents.unbind();
}
