const Reflux = require('reflux');

const actions = require('./listActions');
const { baseUrl, notify} = require('./utils');

const { status } = require('./listStatus');
const { fields } = require('./listFields');
const assign = require('object-assign');
const axios = require('axios');

const Store = Reflux.createStore({

	listenables: actions,

	init() {
		this.kind = '';
		this.role = '';
		this.header = {};
        this.publications = [];
        this.fields = [];

        this.token = $('#tw-publications').data('csrf-token');
    },

    getPublications () {
		return this.publications;
    },

    getHeader () {
		return this.header;
    },

    onClearPublications() {
        this._clearStore();
        this.trigger(this.publications);
    },

    onLoadPublications (kind) {
        const base = baseUrl();
        const url = `${base}api/v2/posts/${kind}`;

        axios.get(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-Token': this.token
            }
        })
        .then( (response) => {
            if(response.status === 200) {
                _clearStore(this);
                this.publications = response.data.list.map( (publication) => assign({}, publication, {statusName: status[response.data.role][publication.status]}) );
                this.fields = (this.publications.length) ? Object.keys(this.publications[0]) : [];
                this.header = _makeHeader(response.data.role);
                this.kind = response.data.kind;
                this.role = response.data.role;

                actions.loadPublications.completed(this.publications.length);
                this.trigger(this.publications);
            }
        })
        .catch((response) => console.log(response));
    }
});

const _clearStore = function (store = Store) {

		store.publications.length = 0;
		store.fields.length = 0;
		store.header.length = 0;

		store.kind = '';
		store.role = '';
};

const _makeHeader = function (storeRole) {

	let header = {
		index: '#',
		title: 'Название',
		created: 'Добавлена',
		status: 'Статус'
	};

	if (storeRole !== 'author') {
		header = {
			index: '#',
			title: 'Название',
			created: 'Добавлена',
            author: 'Автор',
			status: 'Статус'
		};
	}

	return header;
};

module.exports = Store;