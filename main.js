$(document).ready(function() {
	$("#avatar").change(function(e) {
		var files = e.target.files;
		if (files.length) {
			$("#avatar-preview").attr("src", window.URL.createObjectURL(files.item(0)));
		}
	});
});