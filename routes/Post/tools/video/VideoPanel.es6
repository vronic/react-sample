
const React = require('react');
const classNames = require('classnames');

const VideoLoaderPanel = require('./VideoLoaderPanel');
const VideoListPanel = require('./VideoListPanel');

const Reflux = require('reflux');

const actionsList = require('./_actionsVideoList');
const storeList = require('./_storeVideoList');

const videoStore = require('./_storeVideoPreview');
const videoActions = require('./_actionsVideoPreview');

//---------------------------------------------------------------------------------------------
const VideoPanel = React.createClass({

	mixins: [
		Reflux.listenTo(actionsList.loadVideos.completed, 'onLoadVideosCompleted'),
		Reflux.listenTo(actionsList.saveVideos.completed, 'onSaveVideosCompleted'),
		Reflux.listenTo(storeList, 'onChangeVideosListStore'),

	],

	propTypes: {
		container: React.PropTypes.string
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
		actionsList.loadVideos();
	},

	componentDidMount() {
		this._showVideoLoaderPanel();
	},

	onChangeVideosListStore (videos) {

		this.setState({
			loaded: videos.length,
		});

		if (!videos.length) {
			this._showVideoLoaderPanel();
		}
	},

	onLoadVideosCompleted(loaded) {
		if (loaded) {
			this.setState({
				loaded: loaded,
			});
			this._showVideoListPanel();
		}
	},

	onSaveVideosCompleted() {
		actionsList.loadVideos();
	},

	onClickCloseButton (evt) {
		evt.preventDefault();
		React.unmountComponentAtNode(document.getElementById(this.props.container));
	},

	onClickAddVideo (evt) {
		evt.preventDefault();
		this._showVideoLoaderPanel();
	},

	onClickListVideo (evt) {
		evt.preventDefault();

		if (this.state.loaded) {
			this._showVideoListPanel();
		}
	},

	container: 'tw-video-container',

	_renderComponent (component, container) {

		const el = React.createElement(component, {
			container: container,
		});
		React.render(el, document.getElementById(container));
	},

	_showVideoLoaderPanel () {
		this.setState({
			listActive: false,
		});

		this._renderComponent(VideoLoaderPanel, this.container);
	},

	_showVideoListPanel() {
		this.setState({
				listActive: true,
			});

		this._renderComponent(VideoListPanel, this.container);
	},

	render() {

		var classListTab = classNames({
			'uk-disabled': !this.state.loaded,
			'uk-active': this.state.listActive
		});

		var classAddTab = classNames({
			'uk-active': !this.state.listActive
		});


		var loadedVideos = this.state.loaded ? `(${this.state.loaded})` : '';

		return (
			<div className="uk-panel uk-panel-box uk-panel-box-secondary uk-panel-header">
				<div
					className="uk-align-right uk-text-muted tw-cursor-pointer"
					onClick={this.onClickCloseButton}>
					<i className="uk-icon-close" />
				</div>
				<h3 className="uk-panel-title">
					<i className="uk-icon-file-video-o uk-margin-right  uk-text-danger" />Видео для статьи
				</h3>

				<ul className="uk-tab">
					<li
						onClick={this.onClickAddVideo}
						className={classAddTab}>
						<a href="#add">Загрузить</a>
					</li>
					<li
						onClick={this.onClickListVideo}
						className={classListTab}>
						<a href="#list">Альбом {loadedVideos}</a>
					</li>
				</ul>
				<br />
				<div id={this.container} />
			</div>
		);
	}
});

module.exports = VideoPanel;
