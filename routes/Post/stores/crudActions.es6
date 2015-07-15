const Reflux = require('reflux');

const Actions = Reflux.createActions({

  'typeUpdate': {}, // only newsman - type: news or article
  'saveForm': { asyncResult: true},
  'clearArticle': {},

  'loadArticle': { asyncResult: true},
  'updateArticle': {},
  'generateFields': {asyncResult: true}
});

module.exports = Actions;
