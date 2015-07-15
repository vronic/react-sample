module.exports = {

  path: 'list/:kind',

  getComponents (cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/List'));
    });
  }
};
