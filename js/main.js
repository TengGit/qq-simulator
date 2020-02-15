$(document).ready(function() {
	"use strict";
	
	var imgSize = 32;
	var defaultKey = "Default";
	var defaultNickname = "Me";
	var defaultAvatar = "img/avatar/default.jpg";
	var defaultBubbleSrc = "img/bubble/iphone10.png";
	var defaultBubble = "none";

	var formData = function(form) {
		var result = {};
		var el = form.elements;
		for (var idx = 0; idx < el.length; idx++) {
			var node = el[idx];
			switch (node.nodeName) {
			case "INPUT":
				switch (node.type) {
				case "radio":
					if (node.checked) {
						result[node.name] = node.value;
					} else if (result[node.name] === undefined) {
						result[node.name] = null;
					}
					break;
				case "file":
					/* FIXME: */
					result[node.name] = node.files;
					break;
				case "checkbox":
					(result[node.name] || (result[node.name] = [])).push(node.value);
					break;
				case "button":
				case "reset":
				case "submit":
					break;
				default:
					result[node.name] = node.value;
					break;
				}
				break;
			case "SELECT":
				result[node.name] = node[node.selectedIndex].value;
				break;
			default:
				result[node.name] = node.value;
				break;
			}
		}
		return result;
	}
	
	var fillForm = function(form, data) {
		var el = form.elements;
		for (var idx = 0; idx < el.length; idx++) {
			var node = el[idx];
			var val = data[node.name];
			if (val === undefined) continue;
			switch (node.nodeName) {
			case "INPUT":
				switch (node.type) {
				case "radio":
					if (node.value === val) {
						node.click();
					}
					break;
				case "checkbox":
					// FIXME: implement later
					if (val.indexOf(node.value)) {
						// check node
					} else {
						// uncheck node
					}
					break;
				case "button":
				case "reset":
				case "submit":
				case "file":
					break;
				default:
					node.value = val;
					break;
				}
				break;
			case "SELECT":
				for (var i = 0; i < node.options.length; i++) {
					if (node.options[i].value === val) {
						node.selectedIndex = i;
						break;
					}
				}
				break;
			default:
				node.value = val;
				break;
			}
		}
	}
	
	var New = function(name) {
		return $(document.createElement(name));
	}
	
	var createMessage = function(style, message) {
		var rankText = "";
		
		var messageDiv = New("div")
			.addClass("message")
			.text(message);
		
		if (style["bubble"] === 'custom') {
			messageDiv.addClass(style["custom_bubble_style"]);
		} else if (style["bubble"] === 'other') {
			messageDiv.css({
				"border-image": "url(\"" + $("#bubble-preview").attr("src") + "\") 8 stretch",
				"background-color": style["bubble_bg_color"]
			}).addClass("custom-bordered");
		}
		
		if (style["rank-style"] !== 'rank') {
			rankText = style["rank-text"];
		}
		
		var item = New("tr")
			.append(New("td")
				.append(New("img")
					.addClass("avatar-image")
					.attr({
						"width": imgSize,
						"height": imgSize,
						"src": $("#avatar-preview").attr("src")
					})
				)
				.addClass("avatar-container")
			)
			.append(New("td")
				.append(New("div")
					.append(rankText.length ?
						New("span")
							.addClass(style["rank-style"])
							.text(rankText) :
						null
					)
					.append(New("span")
						.addClass("nickname")
						.text(style["nickname"])
					)
				)
				.append(messageDiv)
			)
			.append(New("td"))
			.append(New("td")
				.append(New("span")
					.addClass("button")
					.text("Recall")
					.on("click", function() {
						$(this.parentNode.parentNode).after(New("tr")
							.append(New("td")
								.attr("colspan", "3")
								.addClass("recall-container")
								.append(New("span")
									.addClass("recall-message")
									.text(style["nickname"]+"撤回了一条消息")
								)
							)
						).remove();
					})
				)
				.append(New("span")
					.addClass("button")
					.text("Delete")
					.on("click", function() {
						$(this.parentNode.parentNode).remove();
					})
				)
			);
		
		return item;
	}
	
	var roleData = {};

	var addRole = function(presetName, data) {
		var encoded = encodeURIComponent(presetName);
		if (!roleData[encoded]) {
			var roleSelect = $("#role");
			roleSelect.append(New("option").val(encoded).text(presetName)).get(0).selectedIndex = roleSelect.get(0).options.length - 1;
		}
		data.avatar = data.avatar.length ? URL.createObjectURL(data.avatar[0]) : defaultAvatar;
		roleData[encoded] = data;
	}

	var removeRole = function(encodedName) {
		var presetName = decodeURIComponent(encodedName);
		if (roleData[encodedName]) {
			if (presetName === defaultKey) {
				alert("You can't delete default preset!");
				return;
			}
			$("#role").children('[value="' + encodedName + '"]').remove();
			delete roleData[presetName];
		}
	}
	
	var sendMessage = function(message) {
		$("#conversation").append(createMessage(formData($("#style").get(0)), message));
	}
	
	$("#avatar-select-button").on("click", function() {
		$("#avatar").click();
	});

	$("#bubble-select-button").click(function() {
		$("#bubble_image").click();
	});
	$("#bubble_image").change(function () {
		var files = this.files;
		var preview = $("#bubble-preview").get(0);
		if (files.length) {
			preview.src = window.URL.createObjectURL(files.item(0));
		} else {
			preview.src = defaultBubbleSrc;
		}
	})

	$("#bubble-preview").attr("src",defaultBubbleSrc);
	
	$("#avatar").on("change", function() {
		var files = this.files;
		var preview = $("#avatar-preview").get(0);
		if (files.length) {
			preview.src = window.URL.createObjectURL(files.item(0));
		} else {
			preview.src = defaultAvatar;
		}
	});
	
	$("#rank-preset").on("change", function() {
		var li = this.value.split(" ");
		$("#" + li[0]).click();
		$("#rank-text").val(li[1]);
	});
	
	$("#style").on("submit", function(e) {
		e.preventDefault();
		addRole($("#role-name").val(), formData($("#style").get(0)));
	});
	
	$("#role").on("change", function() {
		fillForm($("#style").get(0), roleData[this.value]);
		$("#avatar-preview").attr("src", roleData[this.value]["avatar"]);
	});

	$("#remove-role").on("click", function() {
		removeRole($("#role").val());
	});

	$("#send-message").on("submit", function(e) {
		e.preventDefault();
		sendMessage($("#message").val());
	});
	
	$("#avatar-preview").attr("src", defaultAvatar);
	
	addRole(defaultKey, {
		avatar: [],
		bubble: defaultBubble,
		nickname: defaultNickname,
		rank: "rank-none ",
		"rank-text": "",
		"rank-style": "rank",
		"role-name": defaultKey
	});

	$(":radio").click(function(){
		var if_bubble = $('input:radio[name="bubble"]:checked').val();
		if(if_bubble === 'other'){
			$("#bubble_form").show();
			$("#bubble_form2").hide();
		}else if(if_bubble === 'custom'){
			$("#bubble_form2").show();
			$("#bubble_form").hide();
		}else{
			$("#bubble_form2").hide();
			$("#bubble_form").hide();
		}
	});
});