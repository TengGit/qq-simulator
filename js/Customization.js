// This document is about customization
$(document).ready(function() {
	var defaultBackgroundImage = "./img/customization/default.jpg";

	function useImageAsBackground() {
		$("#bg-color-select").css("display", "none");
		$("#bg-img-select").css("display", "block");
		$("#body_bg").css("background", "url(\"" + $("#bg_preview").attr("src") + "\") center / cover no-repeat");
	}

	function useColorAsBackground() {
		$("#bg-color-select").css("display", "block");
		$("#bg-img-select").css("display", "none");
		$("#body_bg").css("background", $("#bg_color").val());
	}

	$("#color-bg").on("change", useColorAsBackground);

	$("#img-bg").on("change", useImageAsBackground);

    $("#select_bg_img").click(function(){
        $("#bg_img").click();
    });

    $("#bg_preview").attr("src", defaultBackgroundImage);
    $("#bg_img").change(function () {
        var files = this.files;
        var preview = $("#bg_preview").get(0);
        if (files.length) {
            preview.src = window.URL.createObjectURL(files.item(0));
        } else {
            preview.src = defaultBackgroundImage;
        }
		useImageAsBackground();
    })

	$("#bg_color").change(useColorAsBackground);
});