jQuery(document).ready(function($){

	$('html').niceScroll({
		spacebarenabled: false
	});

	$("table.sortable").stupidtable();
	$('table.sortable').increditable();

	$('.editorial').editorial({buttonClass: 'typogram'});

	var uploader = new qq.FileUploader({
	    // pass the dom node (ex. $(selector)[0] for jQuery users)
	    element: $('#file-uploader')[0],
	    // path to server-side upload script
	    action: '/dashboard/upload'
	}); 

});
