
export function baseUrl() {

  return  document.body.getAttribute('data-url'); //document.location.origin + document.location.pathname #
}

export function notify (response, type='info', timeout=2500) {
	const icon = type === 'info' ? '<i class="uk-icon-spin uk-icon-spinner uk-text-large"></i> &nbsp; &nbsp;' : '';
	const msg = `<div class='uk-text-center uk-text-bold'>${icon} ${response.msg} </div><div class='uk-text-center'> ${response.info} </div>`;

	return UIkit.notify(msg, {
		'status': type,
		'pos': 'top-right',
		'timeout': timeout
	});
}