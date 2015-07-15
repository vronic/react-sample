
var React = require('react');
var classNames = require('classnames');

var ImagesLoaderPanel = require('./TWImagesLoaderPanel');
var ImagesListPanel = require('./TWImagesListPanel');

const Reflux = require('reflux');

const ImagesListActions = require('./_actionsImagesList');
const ImagesListStore = require('./_storeImagesList');

const ImagesStore = require('./_storeImages');
const ImagesActions = require('./_actionsImages');

//---------------------------------------------------------------------------------------------
var TWImagesLoader = React.createClass({

	mixins: [
		Reflux.listenTo(ImagesListActions.loadImages.completed, 'onLoadImagesCompleted'),
		Reflux.listenTo(ImagesActions.uploadImages.completed, 'onUploadImagesCompleted'),
		Reflux.listenTo(ImagesListStore, 'onChangeImagesListStore')
	],

	propTypes: {
		container: React.PropTypes.string.isRequired
	},

	getDefaultProps(){
		return {
			container: 'tw-container'
		};
	},

	getInitialState() {
		return {
			loaded: 0,
			listActive: false
		};
	},

	componentWillMount() {
		ImagesListActions.loadImages();
	},

	componentDidMount() {
		this._showImagesLoaderPanel();
	},

	onChangeImagesListStore (images) {

		this.setState({
			loaded: images.length
		});

		if (!images.length) {
			this._showImagesLoaderPanel();
		}
	},

	onLoadImagesCompleted(loaded) {
		if (loaded) {
			this.setState({
				loaded: loaded,
			});
			this._showImagesListPanel();
		}
	},

	onUploadImagesCompleted() {

		ImagesListActions.loadImages();
	},

	onClickCloseButton (evt) {
		evt.preventDefault();
		React.unmountComponentAtNode(document.getElementById(this.props.container));
	},

	onClickAddImages (evt) {
		evt.preventDefault();
		this._showImagesLoaderPanel();
	},

	onClickListImages (evt) {
		evt.preventDefault();

		if (this.state.loaded) {
			this._showImagesListPanel();
		}
	},

	container: 'tw-images-loader-container',

	_showImagesLoaderPanel () {
		this.setState({
			listActive: false,
		});

		var imagesLoaderPanel = React.createElement(ImagesLoaderPanel, {
			container: this.container,
		});
		React.render(imagesLoaderPanel, document.getElementById(this.container));
	},

	_showImagesListPanel() {
		this.setState({
				listActive: true,
			});

		var imagesListPanel = React.createElement(ImagesListPanel, {
			container: this.container,
		});
		React.render(imagesListPanel, document.getElementById(this.container));
	},

	render() {

		var classListTab = classNames({
			'uk-disabled': !this.state.loaded,
			'uk-active': this.state.listActive
		});

		var classAddTab = classNames({
			'uk-active': !this.state.listActive
		});


		var loadedImages = this.state.loaded ? `(${this.state.loaded})` : '';

		return (
			<div className="uk-panel uk-panel-box uk-panel-box-secondary uk-panel-header">
				<div
					className="uk-align-right uk-text-muted tw-cursor-pointer"
					onClick={this.onClickCloseButton}>
					<i className="uk-icon-close" />
				</div>
				<h3 className="uk-panel-title">
					<i className="uk-icon-file-image-o uk-margin-right  uk-text-danger" />Изображения для статьи
				</h3>

				<ul className="uk-tab">
					<li
						onClick={this.onClickAddImages}
						className={classAddTab}>
						<a href="#add">Загрузить</a>
					</li>
					<li
						onClick={this.onClickListImages}
						className={classListTab}>
						<a href="#list">Альбом {loadedImages}</a>
					</li>
				</ul>
				<br />
				<div id={this.container} />
			</div>
		);
	}
});

module.exports = TWImagesLoader;