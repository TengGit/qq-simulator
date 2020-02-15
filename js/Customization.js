// This document is about customization
$(document).ready(function() {
    var switchbg=1;
    $(':radio[name="if_bg"]').change(function(){
        if ($(':radio[name="if_bg"]:checked').val() === "color"){
            switchbg=0;

        }else {
            switchbg=1;
        }
    });
    $("#bg_set").click(function(){
        if(switchbg===1){
            $("body").css({
                "background": "url(\"" + $("#bg_preview").attr("src") + "\")  no-repeat center top"
            });
        }else{
            var bgcolor = $("#bg_color").val();
            $("body").css("background",bgcolor);
        }

    });
    $("#select_bg_img").click(function(){
        $("#bg_img").click();
    });
    $("#bg_preview").attr("src", "./img/customization/default.jpg");
    $("#bg_img").change(function () {
        var files = this.files;
        var preview = $("#bg_preview").get(0);
        if (files.length) {
            preview.src = window.URL.createObjectURL(files.item(0));
        } else {
            preview.src ="./img/customization/default.jpg";
        }
    })
});