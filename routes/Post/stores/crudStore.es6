const Reflux = require('reflux');
const actions = require('./crudActions');
const { baseUrl, notify} = require('./utils');

const assign = require('object-assign');
const axios = require('axios');

const emptyArticle = require('./emptyArticle');
const cuid = require('cuid');

const isObject = (obj) => {
  const type = typeof (obj);
  return type === 'function' || (obj && type === 'object') || false;
};

const Store = Reflux.createStore({

  listenables: actions,

  init() {
    this.article = this._initArticle();
    this.token = $('#tw-publications').data('csrf-token');
  },

  _initArticle() {
    return assign({}, emptyArticle);
  },

  getArticle() {
    return this.article;
  },

  getHash() {
    return this.article.hash;
  },

  onClearArticle() {
    this.article = this._initArticle();
    // обновим хеш
    this.article.hash = cuid();
    this.trigger(this.article);
  },

  onTypeUpdate(value) {
    this.article.type = value;
    this.trigger(this.article);
  },

  onUpdateArticle(article) {
    this._updateStore(article);
    this.trigger(this.article);
  },

  _updateStore(article) {
    this.article = article;
  },

    onSaveForm(data) {
      const base = baseUrl();
      const url = `${base}api/v2/post`;
      const hash = data.hash; // this.hash;

      // сохраним в сторе значения полей формы для возможного отката
      // в случае неудачного сохранения
      this._updateStore(data);

      axios.post(url, { data, hash }, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-Token': this.token
            }
        })
        .then( (response) => {
          if (response.status === 200) {
            // очистим стор при удачном сохранении
            actions.clearArticle();
            actions.saveForm.completed(response.data.post);
          }
        })
        .catch((response) => console.log('onSaveForm.catch', response));
    },

    onLoadArticle(id) {
      console.log('onLoadArticle', id);
      const base = baseUrl();
      const url = `${base}api/v2/post/${id}`;

      axios.get(url, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-Token': this.token
        }
      })
      .then( (response) => {
        if (response.status === 200) {
          if (isObject(response.data.post)) {
            this.article = response.data.post;
          } else {
            this.article = this._initArticle();
          }
          actions.loadArticle.completed(this.article.status);
          this.trigger(this.article);
        }
      })
      .catch((response) => console.log(response));
    },

    onGenerateFields(title, text) {
      const base = baseUrl();
      const url = `${base}api/v2/post/generate/meta`;

      const hash = this.article.hash; // this.article.hash;
      const data = { title: title, text: text};

      axios.post(url, { data, hash }, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-Token': this.token
            }
        })
        .then( (response) => {
          if (response.status === 200) {
            actions.generateFields.completed(response.data.meta);
          }
        })
        .catch((response) => console.log('onGenerateFields.catch', response));
    }

});

module.exports = Store;
