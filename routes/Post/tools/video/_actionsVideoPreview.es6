const Reflux = require('reflux');
// import Reflux from 'reflux';

const VideoPreviewActions = Reflux.createActions({

	'addVideo': {},
	'removeVideo': {},
	'clearVideos': {},
});

module.exports = VideoPreviewActions;
