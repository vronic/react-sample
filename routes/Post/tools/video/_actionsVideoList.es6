const Reflux = require('reflux');


const VideoListActions = Reflux.createActions({

	'loadVideos': { asyncResult: true },
	'saveVideos': { asyncResult: true },
	'removeVideo': { asyncResult: true },

	'saveEditField': { asyncResult: true },
	'cancelEditField': {},

	'checkVideo': {},
	'checkAllVideos': {},
	'removeCheckedVideos': {},
});

module.exports = VideoListActions;
