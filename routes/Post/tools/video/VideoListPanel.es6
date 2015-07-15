require('uikit/css/components/form-advanced.almost-flat.min.css');

const React = require('react');
const classNames = require('classnames');

const Reflux = require('reflux');

const storeList = require('./_storeVideoList');
const actionsList = require('./_actionsVideoList');

const VideoRow = require('./VideoRow');
const Modal = require('../../../../../../../modal/modal.cjsx.coffee');


// -------------------------------------------------------------------------------------
const VideoListPanel = React.createClass({

	mixins: [
		
		// Reflux.connect(ImagesListStore, 'images'),
		Reflux.listenTo(storeList, 'onChangeVideoListStore'),
	],

	getInitialState() {
		return {
			videos: storeList.getVideos(),
			checkedAll: false,
			align: 'center',
			checked: 0
		};
	},

	onChangeVideoListStore(videos) {

		this.setState({
			videos: videos
		}, () => (this.setState({checked: (this.state.videos.reduce( (memo, video) => (memo + (video.checked ? 1 : 0)), 0)) }) ));
		
	},

	clickInsertChecked (evt) {
		evt.preventDefault();

		// если есть выбранные 
		if(this.state.checked){

			const checked = this.state.videos.filter( (v) => v.checked );
			const $editor = $("#editor");

			checked.forEach( (video) => {

				const center = (this.state.align === 'center') ? 'uk-flex' : '';

				let data = {
					src: video.url,
					caption: video.caption || '',
					author: video.author || '',
					source: video.source ? '/ ' + video.source : '',
					
					align: this.state.align,
					center: center,

					alt: video.alt,

					// width: video.width,
					// height: null,
				};

				const code = $editor.getHTMLByCommand( 'twvideo', data);
				$editor.insertAtCursor(code);
			});

		}
	},

	checkAllVideos (evt) {

		this.setState({
			checkedAll: !this.state.checkedAll
		}, () => ( actionsList.checkAllVideos(this.state.checkedAll) ) 
		);
	},

	clickAlign (align, evt) {
		this.setState({
			align: align
		});

	},

	cbRemoveCheckedVideos () {
		// evt.preventDefault();
		actionsList.removeCheckedVideos();
	},

	clickConfirmDeleteCheckedVideos (evt) {
		evt.preventDefault();

		// # show modal confirmation delete notice
		const selector = 'tw-modal';
		const modalConfirmDeleteCheckedVideos = React.createElement( Modal, {
			selector: 	selector,
			title: 'Подтвердите удаление',
			buttons: {
				cancel: {
					title: 'Отменить',
				},
				submit: {
					title: 'Удалить выбранные',
					cb: 	this.cbRemoveCheckedVideos,
				},
			}}
		, 'Вы действительно хотите удалить выбранные видео?');

		React.render(modalConfirmDeleteCheckedVideos, document.getElementById (selector) );
	},
 
	render() {

		const videoRows = this.state.videos.map( (video, index) => {
			return <VideoRow key={video.videoId} video={video} id={index + 1} align={this.state.align}/>
		});

		const haveChecked = this.state.videos.filter( (video) => (video.checked) );

		const classInsertChecked = classNames({
			'uk-margin-left': true,
			'uk-hidden': !haveChecked.length,
		});

		const style = this.state.videos.length ? {resize: 'vertical', height: 250, maxHeight: 450} : {};

		const checkedVideos = this.state.checked ? `(${this.state.checked})` : '';

		return (
			<div>
				<div className="uk-grid">
					<div className="uk-width-1-1">
						<div className="uk-form">
							<div className="uk-margin-left uk-form-row">
								<input 
									type="checkbox"
									checked={this.state.checkedAll && this.state.checked}
									onChange={this.checkAllVideos} />
							
								<span className={classInsertChecked}>
									<button
										onClick={this.clickInsertChecked}
										className="uk-button uk-button-success"
										type="button"
										title="вставить выбранные изображения в текст"
										data-uk-tooltip>
										<i className="uk-icon-photo" /> 
										<span className="uk-hidden-small uk-margin-small-left">вставить выбранные</span>
										<span className="uk-margin-small-left">{checkedVideos}</span>
									</button>
								</span>
								<span className={classInsertChecked}>
									<button
										onClick={this.clickConfirmDeleteCheckedVideos}
										className="uk-button"
										type="button"
										title="удалить выбранные изображения из альбома"
										data-uk-tooltip>
										<i className="uk-icon-trash-o" /> 
										<span className="uk-hidden-small  uk-margin-small-left">удалить выбранные</span>
										<span className="uk-margin-small-left">{checkedVideos}</span>
									</button>
								</span>
								<div data-uk-button-radio className="uk-button-group uk-align-right uk-margin-remove uk-margin-large-right">
									<button onClick={this.clickAlign.bind(null, 'left')} className="uk-button"><i className="uk-icon-align-left" /></button>
									<button onClick={this.clickAlign.bind(null, 'center')} className="uk-button"><i className="uk-icon-align-center" /></button>
									<button onClick={this.clickAlign.bind(null, 'right')} className="uk-button"><i className="uk-icon-align-right" /></button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="uk-scrollable-box uk-margin-small-top" style={style}>
					<ul className="uk-list uk-list-striped">
						{videoRows}
					</ul>
				</div>
			</div>
		);
	}
});
// -------------------------------------------------------------------------------------

module.exports = VideoListPanel;
