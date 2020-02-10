$(document).ready(function() {
	"use strict";
	
	var imgSize = 32;
	var defaultKey = "Default";
	var defaultNickname = "Me";
	var defaultAvatar = "img/avatar/default.jpg";
	var defaultBubble = "none";
	var defaultRank = "well1";
	var defaulrBubbleSrc = "img/bubble/iphone10.png";

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
		this._img = data.avatar.length ? URL.createObjectURL(data.avatar[0]) : defaultAvatar;
		this._msgNum = 0;

	}

	var Rank = function(data){
        this._rank = data.rank;
    }
    var Bubble = function(data){
	    this._scr = data.bubblesrc;
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
				.addClass("avatar-container")
			)
			.append(New("td")
				.append(New("div")
					.addClass("nickname")
					.text(this._nick)
					.append(New("span")
						.addClass("rank")
						.text(this._rank)
					)
				)
				.append(New("div")
					.addClass("message")
					.text(message)
				)
			);
	}
	
	var roleData = {};
	var rankData = {};
    var bubbleData = {};

	var addRole = function(nickname, data) {
		var newRole = new Role(data);
		var encoded = encodeURIComponent(nickname);
		if (roleData[encoded]) {
			roleData[encoded].finalize();
		} else {
			$("#role").append(New("option").val(encoded).text(nickname));
		}
		roleData[encoded] = newRole;
	}

	var addRank = function(rank,data){
		var newRank = new Rank(data);
		var encoded = encodeURIComponent(rank);
		if(rankData[encoded]){
			rankData[encoded].finalize();
		}else{
			$("#rank").append(New("option").val(encoded).text(rank));
		}
		rankData[encoded] = newRank;
	}
    var addBubble = function(bubble,data){
        var newBubble = new Bubble(data);
        var encoded = encodeURIComponent(bubble);
        if(bubbleData[encoded]){
            bubbleData[encoded].finalize();
        }else{
            $("#select_bubble").append(New("option")
                .append(New("img").val(encoded).src="bubble")
            );
        }
        rankData[encoded] = newRank;
    }

	var removeRank = function(rank) {
		if (rankData[rank]) {
			if (rank === defaultRank) {
				alert("You can't delete default rank!");
				return;
			}
			rankData[rank].finalize();
			$("#rank").children('[value="' + encodeURIComponent(rank) + '"]').remove();
			delete rankData[rank];
		}
	}

	var removeRole = function(nickname) {
		if (roleData[nickname]) {
			if (nickname === defaultKey) {
				alert("You can't delete default role!");
				return;
			}
			roleData[nickname].finalize();
			$("#role").children('[value="' + encodeURIComponent(nickname) + '"]').remove();
			delete roleData[nickname];
		}
	}
	
	var sendMessage = function(nickname, message) {
		$("#conversation").append(roleData[nickname].createMessage(message));
	}
	
	$("#avatar-select-button").on("click", function() {
		$("#avatar").click();
	});
	
	$("#avatar").on("change", function() {
		var files = this.files;
		var preview = $("#avatar-preview").get(0);
		if (files.length) {
			preview.src = window.URL.createObjectURL(files.item(0));
		} else {
			preview.src = defaultAvatar;
		}
	});
	
	$("#style").on("submit", function(e) {
		e.preventDefault();
		addRole($("#nickname").val(), formData($("#style").get(0)));
	})

	$("#rank_form").on("submit", function(e) {
		e.preventDefault();
		addRank($("#rank").val(), formData($("#rank_forme").get(0)));
	})

	$("#remove-role").on("click", function() {
		removeRole($("#role").val());
	});

	$("#remove-rank").on("click", function() {
		removeRank($("#rank").val());
	});

	$("#send-message").on("submit", function(e) {
		e.preventDefault();
		sendMessage($("#role").val(), $("#message").val());
	});
	
	$("#avatar-preview").attr("src", defaultAvatar);
	
	addRole(defaultKey, {
		avatar: [],
		bubble: defaultBubble,
		nickname: defaultNickname,
		rank: defaultRank,
        bubblesrc: defaulrBubbleSrc
	});
	addRank(defaultRank, {
		avatar: [],
		bubble: defaultBubble,
		nickname: defaultNickname,
		rank: defaultRank,
        bubblesrc: defaulrBubbleSrc
	});
	$(":radio").click(function(){
		var if_bubble = $('input:radio[name="bubble"]:checked').val();
		if(if_bubble === 'other'){
			$("#select_label_bubble").show();
			$("#select_bubble").show();
			$("#bubble_form").show();
		}else{
			$("#select_label_bubble").hide();
			$("#select_bubble").hide();
			$("#bubble_form").hide();
		}
	});
});