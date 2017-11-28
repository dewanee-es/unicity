function View(view) {
  this.view = view;
}

View.create = function (view) {
  return new View(view);
}

View.prototype.execute = function (context, { state }) {
  state.view = this.view;
}

module.exports = View;