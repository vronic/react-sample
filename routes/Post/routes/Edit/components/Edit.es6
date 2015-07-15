const React = require('react');

const Form = require('../../New/components/Form');

const store = require('../../../stores/crudStore');
const actions = require('../../../stores/crudActions');


const Reflux = require('reflux');
const { Navigation } = require('react-router');

const Edit = React.createClass({
	mixins: [
		// Reflux.connect(store, 'article'),
		Navigation,
		Reflux.connect(store, 'article'),
		Reflux.listenTo(actions.loadArticle.completed, 'onLoadArticleCompleted')
	],

	getInitialState() {
		return {
			article: store.getArticle(),
			container: 'tw-article-form'
		};
	},

	componentWillMount() {
		if(this.props.params.id != this.state.article.id) {
			actions.loadArticle(this.props.params.id);
		}
	},

	// componentWillReceiveProps(nextProps) {
	// 	// если приходим по новому роуту сюда проверим что публикация не та же
	// 	// тогда почистим store.article и загрузим новуюпубликацию по id
	// 	if(nextProps.params.id != this.state.article.id) {
	// 		// actions.clearArticle();
	// 		actions.loadArticle(nextProps.params.id);
	// 	}
	// },

	onLoadArticleCompleted (status) {

		console.log('onLoadArticleCompleted', status);
		// если возвращается пустой store.article значит в базе ничего нет для редактирования 
		// этому юзеру с его топ-ролью
		if (status === 'new') {
			this.transitionTo('/post/list/all');
		}
	},

	render() {
		return (
			<Form {...this.state} />
		);
	}
});

module.exports = Edit;