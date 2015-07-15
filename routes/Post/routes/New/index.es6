module.exports = {
  path: 'new',

  getComponents (cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/New'));
    });
  }
};