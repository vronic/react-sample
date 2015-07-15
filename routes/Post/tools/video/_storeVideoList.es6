const Reflux = require('reflux');
const actions = require('./_actionsVideoList');
const { baseUrl, notify} = require('../utils');
const assign = require('object-assign');

// ===============================================================================================
const VideoListStore = Reflux.createStore({

	listenables: actions,

	init() {
        this.videos = [];
        this.hash = $('#tw-publications').attr('media-index');
        this.token = $('#tw-publications').data('csrf-token');
    },

    getVideos () {
    	return this.videos;
    },

    onSaveEditField (params) {
        const url = baseUrl() + 'api/v2/article/video/' + params.field;
        const data = assign(params, {
            hash: $('#tw-publications').attr('media-index'), //this.hash, 
            token: this.token});

        $.post(url, data)
        .done((response, xhr) => {

            // console.log('onSaveEditField - post.done - response', response);

            if(response.code === 200) {
                let index;
                this.videos.filter ( (v, ind) => {

                    if (v.id == response.data.id) {
                        index = ind;
                    }
                    return !!(v.id == response.data.id);
                });

                this.videos[index][params.field] = response.data.value;
                this.trigger(this.videos);
            }
        })
        .fail((xhr, status, err) => {
            console.log('onSaveEditField - post.fail', status, err);
        });
    },

    onCheckVideo (id, checked) {
        let index;
        this.videos.filter ( (v, ind) => {

            if (v.id == id) {
                index = ind;
            }
            return !!(v.id == id)
        });
        this.videos[index].checked = checked;
        this.trigger(this.videos);
    },


    onCheckAllVideos(checked) {

        this.videos.forEach( (video) => video.checked = checked);
        this.trigger(this.videos);
    },

    onClearVideos() {
        this.videos.length = 0;
        this.trigger(this.videos);
    },

    onRemoveVideo (id) {
        const url = baseUrl() + 'api/v2/article/video/delete/' + id;
        const data = {
            hash: $('#tw-publications').attr('media-index'), //this.hash,
            token: this.token
        };

        $.get(url, data)
        .done( (response, xhr) => {

            if(response.code == 200 ){
                // найдем индекс картинки в this.images по image.id и удалим картинку из стора
                let index;
                this.videos.filter ( (v, ind) => {

                    if (v.id == id) {
                        index = ind;
                    }
                    return !!(v.id == id)
                });

                this.videos.splice(index, 1);
                this.trigger(this.videos);
            }
        });
    },

    onRemoveCheckedVideos () {
        let checkedVideosId = this.videos
        .filter( (video) => (video.checked === true) )
        .map( (video) => (video.id));

        checkedVideosId.forEach( (id) => (this.onRemoveVideo(id)));
    },

    onLoadVideos () {
        const url = baseUrl() + 'api/v2/article/videos';
        const data = {
            hash: $('#tw-publications').attr('media-index'), //this.hash,
            token: this.token,
        };
        $.get(url, data)
        .done((response, xhr) => {
            if(response.code === 200) {
                this.videos.length = 0;
                response.data.forEach( (video) => {
                    video.checked = false;
                    this.videos.push(video);
                });

                actions.loadVideos.completed(this.videos.length);
                this.trigger(this.videos);
            }
        })
        .fail((xhr, status, err) => {
            console.log('saveVideos - post.fail', status, err);
        });

    },

    onSaveVideos (videos) {
        const notifyId = notify({msg: 'Сохраняются ссылки на видео...', info: ''}, 'info', 0);
        const url = baseUrl() + 'api/v2/article/video';
        const data = {
            hash: $('#tw-publications').attr('media-index'), //this.hash,
            token: this.token,
            videos: videos
        };
        $.post(url, data)
        .done((response, xhr) => {
            if(response.code === 200) {
                if (notifyId) {notifyId.close();}
                notify({ msg: 'Ссылки на видео сохранены!', info: '' }, 'success', 2500);
                actions.saveVideos.completed();
            }
        })
        .fail((xhr, status, err) => {
            console.log('saveVideos - post.fail', status, err);
        });
    },
});

module.exports = VideoListStore;
