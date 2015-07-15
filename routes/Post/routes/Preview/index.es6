module.exports = {
  path: 'preview/:id',

  getComponents (cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Preview'));
    });
  }
};