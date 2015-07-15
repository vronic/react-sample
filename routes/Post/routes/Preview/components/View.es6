const React = require('react');

const Reflux = require('reflux');
const actions = require('../../../stores/crudActions');
const store = require('../../../stores/crudStore');

const moment = require('moment');
moment.locale('ru');

const { Navigation } = require('react-router');


const View = React.createClass({

	mixins: [
		Navigation,
		Reflux.connect(store, 'article')
	],

	propTypes: {
		id: React.PropTypes.string
	},

	getDefaultProps() {
		return {
			id: 'current'
		};
	},

	getInitialState() {
		return {
			article: store.getArticle()
		};
	},

	componentWillMount() {
		if (this.props.id == 'current') {
			this.setState((state, props) => state.article = store.getArticle());
		} else {
			actions.loadArticle(this.props.id);
		}
	},

	componentWillReceiveProps(nextProps) {
		if(nextProps.id !== this.props.id){
			actions.loadArticle(nextProps.id);
		}
	},

	render() {
		const article = this.state.article;
		const created = moment.unix(article.created).format('LLL');

		const annotation = article.annotation ? <div className="uk-text-large">{article.annotation}</div> : '';
		const author = article.srcAuthor ? <div className="uk-text-muted">Автор: {article.srcAuthor}</div> : '';
		const origin = article.srcOrigin ? <div className="uk-text-muted">Первоистчник: {article.srcOrigin}</div> : '';
		const translate = article.srcTranslate ? <div className="uk-text-muted">Перевод: {article.srcTranslate}</div> : '';
		const photo = article.srcPhoto ? <div className="uk-text-muted">Фотографии: {article.srcPhoto}</div> : '';

		return (
			<div>
				<div>
					<h1 className="uk-margin-right">
						Просмотр публикации
					</h1>
					<span
						className="uk-link uk-link-muted uk-text-muted uk-margin-right"
						onClick={ () => this.goBack() }
					> &larr; назад
					</span>
					<span
						onClick={ (evt) => {
							if (article.status === 'new') {
								this.goBack();
							} else {
								this.transitionTo(`post/edit/${article.id}`);
							}
						}}
						className="uk-button uk-button-success"
					>Редактировать
					</span>
				</div>
				
				<br />
				<div className="uk-text-muted">{article.author} - {created}</div>

				<h1>{this.state.article.title}</h1>
				{annotation}
				<p dangerouslySetInnerHTML={ {__html: this.state.article.textHTML} } />
				
				{author}
				{origin}
				{translate}
				{photo}
			</div>
			);
	}
});

module.exports = View;