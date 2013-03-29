$(document).on('ready', function(){
	$('html').niceScroll({
		spacebarenabled: false
	});

	$(document).pjax('a', '#content-wrap');

	$(document).on('submit', 'form', function(event) {
	 	$.pjax.submit(event, '#content-wrap')
	});
});

$(document).on('ready pjax:success', function(){
	$('html').getNiceScroll().resize();

	var jupinputsArgs = {
		select: { 
			toggleClass: 'btn-group', 
			toggleValueClass: 'btn split', 
			toggleHandle: true,
			toggleHandleClass: 'btn handle' 
		}, 
		checkbox: {
			checkedClass: 'typicn tick'
		} 
	};

	$('select, input').jupinputs(jupinputsArgs);

	$('.dashboard-table').increditable({
		reloaded: function(table){
			$('.dashboard-table-data').stupidtable();
			$(table).find('select, input').jupinputs(jupinputsArgs);
		}
	});

	$('.editorial').editorial({buttonClass: 'typogram'});

	/*

	$()

	new ajaxLoader('#content-wrap', {
		siteUrl: 'http://localhost/dev',
		requestDone: function(){
			$('select, input').jupinputs(jupinputsArgs);

			$('.dashboard-table').increditable({
				reloaded: function(table){
					$('.dashboard-table-data').stupidtable();
					$(table).find('select, input').jupinputs(jupinputsArgs);
				}
			});

			$('.editorial').editorial({buttonClass: 'typogram'});
		}
	});

	

    */

	/*
	var uploader = new qq.FileUploader({
		debug: true,
	    // pass the dom node (ex. $(selector)[0] for jQuery users)
	    element: $('#file-uploader')[0],
	    // path to server-side upload script
	    action: 'http://localhost/dev/dashboard/upload'
	}); 
	*/
});
