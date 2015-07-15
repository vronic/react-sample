const React = require('react');
const Form = require('./Form');

const actions = require('../../../stores/crudActions');
const store = require('../../../stores/crudStore');

const Reflux = require('reflux');
const {Navigation} = require('react-router');


const New = React.createClass({
	mixins: [
		Reflux.connect(store, 'article'),
		Reflux.listenTo(actions.saveForm.completed, 'onSaveFormCompleted'),
		Navigation
	],

	getInitialState() {
		return {
			article: store.getArticle(),
			container: 'tw-article-form'
		};
	},

	componentWillMount() {
		if(this.state.article.status !== 'new'){
			
			actions.clearArticle();
		}
	},

	onSaveFormCompleted(post) {
		this.transitionTo('post/list/all');
	},

	render() {
		return (
			<Form {...this.state} />
		);
	}
});

module.exports = New;