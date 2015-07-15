import React from 'react';

const ImagesLoader = require('./image/TWImagesLoader');
const VideoPanel = require('./video/VideoPanel');

const { Navigation } = require('react-router');


const ToolsPanel = React.createClass({

	mixins: [
		Navigation
	],

	propTypes: {
		container: React.PropTypes.string.isRequired,
		post: React.PropTypes.string.isRequired,
		buttonPreview: React.PropTypes.shape({
			name: React.PropTypes.string,
			title: React.PropTypes.string
		})
	},

	getDefaultProps() {
		return {
			container: 'tw-container',
			post: 'current',
			buttonPreview: {
				name: 'Просмотр',
				title: 'Предварительный просмотр публикации с учетом текущих изменений'
			}
		};
	},

	onShowImagesLoader (evt) {
		evt.preventDefault();

		this._renderComponent(ImagesLoader, this.props.container);
	},

	onShowVideoPanel (evt) {
		evt.preventDefault();
		this._renderComponent(VideoPanel, this.props.container);
	},


	// onClickSourceLoader (evt) {
	// 	evt.preventDefault();
	// 	console.log('onClickSourceLoader', evt.target);
	// },

	// onClickPollLoader (evt) {
	// 	evt.preventDefault();
	// 	console.log('onClickPollLoader', evt.target);
	// },

	// onClickArticlePreview (evt) {
	// 	evt.preventDefault();
	// 	console.log('onClickArticlePreview', evt.target);
	// },

	_renderComponent (component, container) {

		const el = React.createElement(component, {
			container: container
		});
		React.render(el, document.getElementById(container));
	},

	render() {
		
		const preview = this.props.buttonPreview;

		return (
			<div>
				<div
					onClick={this.onShowImagesLoader}
					className="uk-icon-button uk-icon-file-image-o uk-text-warning uk-margin-right tw-cursor-pointer"
					title="Изображения"
					data-uk-tooltip
				/>

				<div
					onClick={this.onShowVideoPanel}
					className="uk-icon-button uk-icon-file-video-o uk-text-warning uk-margin-right tw-cursor-pointer"
					title="Видео"
					data-uk-tooltip
				/>
				<div
					onClick={ () => this.transitionTo(`post/preview/${this.props.post}`) }
					className="uk-button"
					title={preview.title}
					data-uk-tooltip
				>{ preview.name}
				</div>
			</div>
		);
	}
});

module.exports = ToolsPanel;