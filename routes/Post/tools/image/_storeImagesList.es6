const Reflux = require('reflux');
const ImagesListActions = require('./_actionsImagesList');
const assign = require('object-assign');

// import { _getBaseUrl, _notify }  from '../util';

//---------------------------------------------------------------------------------------
const imagesListStore = Reflux.createStore({

	listenables: ImagesListActions,

	init() {
        this.images = [];
        this.hash = $('#tw-publications').attr('media-index');
        this.token = $('#tw-publications').data('csrf-token');
    },

	getImages() {
		return this.images;
	},

	onSaveEditField (params) {
		const url = _getBaseUrl() + 'api/v2/article/image/' + params.field;
		const data = assign(params, {
			hash: $('#tw-publications').attr('media-index'), //this.hash, 
			token: this.token});

		$.post(url, data)
    	.done((response, xhr) => {

    		// console.log('onSaveEditField - post.done - response', response);

			if(response.code === 200) {
				let index;
				this.images.filter ( (img, ind) => {

					if (img.id == response.data.id) {
						index = ind;
					}
					return !!(img.id == response.data.id);
				});

				this.images[index][params.field] = response.data.value;
				this.trigger(this.images);
			}
		})
		.fail((xhr, status, err) => {
			console.log('onSaveEditField - post.fail', status, err);
		});
	},

	onCheckImage (id, checked) {
		let index;
		this.images.filter ( (img, ind) => {

			if (img.id == id) {
				index = ind;
			}
			return !!(img.id == id)
		});
		this.images[index].checked = checked;
		this.trigger(this.images);
	},


	onCheckAllImages(checked) {

		this.images.forEach( (image) => image.checked = checked);
		this.trigger(this.images);
	},

	onClearImages() {
		this.images.length = 0;
		this.trigger(this.images);
	},

    onRemoveImage (id) {
    	const url = _getBaseUrl() + 'api/v2/article/image/delete/' + id;
		const data = {
			hash: $('#tw-publications').attr('media-index'), //this.hash,
			token: this.token
		};

		$.get(url, data)
    	.done( (response, xhr) => {

    		if(response.code == 200 ){
	    		// найдем индекс картинки в this.images по image.id и удалим картинку из стора
	    		let index;
				this.images.filter ( (img, ind) => {

					if (img.id == id) {
						index = ind;
					}
					return !!(img.id == id)
				});

				this.images.splice(index, 1);
				this.trigger(this.images);
			}
    	});
    },

    onRemoveCheckedImages () {
    	let checkedImagesId = this.images
    	.filter( (image) => (image.checked === true) )
    	.map( (image) => (image.id));

    	checkedImagesId.forEach( (id) => (this.onRemoveImage(id)));
    },

    onLoadImages () {

    	const url = _getBaseUrl() + 'api/v2/article/images/list';
		const data = {
			hash: $('#tw-publications').attr('media-index'), //this.hash,
			token: this.token
		};

		$.get(url, data)
    	.done((response, xhr) => {
			if (response.code == 200) {
				let length = (response.data) ? response.data.length : 0;
				if(length) {
					//предварительно очистим список картинок стора
					this.images.length = 0;
					// добавим в список все картинки из результата запроса
					response.data.forEach( (image) => {
						image.checked = false;
						// image.inserted = false;
						this.images.push(image);
					});

					// сгенерим событие change стора картинок для интересующихся
					this.trigger(this.images);
				}
				// для смены значения на ярлыке таба в панели добавления изображений статьи
				ImagesListActions.loadImages.completed(length);
			} else {
				console.log('[load images preview list] -> ', response);
			}
		})
		.fail((xhr, status, err) => {
			console.log('_loadImages - get.fail', status, err);
		});
    },
});

// ---------------------------------------------------------------------------------------
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


module.exports = imagesListStore;
