const React = require('react');
const classNames = require('classnames');
// const Reflux = require('reflux');

const VideoPreviewList = require('./VideoPreviewList');

const actions = require('./_actionsVideoPreview');
const store = require('./_storeVideoPreview'); 

// ----------------------------------------------------------------------------------------------------------
const VideoUrl = React.createClass({

	getInitialState() {
		return {
			inputUrl: '',
			disabledButton: true
		};
	},

	filterYoutubeLink (link) {
		const filter = /^(http|https):\/\/(?:www\.)?youtube.com\/watch\?(?=.*v=[a-zA-Z0-9._%-]+)(?:\S+)?$/;
		// # /^(http|https):\/\/(?:www\.)?youtube.com\/watch\?(?=.*v=\w+)(?:\S+)?$/ ;
		return filter.test(link);
	},

	onChangeInputUrl (e) {
		e.preventDefault();

		this.setState({inputUrl: e.target.value});
		
		// покажем/скроем кнопку Добавить инпута ссылки на видео
		const $btn = $('#btn-load-url-video');
		
		// console.log ('#btn-load-url data-visible', $btn.data('visible'));

		if (e.target.value.length > 0) {

			if ($btn.data('visible') === 'off') {
				$btn.data('visible', 'on');
				this.setState({disabledButton: false});
			}	

		} else {

			$btn.data('visible', 'off');
			this.setState({disabledButton: true});
		}
	},

	addVideoLink (e) {
		e.preventDefault();

		if ( (this.state.inputUrl !== '') && (this.filterYoutubeLink(this.state.inputUrl)) ) { 

			// # todo получим картинку превью видео по ссылке и добавим ее в текущий спиоск картинок
			// # получим видео id
			let image = {};
			const urlMatch = this.state.inputUrl.match(/^[^v=]+v.(.{11}).*/);
			
			if (urlMatch) {
				
				const videoId = urlMatch[1];

				//  проверим дубликаты и количество
				const videos = store.getVideos();
				if (videos.length < 5 ){

					const twins = videos.filter( v => v.id == videoId );
					if (!twins.length) {
						// формируем ссылки на превьшки видео разных размеров по схеме
						const url = "http://img.youtube.com/vi/" + videoId;
						const video = {
							id: videoId,
							video: this.state.inputUrl,
							preview: url + '/default.jpg'
						};
						// # preview: url + '/sddefault.jpg' # 640x480
						// # 1: url + '/hqdefault.jpg' # 480x360
						// # 2: url + '/mqdefault.jpg' # 320x180
						// # 3: url + '/default.jpg'   # 120x90
						actions.addVideo(video, 'video');

					} else {
						$.UIkit.notify( '<i class="uk-icon-warning"></i> Нельзя добавлять одинаковые видео!', {
							status: 'warning',
							timeout: 3500,
							pos: 'top-right'
						});
					}
				} else {
					$.UIkit.notify( '<i class="uk-icon-warning"></i> Можно добавить не больше 5 видео!', {
						status: 'warning',
						timeout: 3500,
						pos: 'top-right'
					});
				}
			}

			this.setState({ 
				inputUrl: '',
				disabledButton: true
			});

			$('#btn-load-url-video').data('visible', 'off');

		} else {

			$.UIkit.notify( '<i class="uk-icon-warning"></i> Неправильная ссылка на Youtube!', {
				status: 'warning',
				timeout: 3500,
				pos: 'top-right'
			});
		}
	},

	render() {
		
		const classAddUrlButton = classNames({
			'uk-button': true,
			'uk-button-primary': true,
			'uk-align-right': true,
			'uk-margin-small-top': true,
			'uk-hidden': this.state.disabledButton 
		});
				
		return (
			<div className="uk-form-row uk-margin-bottom">
				<div className="uk-form-controls">
					<input
						onChange={this.onChangeInputUrl}
						type="text"
						value={this.state.inputUrl}
						autoFocus 
						placeholder="Вставьте ссылку на видео YouTube..." 
						className="uk-width-medium-4-5  uk-margin-small-top" />
					<button 
						id="btn-load-url-video"
						onClick={this.addVideoLink}
						className={classAddUrlButton}
						data-visible="off">
						Добавить
					</button>
				</div>
			</div>
		);
	}
});

module.exports = VideoUrl;

