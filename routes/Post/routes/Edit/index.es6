module.exports = {
  path: 'edit/:id',

  getComponents (cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Edit'));
    });
  }
};