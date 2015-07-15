
const Reflux = require('reflux');
const ImageActions = require('./_actionsImages');

// ===============================================================================================
const imagePreviewStore = Reflux.createStore({

	listenables: ImageActions,

	init() {
        this.images = [];
        this.hash = $('#tw-publications').attr('media-index');
        this.token = $('#tw-publications').data('csrf-token');
    },

	getImages() {
		return this.images;
	},

	onClearImages() {
		this.images.length = 0;
		this.trigger(this.images);
	},

    onRemoveImage (index) {
    	this.images.splice(index, 1);
    	this.trigger(this.images);
    },

    _removeImageByKey (key) {

    	this.images.forEach( (obj, ind) => { if (obj.key === key) this.onRemoveImage(ind); } );
    	return false;
    },

    onAddImage (img, type) {

		let image;
		image = {};
		image.type = type;
		image.key = _generateId();

		if (this.images.length < 100) {

			if (!_isImageInList(img, type)) {
				switch (type) {

					case 'url':
						_getDimensionImageByUrl(img, (w, h) => {
							image.height = h;
							image.width = w;
							this.trigger(this.images);
						});

						image.height = '_';
						image.width = '_';

						image.src = img;
						this.images.push(image);
						// console.log('url img', image);
						this.trigger(this.images);
						break;

					case 'file':
						_getDimensionImageByFile(img, (err, info) => {
							if (!err) {
								image.height = info.height;
								image.width = info.width;
							}
						});

						image.src = img;
						// console.log('file img', image);
						this.images.push(image);

						this.trigger(this.images);
						break;

					default:
						break;
				}
			} else {
				_notify({
					msg: 'Одинаковые изображения не будут добавлены',
					info: ''
				}, 'warning', 4500);
			}
		} else {
			_notify({
				msg: 'Можно добавить не больше 100 изображений',
				info: ''
				}, 'warning', 4500);
		}
    },

    onUploadImages () {

    	// console.log('onUploadImages', this.images);

		const images_url = this.images.filter( (obj, ind) =>  !!(obj.type === 'url') );
		const images_file = this.images.filter( (obj, ind) =>  !!(obj.type === 'file') );

		const idNotify = _notify({msg: 'Изображения загружаются...', info: ''}, 'info', 0);

		let files_ready = false;
		let urls_ready = false;

		const message_success = 'Изображения успешно загружены!';

		if (images_file.length) {

			let files = images_file.map( (image) => image.src );

			FileAPI.upload({
				url: _getBaseUrl() + 'api/v2/article/images/upload',
				files: files,
				data: {
					token: imagePreviewStore.token,
					hash: $('#tw-publications').attr('media-index') //imagePreviewStore.hash
				},

				progress: (evt) => console.log('upload progress ', evt.loaded / evt.total * 100),

				complete: (err, xhr) => {

					if( !err ){

						files_ready = true;

						images_file.forEach( (obj) => this._removeImageByKey(obj.key));

						if (urls_ready) {
							ImageActions.uploadImages.completed(99);
						}

						// если есть еще ссылки то не будем закрывать уведомление о загрузке
						if(urls_ready) {

							if (idNotify) {
								idNotify.close();
							}
							_notify({msg: message_success, info: ''}, 'success', 2500);
						}
					}
				}
			});
		} else {
			files_ready = true;
		}

		if (images_url.length) {

    		const url = _getBaseUrl() + 'api/v2/article/images/upload/url';
			const msg = {
				token: this.token,
				hash: $('#tw-publications').attr('media-index'), //this.hash,
				urls: images_url
			};
			// отправим урлы картинок
			$.post(url, msg)

			.done( (response, xhr) => {
				urls_ready = true;
				// удалим картинки с урлами из стора после успешной загрузки
				images_url.forEach( (obj) => this._removeImageByKey(obj.key));

				if (files_ready) {
				// подадим сигнал об окончании загрузки для разблокировки кнопки
				ImageActions.uploadImages.completed(response.data);
				}

				// закроем уведомление о загрузке картинок
				if(files_ready) {
					if (idNotify) {
							idNotify.close();
						}
					_notify({msg: message_success, info: ''}, 'success', 2500);
				}
			})

			.fail( (xhr, status, err) => ImageActions.uploadImages.failed(status, err));

		} else {
			urls_ready = true;
		}
    },
});

// -------------------------------------------------------------------------------------------
var _getDimensionImageByFile = function (file, cb) {

	FileAPI.getInfo(file, (err, info) => cb(err, info));
};

// -------------------------------------------------------------------------------------------
var _getDimensionImageByUrl = function (src, cb) {

	var img = new Image();
	img.onload = () => cb(img.width, img.height);
	img.src = src;
};

// -------------------------------------------------------------------------------------------
const _generateId = function () {

	let s4, uniqueId;
	s4 = function() {
		let id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		return id;
	};
	uniqueId = s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

	return uniqueId;
};

// -------------------------------------------------------------------------------------------
const _isImageInList = function(image, type) {

	let images, inList;
	inList = false;
	images = [];
	const _images = imagePreviewStore.images;

	switch (type) {
		case 'url':
			_images.forEach(function(img, index) {
				if (img.type === type && img.src === image) {
					images.push(img);
				}
			});
			break;

		case 'file':
			_images.forEach(function(img, index) {
				if (img.type === type && (img.src.name === image.name && img.src.size === image.size)) {
					images.push(img);
				}
			});
			break;

		default:
			break;
	}

	inList = !!(images.length > 0);
	return inList;
};

// -------------------------------------------------------------------------------------------
const _getBaseUrl = function() {
  return  document.body.getAttribute('data-url'); //document.location.origin + document.location.pathname #
};

// -------------------------------------------------------------------------------------------
const _notify = function(response, type, timeout) {
	let icon, msg;
	if (type == null) {
		type = 'info';
	}
	if (timeout == null) {
		timeout = 2500;
	}
	icon = type === 'info' ? '<i class="uk-icon-spin uk-icon-spinner uk-text-large"></i> &nbsp; &nbsp;' : '';
	msg = `<div class='uk-text-center uk-text-bold'>${icon} ${response.msg} </div><div class='uk-text-center'> ${response.info} </div>`;

	return UIkit.notify(msg, {
		'status': type,
		'pos': 'top-right',
		'timeout': timeout
	});
};

module.exports = imagePreviewStore;
