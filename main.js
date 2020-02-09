$(document).ready(function() {
	"use strict";
	
	var imgSize = 32;
	
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
			case "SELECT":
				/* TODO: Implement later */
				break;
			default:
				result[node.name] = node.value;
				break;
			}
		}
		return result;
	}
	
	var New = function(name) {
		return $(document.createElement(name));
	}
	
	var Role = function(data) {
		this._nick = data.nickname;
		this._img = data.avatar.length ? URL.createObjectURL(data.avatar[0]) : "default.jpg";
		this._msgNum = 0;
	}
	
	Role.prototype.finalize = function() {
		if (this._msgNum === 0 && this._img !== "default.jpg") URL.revokeObjectURL(this._img);
	}
	
	Role.prototype.createMessage = function(message) {
		return New("tr")
			.append(New("td")
				.append(New("img")
					.addClass("avatar-image")
					.attr({
						"width": imgSize,
						"height": imgSize,
						"src": this._img
					})
				)
			)
			.append(New("td")
				.append(New("div")
					.addClass("nickname")
					.text(this._nick)
				)
				.append(New("div")
					.addClass("message")
					.text(message)
				)
			);
	}
	
	var roleData = {};
	
	var addRole = function(nickname, data) {
		var newRole = new Role(data);
		if (roleData[nickname]) {
			roleData[nickname].finalize();
		} else {
			$("#role").append(New("option").val(nickname).text(nickname));
		}
		roleData[nickname] = newRole;
	}
	
	var removeRole = function(nickname) {
		roleData[nickname] && (roleData[nickname].finalize(), delete roleData[nickname]);
	}
	
	var sendMessage = function(nickname, message) {
		$("#conversation").append(roleData[nickname].createMessage(message));
	}
	
	$("#avatar").on("change", function() {
		var files = this.files;
		var preview = $("#avatar-preview").get(0);
		if (files.length) {
			preview.src = window.URL.createObjectURL(files.item(0));
		} else {
			preview.src = "default.jpg";
		}
	});
	
	$("#add-role").on("click", function() {
		addRole($("#nickname").val(), formData($("#style").get(0)));
	})
	
	$("#remove-role").on("click", function() {
		removeRole($("#role").val());
	});
	
	$("#send").on("click", function() {
		sendMessage($("#role").val(), $("#message").val());
	});
});