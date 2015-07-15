module.exports = {
  path: 'notification',

  getChildRoutes (state, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./routes/List'),
        // require('./routes/New'),
        // require('./routes/Preview')
        // require('./routes/Edit')
      ]);
    });
  },

  getComponents (cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Notification'));
    });
  }
};