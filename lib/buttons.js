var classes = require('classes');
var emitter = require('emitter');
var events = require('events');

function ButtonView(index, parent){
  this.parent = parent;
  this.i = index;
  this.el = document.createElement('li');
  this.link = document.createElement('a');
  this.link.href = '#';
  classes(this.link).add('pane-button');
  this.link.textContent = index + 1;
  this.el.appendChild(this.link);
  this.bind();
}

module.exports = ButtonView;

ButtonView.prototype.bind = function(){
  this.events = events(this.el, this);
  this.events.bind('click', 'selectView');
};

ButtonView.prototype.close = function(){
  this.events.unbind();
};

ButtonView.prototype.select = function(){
  classes(this.link).add('selected');
  this.selected = true;
};

ButtonView.prototype.deselect = function(){
  classes(this.link).remove('selected');
  this.selected = false;
};

ButtonView.prototype.selectView = function(e){
  e.preventDefault();
  this.parent.show(this.i);
};