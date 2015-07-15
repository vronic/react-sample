
var React = require('react');
var classNames = require('classnames');

var Reflux = require('reflux');

// UploadActions 		= require '../reflux/actions.upload'
// UploadStore 		= require '../reflux/store.upload'

var ImagesActions		= require('./_actionsImages');
// FindImageLinkMixin 	= require '../mixins/find.image.link'


// ===============================================================================================
var TWImagesUrl = React.createClass({
//===============================================================================================

	// mixins: [
		// FindImageLinkMixin,
		// Reflux.listenTo(UploadActions.closeImageUploadPanel, "onCloseImageUploadPanel")
	// ],

	getInitialState() {
		return {
			url_btn_visible: 	false,
			inputUrl: 			''
		};
	},

	// при закрытии панели очистим поле ввода ссылки на картинку
	onCloseImageUploadPanel() {
		// @setState inputUrl: ''
		// $('#btn-load-url').data('visible', 'off')
		// @setState url_btn_visible: false
	},

	handleInputUrl(e) {
		e.preventDefault();

		this.setState({inputUrl: e.target.value});

		// покажем/скроем кнопку Загрузить инпута ссылки на картинку 
		var $btn = $('#btn-load-url');
		if (e.target.value.length > 0) {
			if ($btn.data('visible') === 'off') {
				$btn.data('visible', 'on');
				this.setState({url_btn_visible: true});
			}
		}
		else {
			$btn.data('visible', 'off');
			this.setState({url_btn_visible: false});
		}
	},

	addImageLink (e) {
		e.preventDefault();
		// e.stopPropagation()

		if (this.state.inputUrl !== '') {
			var arrayLinkWithComment = this._findImageLink(this.state.inputUrl.substr(0, 1000).trim());
			arrayLinkWithComment.pop(); // удалим пустой элемент - коммент без ссылок
			// покажем панель загрузки картинок если есть ссылки на картинки
			if (arrayLinkWithComment.length) {
				// по найденным ссылкам загружаем картинки
				for (var link of arrayLinkWithComment) {
					ImagesActions.addImage(link, 'url');
					// console.log('_findImageLink', link);
				}
			}
			this.setState({ 
				inputUrl: '',
				url_btn_visible: false
			});
			$('#btn-load-url').data('visible', 'off');
		}
	},

	_findImageLink (text) {
		var i, imgStamp, j, len, len1, link, links, notImgStamp, splitText, textWithoutLink, word, wordWithLink, wordWithoutLink, words;
		imgStamp = function(word) {
			return (((0 === word.indexOf('http://')) || (0 === word.indexOf('https://'))) && (~word.indexOf('.jpg', word.length - 4))) || (((0 === word.indexOf('http://')) || (0 === word.indexOf('https://'))) && (~word.indexOf('.jpeg', word.length - 5))) || (((0 === word.indexOf('http://')) || (0 === word.indexOf('https://'))) && (~word.indexOf('.png', word.length - 4))) || (((0 === word.indexOf('http://')) || (0 === word.indexOf('https://'))) && (~word.indexOf('.gif', word.length - 4)));
		};
		notImgStamp = function(word) {
			return (!(((0 === word.indexOf('http://')) || (0 === word.indexOf('https://'))) && ~word.indexOf('.jpg', word.length - 4))) && (!(((0 === word.indexOf('http://')) || (0 === word.indexOf('https://'))) && ~word.indexOf('.jpeg', word.length - 5))) && (!(((0 === word.indexOf('http://')) || (0 === word.indexOf('https://'))) && ~word.indexOf('.png', word.length - 4))) && (!(((0 === word.indexOf('http://')) || (0 === word.indexOf('https://'))) && ~word.indexOf('.gif', word.length - 4)));
		};
		splitText = text.split(' ');
		wordWithLink = splitText.filter(imgStamp);
		links = [];
		if (wordWithLink) {
			for (i = 0, len = wordWithLink.length; i < len; i++) {
				link = wordWithLink[i];
				links.push(link);
			}
		}
		wordWithoutLink = splitText.filter(notImgStamp);
		words = [];
		if (wordWithoutLink) {
			for (j = 0, len1 = wordWithoutLink.length; j < len1; j++) {
				word = wordWithoutLink[j];
				words.push(word);
			}
		}
		textWithoutLink = wordWithoutLink ? words.join(' ') : "";
		links.push(textWithoutLink);
		return links;
	},

	render() {

		var classInputUrlButton = classNames({
			'uk-button':				true,
			'uk-button-primary': 		true,
			'uk-align-right':			true,
			'uk-margin-small-top':		true,
			'uk-hidden':				!this.state.url_btn_visible 
		});

		return (
			<div className="uk-form-row">
				<div className="uk-form-controls">
					<input
						id="input_url_image_upload_panel"
						onChange={this.handleInputUrl}
						type="text"
						value={this.state.inputUrl}
						placeholder="Вставьте ссылку на изображение"
						className="uk-width-medium-4-5  uk-margin-small-top" />
					<button 
						id="btn-load-url"
						onClick={this.addImageLink}
						className={classInputUrlButton}
						data-visible="off">
						Добавить
					</button>
				</div>
			</div>
		);
	}
});		

module.exports = TWImagesUrl;