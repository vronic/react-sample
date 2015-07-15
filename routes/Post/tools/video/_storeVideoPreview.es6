const Reflux = require('reflux');
const actions = require('./_actionsVideoPreview');

// ===============================================================================================
const VideoPreviewStore = Reflux.createStore({

	listenables: actions,

	init() {
        this.videos = [];
    },

    getVideos () {
    	return this.videos;
    },

    clearVideos () {
    	this.videos.length = 0;
    	this.trigger(this.videos);
    },

    onAddVideo (video) {
    	this.videos.push(video);
    	this.trigger(this.videos);
    },

    onRemoveVideo (index) {
    	this.videos.splice(index, 1);
    	this.trigger(this.videos);
    },


});

module.exports = VideoPreviewStore;
