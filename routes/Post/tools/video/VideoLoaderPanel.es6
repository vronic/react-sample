
const React = require('react');
const classNames = require('classnames');

const Reflux = require('reflux');

const VideoPreviewList = require('./VideoPreviewList');
const VideoUrl = require('./VideoUrl');

const actionsList = require('./_actionsVideoList');
const actions = require('./_actionsVideoPreview');
const store = require('./_storeVideoPreview'); 

// ---------------------------------------------------------------------------------------
const VideoLoaderPanel = React.createClass({

	mixins: [
		Reflux.connect(store, 'videos'),
		Reflux.listenTo(actionsList.saveVideos.completed, 'onSaveVideosCompleted')
	],
 
	getInitialState: function() {
		return {
			videos: [],
			disabledButton: false
		};
	},

	componentDidMount() {
		this.setState({
			videos: store.getVideos()
		});
	},

	onSaveVideosCompleted () {
		this.setState({
			disabledButton: false
		});
		actions.clearVideos();
	},

	clickClearVideosPreviewList (evt) {
		evt.preventDefault();
		actions.clearVideos();
	},

	clickSaveVideos (evt) {
		evt.preventDefault();

		this.setState({disabledButton: true});
		actionsList.saveVideos(store.getVideos());
	},

	render() {

		const classLoaderPanel = classNames({
			'uk-form': 					true,
			'uk-panel':					true,
			'uk-panel-box':				false,
			'uk-panel-box-secondary':	false,
			'uk-panel-header':			true,
			'uk-margin': 				true,
			'uk-margin-bottom-remove':  true,
			'tw-border-red':			false,
			'uk-text-center':			false,
			'uk-placeholder':			false
		});

		const classButtons = classNames({
			'uk-hidden': !this.state.videos.length,
			'uk-form-row': true,
			'uk-margin-top': true,
		});

		return (
			<div className={classLoaderPanel}>
				
				<VideoUrl />
				<VideoPreviewList videos={this.state.videos}/>

				<div className={classButtons}>
					<div className="uk-form-controls">
						<button
							onClick={this.clickSaveVideos}
							disabled={this.state.disabledButton}
							className="uk-button uk-button-success uk-align-right uk-margin-bottom-remove">
							Загрузить ({this.state.videos.length})
						</button>
						<button
							onClick={this.clickClearVideosPreviewList}
							disabled={this.state.disabledButton}
							className="uk-button uk-button-link uk-align-right uk-link-muted uk-text-muted">
							очистить
						</button>
					</div>
				</div>

			</div>
		);
	}
});

module.exports = VideoLoaderPanel;
