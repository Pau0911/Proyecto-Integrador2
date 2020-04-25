// general
var controller;
var id;
var class_id;

// lessons
var current_lesson;
var unhide_text;
var hide_text;
var confirm_text;

// assignments
var assignment_id;

// quiz configure
var configure_controller;
var configure_id;

// questions configure
var questions_controller;
var questions_id;

// user popups
var disable_user_popups_flag = false;
var user_timer = null;
var user_href = null;

// toggle
var last_toggled_id = null;

// navigation
var hover_timer = null;
var hover_timer_triggered = false;
var hover_tab_id;
var hover_class_id;
var hover_student_class_id;

// click to chat
var chat_alert_displayed = false;
var loaded_sound_manager = false;

// new mobile
var menuStatus;
var shiftContent;
var contentHeight;
var menuContentHeight;

// close facebox after x sec if wanted
var FACEBOX_CLOSING_TIME = 2500;

// for tinymce and popup messages with ajax
var tinyPop = true;
var closeAlertTimer;

//mobile app notifications counter
var mobile_messages_count = 0;
var mobile_notifications_count = 0;

// widget panel original
var context_uri = false;

// new mobile initialization

function initScrollers() {
	menuScroller = new iScroll('menu-content', {vScrollbar: false});
	contentScroller = new iScroll('phone-body', {vScrollbar: false});
}

function init_container_height(){
	setTimeout(function(){
		var container = $('.user #contentWrap');
		var sub_head = $('#contentHeader').length ? $('#contentHeader').outerHeight() : 0;
		var header = $('header').length ? $('header').outerHeight() : 0;
		var footer = $('footer').length ? $('footer').outerHeight() : 0;
		if (navigator.appVersion.indexOf('Trident') > 0) {
			// Will exclude Edge and target IE11
			container = $('#contentWrap');
			header = $('.catalog_class').length > 0 && $('.transparent_header').length == 0 ? $('header').outerHeight() : 0;
		}
		container.css('min-height', 'calc(100vh - ' + (sub_head + header + footer) + 'px)');
	}, 100);
}

function removeScrollers() {
	menuScroller.destroy();
	contentScroller.destroy();
	menuScroller = null;
	contentScroller = null;
}

function refreshScrollers() {
	menuScroller.refresh();
	contentScroller.refresh();
}

$(function() {
	var original_init = $.prototype.init;
	$.prototype.init = function (e, t) {
		$.extend(this, new original_init(e == '#' ? [] : e, t));
	};
	$.prototype.init.prototype = original_init.prototype;
	init_container_height();
});

function updateHeight() {
	shiftContent = (is_mobile_app_mode() ? globalWindowWidth : $(window).width()) - 70;
	contentHeight = (is_mobile_app_mode() ? globalWindowHeight : $(window).height()) - $('#phone-header').height() - $('#phone-footer').height() + 3;
	menuContentHeight = (is_mobile_app_mode() ? globalWindowHeight : $(window).height()) - $('#menu-content').offset().top;

	$("#menu").width(shiftContent);
	$("#mnu-header .nav_search").width(shiftContent - 80);

	$('#phone-body').css('height', contentHeight + 'px');
	$('#menu').css('height', (is_mobile_app_mode() ? globalWindowHeight : $(window).height()) + 'px');
	$('#menu-content').css('height', menuContentHeight + 'px');

	refreshScrollers();
}

function init_mobile() {
	if(!is_mobile_app_mode()){
		$(window).resize(updateHeight);
	}

	setTimeout(function() {
		updateHeight();
	}, 500);

	$("#menu").css('display', 'none');

	$("#btn-menu").click(function() {
		if (menuStatus != true) {
			$("#menu").css('display', 'block');

			$("#wrapper").animate({
				left : shiftContent + "px"
			}, 300, function() {
				menuStatus = true;
				refreshScrollers();
			});

			$("#wrapper #phone-header").animate({
				left : shiftContent + "px"
			}, 300);
			$("#wrapper #phone-footer").animate({
				left : shiftContent + "px"
			}, 300);

			return false;
		} else {
			$("#wrapper").animate({
				left : "0"
			}, 300, function() {
				menuStatus = false;
			});

			$("#wrapper #phone-header").animate({
				left : "0"
			}, 300);

			$("#wrapper #phone-footer").animate({
				left : "0"
			}, 300, function() {
				$("#menu").css('display', 'none');
			});

			return false;
		}
	});

	initScrollers();
	refreshScrollers();
}

function init_log_in() {
	$(".signin").click(function(e) {
		e.preventDefault();
		$("fieldset#signin_menu").toggle();
		$(".signin").toggleClass("menu-open");
		$('#userid').focus();
	});

	$("fieldset#signin_menu").mouseup(function() {
		return false;
	});

	$(document).mouseup(function(e) {
		if ($(e.target).parent("a.signin").length == 0) {
			$(".signin").removeClass("menu-open");
			$("fieldset#signin_menu").hide();
		}
	});
}

// Minimum content height

function init_min_height() {
	if($('#carouselWrap').length == 0){
		update_min_height();
		$(window).resize(update_min_height);
	}

	//Overriding the initial properties from default-styles.css
	$('.catalog_class footer').show();
	$('body.catalog_class').css('overflow', 'auto');
}

function update_min_height() {
	var header = $('header');
	var footer = $('footer');
	var windowHeight = $(window).height() - header.height() - footer.height();
	if($('#calendar2').length && $('table.calendar').hasClass('monthly')) {
		windowHeight = $('#calendar2').outerHeight() + 30 > windowHeight ? $('#calendar2').outerHeight() + 30 : windowHeight;
	}
	// Thin main menu height
	if ($('nav#leftColumn ol.thinMainNav').length)
		$('nav#leftColumn ol.thinMainNav').height($(window).height() - $('header').height());

	if(typeof globalWindowWidth == 'undefined'){
		globalWindowWidth = $(window).width();
	}

	if (/iPad/i.test(navigator.userAgent) && globalWindowWidth > 768 && $('.hasEditor').length) {
		$('#wrapper').css('overflow', 'hidden');
	}
	
	resizeFixedLeftColumn();
	if ($('body').hasClass('section_nav_page')) section_nav_height();
}

// Fixed left column height

function set_vars(){
	window.first_resizeFixedLeftColumn_call = false;
	window.loadFixedLeftColumn = true;
// Vars for fixed grading column defined outside function to prevent shudder in IE11 and Edge
	if ($('.grading_fixed_col').length > 0) {
		window.rightColumn_top = $('.rightColumn').offset().top;
		window.fixed_header_bottom = $('#leftColumn').offset().top + $('#fixedSectionHeader').outerHeight();
	}
}
set_vars();
$(window).on('loadcomplete', function(){
	//added to fix issue where varible where not updated for ajax pages
	set_vars();
});
function fixedLeftColumnHeight(leftcolumn_height) {
	var fixed_nav_bottom = $(window).scrollTop() - ( $('footer').offset().top - globalWindowHeight);

	if (fixed_nav_bottom > 0) {
		if (is_mobile_device()) {
			fixed_nav_bottom = fixed_nav_bottom + ((window.screen.availHeight - globalWindowHeight)/2)
		}
		$('#leftColumn').css('height', leftcolumn_height - fixed_nav_bottom + 2);
	} else {
		$('#leftColumn').css('height', leftcolumn_height + 2);
	}
}

function resizeFixedLeftColumn() {
	if ($('body').hasClass('catalog_class') && $(window).width() >= 768) {
		var header_height = ($('body').hasClass('transparent_header')) ? 0 : $('header').outerHeight();
		var leftcolumn_height = ($('body').hasClass('portal')) ? $(window).height() - $('.portal #contentHeader').outerHeight() - header_height : $(window).height() - header_height;

		// Set bottom of fixed left nav based on footer position
		if (loadFixedLeftColumn == true) {
			setTimeout(function(){
				fixedLeftColumnHeight(leftcolumn_height);
				loadFixedLeftColumn = false
			}, 100);
		} else {
			fixedLeftColumnHeight(leftcolumn_height)
		}
	}

	// Fixed right column height
	if ($('.grading_fixed_col').length > 0) {
		if ($('.grading_fixed_col').css('opacity') == 0) {
			$('.grading_fixed_col').css('opacity','1');
		}

		if ($(window).width() >= 980) {
			var scroll_pos = $('#contentWrap').outerHeight() - globalWindowHeight - $(window).scrollTop() + $('header').outerHeight();

			$('.grading_fixed_col, .column_resize_handle').css('top', rightColumn_top);
			if ($('#fixedSectionHeader').hasClass('student')) {
				// student view - change top according according to scroll position
				var top_pos = $('.rightColumn').offset().top - $(window).scrollTop() - 14;
				if (top_pos > fixed_header_bottom) {
					$('.grading_fixed_col, .column_resize_handle').css('top', top_pos);
				} else {
					// highest top position
					$('.grading_fixed_col, .column_resize_handle').css('top', fixed_header_bottom);
				}
			}

			if (scroll_pos < 0) {
				// Footer is visible
				$('.grading_fixed_col, .column_resize_handle').css('bottom', - scroll_pos + 'px');
			} else {
				// Footer isn't visible
				$('.grading_fixed_col, .column_resize_handle').css('bottom', '0');
			}
		}
	}
}
$(window).scroll(function() {
  if ($('body').hasClass('catalog_class') || $('.grading_fixed_col').length > 0) {
		// Fix scroll position which sometimes breaks NiceScroll on page load.
		if (!first_resizeFixedLeftColumn_call && $(window).scrollTop() > 0) {
			$(window).scrollTop(0);
			first_resizeFixedLeftColumn_call = true;
		}
		resizeFixedLeftColumn();
	}
});

function init_niceScroll() {
  if ($('.grading_fixed_col').length > 0) {
    // Teacher rubric grading pages
    if (is_mobile_device()) {
      $(".grading_fixed_col, .grade-floating-rubric-scroll").css({'-webkit-overflow-scrolling':'touch'});
    } else {
      $(".grading_fixed_col, .grade-floating-rubric-scroll").niceScroll({
        cursorwidth: "7px",
        cursorcolor: "#000",
        cursoropacitymax: 0.4,
        autohidemode: ($('#fixedSectionHeader').hasClass('student') ? true : false),
        railpadding: {top: 2, right: 1, left: 1, bottom: 1},
        nativeparentscrolling: false,
        railalign: (is_rtl_mode() ? 'left' : 'right')
      });
      // Only force show the scrollbar on the teacher view
      if (!$('#fixedSectionHeader').hasClass('student')) {
        $('.nicescroll-rails-vr').addClass('do_not_hide');
      }
    }
  } else {
    // Catalog item and checkout pages
    if (is_mobile_device()) {
      $(".catalog_class #leftColumn").css({'overflow':'auto'});
    } else {
      $(".catalog_class #leftColumn").niceScroll({
        cursorcolor: "#000",
        cursoropacitymax: 0.4,
        cursorborder:"1px solid transparent",
        autohidemode: false,
        railalign: (is_rtl_mode() ? 'left' : 'right')
      });
    }
  }
}

function msgHide(){
	$('div.info:not(.keepopen) + .pageHeading.mobile_only + .optionsRibbon.optionsRight').hide();
	
	if ($('body').hasClass('catalog_class') && $('div.alert_block.info:not(.keepopen)').length > 0 && $(window).width() > $('#wrapper').outerWidth()) {
		$('.catalog_class').addClass('offscreen_nicescroll'); // Hide niceScroll while alert closes and page height changes
	}

	$('div.info:not(.keepopen)').animate({
		height: '0', opacity: '0'
	}, 500, function () {
		$(this).css('display', 'none');
		$('div.info:not(.keepopen) + .pageHeading.mobile_only + .optionsRibbon.optionsRight').css('top', 0).show();
		if ($('body').hasClass('catalog_class')) {
			resizeFixedLeftColumn(); // Resize niceScroll scroll bar after page height change
			$('.catalog_class').removeClass('offscreen_nicescroll'); // remove class
		}
		if ($('#fixedSectionHeader').length) {
			resizeSectionHeader(true);
		}
	});
}

// initialize sound manager

function init_sound_manager(soundHandler) {
	soundManager.setup({
		url: '/flash/soundmanager2.swf?2',
		debugMode: false,
		onready: function() {
			loaded_sound_manager = true;

			soundManager.createSound({
				id : 'user_sound',
				url : '/audio/user.mp3'
			});

			soundManager.createSound({
				id : 'message_sound',
				url : '/audio/message.mp3'
			});

			if (soundHandler){
				soundHandler();
			}
		}
	});
}

// process tables for IE7

function process_tables() {
	$('td[colspan^="100"]').each(function(i) {
		var width = 0;

		$(this).parent().next().children().each(function(j) {
			var colspan = $(this).attr('colspan');
			width += (colspan == null ? 1 : parseInt(colspan));
		});

		$(this).attr('colspan', width);
	});
}

// dynamic site width

function update_site_width() {
	var site_width = (is_mobile_app_mode() ? globalWindowWidth : $(window).width()) - 26;
	$('#footer_center').width(site_width);
}

function init_update_site_width() {
	$('#main_content, #footer_center').css('max-width', (1400 - 26) + 'px'); // #main_content padding (24px) + #main_content border = 26
	$('#logo_block').css('margin-left', 13 + 'px'); // half of padding + border above
	$('#main_content').css('margin-left', '0px');
	$('#buttons_right, #main_content').css('margin-right', '0px');
	update_site_width();
	$(window).resize(update_site_width);
}

// navigation

function init_navigation() {
	if ($('html').hasClass("iPad")) {
		$('#main_nav li').click(function(event) {
			$(this).parent().find('.highlight').removeClass('highlight');
			$(this).siblings().find('.dropdown').hide();
			$(this).find('a:first').addClass('highlight');

			if ($(this).find(".dropdown").is(':hidden')) {
				$(this).find(".dropdown").show();
			} else {
				$(this).find(".dropdown").hide();
				$(this).parent().find('.highlight').removeClass('highlight');
			}

			event.stopPropagation();
		});
	} else {
		$('ul#main_nav > li').hover(function() {
			$(this).find('a:first').addClass("highlight");
			$(this).find('.dropdown').stop(true, true).show();
		}, function() {
			$(this).find('a:first').removeClass("highlight");
			$(this).find('.dropdown').stop(true, true).hide();
		});
	}

	// click inside drop down on right
	$('#advSearchHolder').click(function() {
		if ($('.dropdownOn').length == 0) {
			$('#advSearchHolder').removeClass('dropdownOff').addClass('dropdownOn');

			if ($('.advSearchOn').length != 0) {
				$('.search').removeClass('advSearchOn').addClass('advSearchOff');
			}

			return false;
		}
	});

	$('.adminDropdown').click(function(event) {
		if ($(this).find(".header_dropdown").is(':hidden')) {
			$(this).find(".header_dropdown").show();
			$('#leftColumn .dropdown_holder').removeClass('dropdownOff').addClass('dropdownOn');
		} else {
			$(this).find(".header_dropdown").hide();
			$('#leftColumn .dropdown_holder').removeClass('dropdownOn').addClass('dropdownOff');
		}

		event.stopPropagation();
	});

	$('.search').click(function(event) {
		if ($('.advSearchOn').length == 0) {
			$('.search').removeClass('advSearchOff').addClass('advSearchOn');

			if ($('.dropdownOn').length != 0) {
				$('#advSearchHolder').removeClass('dropdownOn').addClass('dropdownOff');
			}

			$('#search_phrase').focus();
			return false;
		}
		event.stopPropagation();
	});

	$("#wrapper").click(function() {
		if ($('.dropdownOn').length != 0) {
			$('.dropdown_holder').removeClass('dropdownOn').addClass('dropdownOff');
			$('#advSearchHolder').removeClass('dropdownOn').addClass('dropdownOff');
			$('#leftColumn .dropdown_holder').removeClass('dropdownOn').addClass('dropdownOff');
			$('.header_dropdown').hide();
			$('.assignment_type').removeClass('dropdownOn');
		}

		if ($('.advSearchOn').length != 0) {
			$('.search').removeClass('advSearchOn').addClass('advSearchOff');
		}

		/* only for iPad */
		if ($('#main_nav a.highlight').length != 0) {
			$('#main_nav .dropdown').hide();
			$('#main_nav a.highlight').removeClass('highlight');
		}
	});

	/* drop down scrolling for IE6 */
	if ($.browser.msie && parseInt($.browser.version, 10) == 6) {
		$('div.scroll ul').each(function() {
			var $this = $(this);

			if ($this.children('li').length > 10) {
				$this.parent().css('height', '270px');
			}
		});
	}
}

// open window

function open_new_window(url){
	if(is_mobile_app_mode()){
		window.parent.postMessage("{\"method\": \"loadBrowser\", \"href\": \"" + url + "\"}", "*");
	}else {
		window.open(url);
	}
}

// date picker

function save_date_picker(date, picker, name) {
	var input = $('#' + name);
	var date = input.datepicker('getDate');

	if (date == null) {
		$('#' + name + '_year').val('');
		$('#' + name + '_month').val('');
		$('#' + name + '_day').val('');
	} else {
		$('#' + name + '_year').val(date.getFullYear());
		$('#' + name + '_month').val(date.getMonth() + 1);
		$('#' + name + '_day').val(date.getDate());
	}
}

// date time picker

function save_date_time_picker(date, picker, name, use_24) {
	var input = $('#' + name).val().trim();

	if (input == '') {
		$('#' + name + '_year').val('');
		$('#' + name + '_month').val('');
		$('#' + name + '_day').val('');
		$('#' + name + '_hours').val('');
		$('#' + name + '_minutes').val('');
	} else {
		var time = date.split(' ')[3].split(':');
		var hour = (time[0].length == 1 ? ('0' + time[0]) : time[0]);

		$('#' + name + '_year').val(picker.selectedYear);
		$('#' + name + '_month').val(picker.selectedMonth + 1);
		$('#' + name + '_day').val(picker.selectedDay);

		if (use_24 == 'true'){
		    $('#' + name + '_hours').val(hour);
		}else{
			var ampm = date.split(' ')[4].toUpperCase();
			var conversions = {'01AM': '1', '02AM': '2', '03AM': '3', '04AM': '4', '05AM': '5', '06AM': '6', '07AM': '7', '08AM': '8', '09AM': '9', '10AM': '10', '11AM': '11', '12AM': '0', '01PM': '13', '02PM': '14', '03PM': '15', '04PM': '16', '05PM': '17', '06PM': '18', '07PM': '19', '08PM': '20', '09PM': '21', '10PM': '22', '11PM': '23', '12PM': '12'};
			$('#' + name + '_hours').val(conversions[hour + ampm]);
		}
		
		$('#' + name + '_minutes').val(time[1]);
	}
}

// set_self_registration

function set_self_registration(value) {
	if (value == 'WithAccessCode') {
		$('#configure_access_codes').show();
	} else {
		$('#configure_access_codes').hide();
	}

	ajax_request('/registration_codes/set_type?value=' + value);
}

function text_field_for_organization(checkbox) {
    if (checkbox.checked) {
        hide_element('default_org_option');
    } else {
        show_element('default_org_option');
    }

	ajax_request('/account_fields/set_text_field_for_organization?value=' + check_s(checkbox));
}

function start_with_default_org_in_dropdown(checkbox) {
    ajax_request('/account_fields/set_start_with_default_org_in_dropdown?value=' + check_s(checkbox));
}

// view as

function view_as_student(class_id) {
	$.facebox({
		'ajax' : '/teacher_class/view_as_student/' + class_id + '?from=' + encodeURIComponent(window.location.pathname + window.location.search)
	});
}

function view_as_teacher(class_id) {
	window.location.href = '/student_class/view_as_teacher/' + class_id + '?from=' + encodeURIComponent(window.location.pathname + window.location.search);
}

// canned messages

function set_default_message(action_id, dropdown) {
	if (dropdown.value == 0) {
		$.facebox({
			'ajax' : '/canned_messages_admin/add_message/' + action_id
		});
	} else {
		ajax_request('/canned_messages_admin/set_default_message/' + action_id + '?value=' + dropdown.value);
	}
}

/*
 * what happens when you click "Save"?
 */

function select_message(action_id, dropdown) {
	if (dropdown.value == 0) {
		$.facebox({
			'ajax' : '/canned_messages_admin/add_message/' + action_id
		});
	} else {
		$.ajax({
			url : '/add_accounts_using_form/set_message?message_id=' + dropdown.value,
			async : false,
			success : function(data) {
				$('#message_subject').html('<p>' + data.subject + '</p>');
				$('#message_content').html(data.content);
			}
		});
	}
}

// time zone

function check_time_zone(time) {
	var browser_time = new Date();
	var server_time = new Date(time.year, time.month - 1, time.day, time.hour, time.min);
	var diff_time = Math.abs(browser_time.getTime() - server_time.getTime());

	// 15 minutes is 900000 milliseconds
	if (diff_time > 900000) {
		show_element('time_warning');
	}
}

// time

function write_time() {
	if ($('input#time').length == 0) {
		var now = new Date();
		var time = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
		$('.signupForm, .formAutoWidths, #signup_form').prepend("<input type='hidden' id='time' name='time' value='" + time + "' />");
	}
}

// configure notifications

function set_email_notification(attribute, checkbox) {
	ajax_request('/notifications/set_email_notification?attribute=' + attribute + '&value=' + (checkbox.checked ? 'true' : 'false'));
}

function set_mobile_notification(attribute, checkbox) {
	ajax_request('/notifications/set_mobile_notification?attribute=' + attribute + '&value=' + (checkbox.checked ? 'true' : 'false'));
}

// full admins

function set_full_admin(checkbox, administrator_id) {
    ajax_request('/administrators/set_full_admin?administrator_id=' + administrator_id + '&value=' + (checkbox.checked ? 'true' : 'false'));
}

// billing contacts

function billing_contact(checkbox, administrator_id) {
	ajax_request('/administrators/set_billing_contact?administrator_id=' + administrator_id + '&value=' + (checkbox.checked ? 'true' : 'false'));
}

// contact messages

function contact_messages(checkbox, administrator_id) {
  ajax_request('/administrators/set_contact_messages?administrator_id=' + administrator_id + '&value=' + (checkbox.checked ? 'true' : 'false'));
}

// resources

function update_resources(controller, id, lesson, section, folder, popup) {
	var subject = $('#resource_subject');
	var type = $('#resource_type');
	var library = $('#resource_library');
	var url = '/' + controller + '/new_from_favorites/' + id + '?';
	var args = [];
	var name = $('#resource_name').val();

	if (name) {
		args.push('resource_name=' + name);
	}

	if (lesson){
		args.push('lesson_id=' + lesson);
	}

	if (section){
		args.push('section_id=' + section);
	}

	if (folder){
		args.push('folder=' + folder);
	}

	if (subject){
		args.push('subject=' + subject.val());
	}

	if (type){
		args.push('type=' + type.val());
	}

	if (library){
		args.push('library=' + library.val());
	}

	url += args.join('&');

	if (popup) {
		$.facebox({
			'ajax' : url
		});
	} else {
		window.location.href = url;
	}
}

// click to chat

function playChatSound() {
	soundManager.play('user_sound');
}

function display_chat_alert(from_id, from_name, chat_room_id) {
	if (chat_alert_displayed) {
		return;
	}

	chat_alert_displayed = true;
	var alerts = $('#alerts');
	from_name = from_name.replace('"', '\"');

	if (is_mobile_app_mode()) {
		alerts.html('<div class="alert_block info keepopen" role="alert"><div class="alert_flex"><div class="alert_icon"><i class="info inverted"></i></div><p>' + chat_request_text + ' ' + from_name + ': <a href="javascript:accept_chat_request_app(' + chat_room_id + ');">' + accept_text + '</a> | <a href="javascript:ignore_chat_request(' + chat_room_id + ');">' + ignore_text + '</a></p></div></div>');

	} else {
		alerts.html('<div class="alert_block info keepopen" role="alert"><div class="alert_flex"><div class="alert_icon"><i class="info inverted"></i></div><p>' + chat_request_text + ' ' + from_name + ': <a href="javascript:accept_chat_request(' + chat_room_id + ');">' + accept_text + '</a> | <a href="javascript:ignore_chat_request(' + chat_room_id + ');">' + ignore_text + '</a></p></div></div>');
	}

	alerts.show();

	if (loaded_sound_manager) {
		playChatSound();
	} else {
		$.getScript('/javascripts/soundmanager2-jsmin.js', function() {
			init_sound_manager(playChatSound);
		});
	}
}

function hide_chat_alert() {
	var alerts = $('#alerts');
	alerts.html('');
	alerts.hide();
	chat_alert_displayed = false;
}

function click_to_chat(user_id) {
	$.ajax({
		type: 'POST',
		url : '/click_to_chat/start_chat?user_id=' + user_id,
		success : function(json, text_status, jqXHR) {
			launch_chat('/click_to_chat/launch?chat_room_id=' + json.chat_room_id + '&chat_room_name=' + encodeURIComponent(json.user_name.replace(/'/g, "%27")) + '&invited_user_id=' + user_id);
		},
		error : function(jqXHR, text_status, errorThrown) {
			$.alert({content: 'error ' + text_status});
		}
	});
}

function accept_chat_request(chat_room_id) {
	$.ajax({
		type: 'POST',
		url : '/click_to_chat/join_chat?chat_room_id=' + chat_room_id,
		success : function(json, text_status, jqXHR) {
			if (json.status) {
				hide_chat_alert();
				launch_chat('/click_to_chat/launch?chat_room_id=' + chat_room_id + '&chat_room_name=' + encodeURIComponent(json.user_name.replace(/'/g, "%27")));
			} else {
				$('#alerts .info p').html(chat_request_canceled_text);
				setTimeout(hide_chat_alert, 5000);
			}
		},
		error : function(jqXHR, text_status, errorThrown) {
			$.alert({content: 'error ' + text_status});
		}
	});
}

function ignore_chat_request(chat_room_id) {
	hide_chat_alert();
	ajax_request('/click_to_chat/ignore?chat_room_id=' + chat_room_id);
}

// chat

function start_chat(chat_url, redirect_url) {
	if (is_mobile_app_mode()) {
		start_chat_app(chat_url, redirect_url);
	} else {
		launch_chat(chat_url);
	}
}

function launch_chat(url) {
	var chatroom_id = create_chat(url);

	$(window).on('click', function(event) {
		if (event.target.href) {
			$(window).off('unload beforeunload');
		}
	});

	$(window).on('unload beforeunload', function(event) {
		ajax_request('/chat_room/leaving/' + chatroom_id);
	});
}

function relaunch_chat(url) {
	launch_chat(url + '&event=relaunched');
}

function create_chat(url) {
	var args = get_args(url);
	var chatroom_id = args['chat_room_id']; // should always be present
	var chatroom_name = (args['chat_room_name'] ? decodeURIComponent(args['chat_room_name']) : 'Chat');
	var invited_user_id = (args['invited_user_id'] || 'null');

	var popout_link = '<a href="javascript:void(0)" onclick="pop_out_chat(\'' + url + '\')" class="popout"><i class="popout inverted"></i><span class="textOffScreen">Popout window</span></a>';
	var chatContainer = '<div id="chatContainer" chatroom_id="' + chatroom_id + '"><div class="header"><h4>' + chatroom_name.replace(/\+/g, " ").replace(/%27/g, "'") + '</h4>' + popout_link + '<a href="javascript:void(0)" onclick="close_chat(' + chatroom_id + ', ' + invited_user_id + ')" class="close"><i class="xCross inverted"></i><span class="textOffScreen">Close chat</span></a></div><div id="chatIframe"><iframe src="' + url + '"></iframe></div></div>';

	if ($('#chatContainer').length > 0) {
		// different chat room already embedded
		window.open(url+'&event=popped_out&disable_popin=true', '_blank', 'height=611px,width=500px,toolbar=yes,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,modal=no');
	} else {
		// embed chat room in frame
		$('#contentWrap').append(chatContainer);
	}

	return chatroom_id;
}

function pop_out_chat(url) {
	url = (url.indexOf('?') > -1 ? url + '&event=popped_out' : url + '?event=popped_out');
	var childWindow = window.open(url, '_blank', 'height=611px,width=500px,toolbar=yes,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,modal=no');
	$('#chatContainer').remove();
}

function pop_in_close() {
	// http://stackoverflow.com/questions/4458630/unable-to-unbind-the-window-beforeunload-event-in-jquery
	window.onbeforeunload = null; // suppress default call to close_chat()
	window.opener.launch_chat(window.location.href.replace('event=popped_out', 'event=popped_in'));
	window.close();
}

function close_chat(chat_room_id, invited_user_id, multi) {
	$('#chatContainer').remove();

	if (invited_user_id == null) {
		ajax_request('/chat_room/leaving/' + chat_room_id + (multi == null ? '' : '?multi=true'), {
			asynchronous : false
		});
	} else {
		ajax_request('/chat_room/leaving/' + chat_room_id + '?invited_user_id=' + invited_user_id + (multi == null ? '' : '&multi=true'), {
			asynchronous : false
		});
	}
}

// user popups

function over_user() {
	if (user_timer == null) {
		// pop up after one second
		user_href = $(this);
		user_timer = setTimeout(popup_user, 1000);
	}
}

function clear_user_timer() {
	if (user_timer) {
		clearTimeout(user_timer);
		user_timer = null;
	}
}

function popup_user() {
	if (user_href.attr('rel')) {
		return;
	}

	// mark and cache
	user_href.attr('rel', 'popup');

	// exiting title interferes with tooltip
	user_href.removeAttr('title');

	// get user id
	var href = user_href.attr('href');
	var parts = href.split("/");
	var user_id = parts[3];
	var url = '/popup/user/' + user_id;

	// fetch tooltip HTML
	var html;

	$.ajax({
		url : url,
		async : false, // make this async?
		success : function(data) {
			html = data;
		}
	});

	// attach tooltip
	var tool_tip = $(html);

	// add after element
	user_href.after(tool_tip);

	// can't use delay because it triggers AJAX before delay, not after
	user_href.tooltip({
		events : {
			def : 'mouseenter,mouseleave'
		},
		relative : true,
		position : user_href.offset().top < 200 || user_href.parents('.profileTable').length ? "bottom left" : "top left",
		effect : 'slide',
		delay: 1000 // one second
	});

	if(user_href.offset().top < 200 || user_href.parents('.profileTable').length){
		user_href.siblings('.tooltip').addClass('tooltipBot');
	}

	// attach facebox hook
	//tool_tip.find('a[rel*=facebox]').facebox();
	tool_tip.find('a[rel*=facebox]').each( function() {
		if(!$(this).hasClass("_processed")) {
			$(this).addClass("_processed").facebox();
		}
	});

	if ($.browser.mozilla) {
		var triggerCount = 0;

		user_href.mouseenter(function() {
			triggerCount++;

			if (triggerCount == 1) {
				user_href.trigger('mouseenter');
			} else {
				triggerCount = 0;
			}
		});

		user_href.mouseleave(function() {
			triggerCount++;

			if (triggerCount == 1) {
				user_href.trigger('mouseleave');
			} else {
				triggerCount = 0;
			}
		});
	}

	// need to retrigger event to show tooltip; tried tooltip.show() but this didn't work
	user_href.trigger('mouseenter');
}

function out_user() {
	clear_user_timer();
}

function send_popup_message(user_id) {
	var subject = get_value('subject');
	var content = get_value('content');

	$.ajax({
		type : 'POST',
		url : '/popup/submit_message/' + user_id + '?subject=' + encodeURIComponent(subject) + '&content=' + encodeURIComponent(content),
		success : function(data) {
			$.facebox(data);
		}
	});
}

function disable_user_popups() {
	disable_user_popups_flag = true;
}

function disable_user_popups_in(container) {
	var user_hrefs = $(container + ' a[href^="/user/show/"]');
	user_hrefs.off('mouseover');
	user_hrefs.off('mouseout');
}

function enable_user_popups() {
	if (disable_user_popups_flag) {
		return;
	}

	var user_hrefs = $('a[href^="/user/show/"]');

	user_hrefs.on('mouseover', over_user);
	user_hrefs.on('mouseout', out_user);
}

// pop-ups

function popup_clicked(element) {
	$.facebox({
		'ajax' : $(element).attr('href')
	});

	return false;
}

function send_message_popup(element, form_id) {
	var selected_users = $('#' + form_id).find("input[name*='select[]']:checked");
	var select_all = $('#' + form_id).find("input[name*='select_all']");
	var user_ids = '';
  var filter = $('form input[name=filter]');

	if (selected_users.length > 0 || select_all.length > 0) {
		if (select_all.length > 0) {
			user_ids += '&select_all=true';

			if (filter.length > 0) {
        user_ids += '&filter=' + filter.val();
      }
		} else {
			for (var i = 0; i < selected_users.length; i++) {
				user_ids += '&select[]=' + $(selected_users[i]).val();
			}
		}
		$.post($(element).attr('href'), user_ids, function(response) {
			$.facebox(response);
		});

	} else {
		$.alert({content: "No items were selected."});
	}

	return false;
}

function popup_clicked_mobile_app(href) {
	$.facebox({
		'ajax' : href
	});
}

function popup_form(name, html, preprocess) {
	if (html != null) {
		$('#' + name).submit(function() {
			$(this).ajaxSubmit({
				beforeSerialize : function() {
					try {
						if (typeof(tinyMCE) != 'undefined'){
							html = html.replace('[', '_');
							html = html.replace(']', '');

							function cleanHTML(string) {
								if (string) {
									string = string.replace('<!DOCTYPE html>','');
									string = string.replace('<html>','');
									string = string.replace('</html>','');
									string = string.replace('<head>','');
									string = string.replace('</head>','');
									string = string.replace('<body>','');
									string = string.replace('</body>','');
									string = string.replace(' class="_hovered"', '');
									string = string.replace(/^\s+|\s+$/g, '');
								}

								return string;
							}

							$('#' + html).html(cleanHTML(tinyMCE.activeEditor.getContent()));
						} else {
							var editor = FCKeditorAPI.GetInstance(html);
							html = html.replace('[', '\\[');
							html = html.replace(']', '\\]');
							$('#' + html).val(editor.GetHTML());
						}
					} catch(e) {
					}
				},
				success : function(data) {
					try {
						data = preprocess ? preprocess(data) : data;
						var json = jQuery.parseJSON(data);
						if (json.url.split('#')[0] == window.location.href.split('#')[0]) {
							location.reload();
						} else {
							window.location.href = json.url;
						}
					} catch (e) {
						if( data )
							$.facebox(data);
						else
							$.facebox.close();
					}
				}
			});

			return false;
		});
	} else {
		$('#' + name).submit(function() {
			$(this).ajaxSubmit({
				success : function(data) {
					try {
						data = preprocess ? preprocess(data) : data;
						var json = jQuery.parseJSON(data);

						if (json.url.split('#')[0] == window.location.href.split('#')[0]) {
							location.reload();
						} else {
							window.location.href = json.url;
						}
					} catch (e) {
						if( data )
							$.facebox(data);
						else
							$.facebox.close();
					}
				}
			});

			return false;
		});
	}
}

// lessons

function init_lessons(the_class_id, the_current_lesson, the_unhide_text, the_hide_text, the_confirm_text) {
	class_id = the_class_id;
	current_lesson = the_current_lesson;
	unhide_text = the_unhide_text;
	hide_text = the_hide_text;
	confirm_text = the_confirm_text;
}

function show_section_adjustments(element) {
	$(element).find('> tbody').addClass('highlightLesson');
	$(element).find('.accordionLink').attr("aria-expanded", true);
  $(element).find('.accordionLink > span:nth-of-type(1)').attr('class','hide');
  $(element).find('.accordionLink > span:nth-of-type(2)').attr('class','');
	if (is_mobile_device() || $(element).find('tr').hasClass('current_lesson')) {
		$(element).find('.modern_module_row ~ tr').show();
	} else {
		$(element).find('.modern_module_row ~ tr').show(400);
	}
}

function hide_section_adjustments(element) {
	$(element).find('> tbody').removeClass('highlightLesson');
	$(element).find('.accordionLink').attr("aria-expanded", false);
	$(element).find('.accordionLink > span:nth-of-type(1)').attr('class','');
	$(element).find('.accordionLink > span:nth-of-type(2)').attr('class','hide');
	$(element).find('.modern_module_row ~ tr').hide();
}

function teacher_show_sections(linkElement, showText, hideText, class_id) {
	$.ajax({
		url : '/teacher_lessons/show_sections/' + class_id,
		success: function(){
			$(linkElement).html('<i class="arrowUp"></i>'+hideText).attr('onclick', 'teacher_hide_sections(this, \''+showText+'\', \''+hideText+'\', '+class_id+')');

			show_section_adjustments($('.instructor_module_view > table'));
			update_min_height();
		}
	});
}

function teacher_hide_sections(linkElement, showText, hideText, class_id) {
	$.ajax({
		url : '/teacher_lessons/hide_sections/' + class_id,
		success: function() {
			$(linkElement).html('<i class="arrowDown"></i>'+showText).attr('onclick', 'teacher_show_sections(this, \''+showText+'\', \''+hideText+'\', '+class_id+')');

			hide_section_adjustments($('.instructor_module_view > table'));
			show_section_adjustments($('.instructor_module_view > table tr.current_lesson').parent().parent());
			update_min_height();
		}
	});
}

function student_show_sections(linkElement, showText, hideText, controller, class_id, child_id) {
	$.ajax({
		url : '/' + controller + '/show_sections/' + class_id + (child_id == null ? '' : '?child=' + child_id),
		success: function() {
			$(linkElement).html('<i class="arrowUp"></i>'+hideText).attr('onclick', 'student_hide_sections(this, \''+showText+'\', \''+hideText+'\', \''+controller+'\', '+class_id+', '+child_id+')');

			show_section_adjustments($('.learner_module_view > table'));
			update_min_height();
		}
	});
}

function student_hide_sections(linkElement, showText, hideText, controller, class_id, child_id) {
	$.ajax({
		url : '/' + controller + '/hide_sections/' + class_id + (child_id == null ? '' : '?child=' + child_id),
		success: function() {
			$(linkElement).html('<i class="arrowDown"></i>'+showText).attr('onclick', 'student_show_sections(this, \''+showText+'\', \''+hideText+'\', \''+controller+'\', '+class_id+', '+child_id+')');

			hide_section_adjustments($('.learner_module_view > table'));
			show_section_adjustments($('.learner_module_view > table tr.current_lesson').parent().parent());
			update_min_height();
		}
	});
}

function ta_show_sections(linkElement, showText, hideText, class_id) {
	$.ajax({
		url : '/teacher_lessons/show_sections/' + class_id,
		success: function() {
			$(linkElement).html('<i class="arrowUp"></i>'+hideText).attr('onclick', 'teacher_hide_sections(this, \''+showText+'\', \''+hideText+'\', '+class_id+')');

			show_section_adjustments($('.instructor_module_view > table'));
			update_min_height();
		}
	});
}

function ta_hide_sections(linkElement, showText, hideText, class_id) {
	$.ajax({
		url : '/teacher_lessons/hide_sections/' + class_id,
		success: function() {
			$(linkElement).html('<i class="arrowDown"></i>'+showText).attr('onclick', 'teacher_show_sections(this, \''+showText+'\', \''+hideText+'\', '+class_id+')');

			hide_section_adjustments($('.instructor_module_view > table'));
			show_section_adjustments($('.instructor_module_view > table tr.current_lesson').parent().parent());
			update_min_height();
		}
	});
}

// drag and drop

function init_draggable_categories() {
	$("#category_list").sortable({
		handle : 'td.draggable_handle',
		update : function(event, ui) {
			var after = ui.item.index('.draggable') + 1;
			var category_id = ui.item.find(':input:first').val();
			window.location.href = '/class_catalog_configure/move/' + category_id + '?position=' + after;
		}
	});

	$("#category_list").disableSelection();
}

function init_draggable_categories_in_catalog() {
	var flex_height,
		tile_html;

	$('.catalog_boxes.catalog_categories > div').mousedown(function(e) {
		flex_height = $(this).outerHeight();
		tile_html = $(this).html();
	});

	$(".catalog_boxes.catalog_categories").sortable({
		revert: 300,
		containment: 'parent',
		tolerance: 'pointer',
		handle : '.draggable_handle',
		placeholder: {
			// Added duplicated content so that the flex row stays the same height
			element: function() {
				return $('<div class="ui-sortable-placeholder" style="visibility:hidden">' + tile_html + '</div>');
			},
			update: function() {

			}
		},
		create: function (e, ui) {
			$('.catalog_boxes.catalog_categories.ui-sortable').removeClass('no_flex').show();

			// set width on container to fix last item in row glitch
			$('.hasRightColumn .catalog_boxes.catalog_categories.ui-sortable').css('width', $('.catalog_boxes.catalog_categories.ui-sortable').width());
		},
		start: function (e, ui) {
			// Set the height of ui-sortable-help so it doesn't change when removed from the flex flow
			ui.helper.css('height', flex_height);
		},
		update : function(event, ui) {
			var after = ui.item.index('.catalog_categories > .draggable') + 1;
			var category_id = ui.item.attr('id');

			$.ajax({
				url : '/class_catalog_configure/move/' + category_id + '?position=' + after + '&catalog=true',
				async : false
			});
		}
	});

	$(".catalog_boxes.catalog_categories").disableSelection();
}

function init_draggable_items(category_id) {
	var flex_height,
		tile_html;

	$('.catalog_boxes.catalog_courses > div').mousedown(function(e) {
		flex_height = $(this).outerHeight();
		tile_html = $(this).html();
	});

	$(".catalog_boxes.catalog_courses").sortable({
		revert: 300,
		containment: 'parent',
		tolerance: 'pointer',
		handle : '.draggable_handle',
		placeholder: {
			// Added duplicated content so that the flex row stays the same height
			element: function() {
				return $('<div class="ui-sortable-placeholder" style="visibility:hidden">' + tile_html + '</div>');
			},
			update: function() {

			}
		},
		create: function (e, ui) {
			$('.catalog_boxes.catalog_courses.ui-sortable').removeClass('no_flex').show();

			// set width on container to fix last item in row glitch
			$('.hasRightColumn .catalog_boxes.catalog_courses.ui-sortable').css('width', $('.catalog_boxes.catalog_courses.ui-sortable').width());
		},
		start: function (e, ui) {
			// Set the height of ui-sortable-help so it doesn't change when removed from the flex flow
			ui.helper.css('height', flex_height);
		},
		update : function(event, ui) {
			var after = ui.item.index('.catalog_courses > .draggable') + 1;
			var category_item_id = ui.item.attr('category_item_id');

			$.ajax({
				url : '/class_catalog_configure/move_item?category_id=' + category_id + '&category_item_id=' + category_item_id + '&position=' + after,
				async : false
			});
		}
	});

	$(".catalog_boxes.catalog_courses").disableSelection();
}

function init_draggable_lessons(class_id) {
	var row_height;
	$('.instructor_module_view table').mousedown(function(e) {
		row_height = $(this).outerHeight();
	});

	$(".instructor_module_view").sortable({
		handle : '.draggable_handle',
		placeholder: {
			// Make the placeholder a different element so that it doesn't interfere with the :nth-child row coloring.
			element: function() {
				return $('<div class="ui-sortable-placeholder" style="visibility:hidden; height:' + row_height +'px"></div>');
			},
			update: function() {

			}
		},
		update : function(event, ui) {
			var after = ui.item.index('.draggable') + 1;
			var lesson_id = ui.item.find(':input:first').val();

			$.ajax({
				url : '/teacher_lessons/move/' + class_id + '?lesson_id=' + lesson_id + '&position=' + after,
				async : false
			});
		}
	});

	$(".instructor_module_view").disableSelection();
}

function init_draggable_lessons_tiles(class_id) {
	var flex_height,
		tile_html,
		current_index;
	$('.lesson_boxes > div').mousedown(function(e) {
		flex_height = $(this).outerHeight();
		tile_html = $(this).html().replace(/<a/g, '<div').replace(/<\/a>/g, '</div>');
		current_index = $(this).parent().find('.imgCrop .current').closest('.draggable').index() + 1;
	});

	$(".lesson_boxes").sortable({
		revert: 300,
		containment: 'parent',
		tolerance: 'pointer',
		handle : '.draggable_handle',
		placeholder: {
			// Added duplicated content so that the flex row stays the same height
			element: function() {
				return $('<a class="ui-sortable-placeholder" style="visibility:hidden;">' + tile_html + '</a>');
			},
			update: function() {

			}
		},
		create: function (e, ui) {
			$('.lesson_boxes.ui-sortable').removeClass('no_flex').show();

			// set width on container to fix last item in row glitch
			$('.hasRightColumn .lesson_boxes.ui-sortable').css('width', $('.lesson_boxes.ui-sortable').width());
		},
		start: function (e, ui) {
			// Set the height of ui-sortable-help so it doesn't change when removed from the flex flow
			ui.helper.css('height', flex_height);
		},
		update : function(event, ui) {
			var after = ui.item.index('.lesson_boxes > .draggable') + 1;
			var lesson_id = ui.item.find(':input:first').val();

			var current_code = $('.lesson_boxes .imgCrop .current').clone();
			$('.lesson_boxes .imgCrop .current').remove();
			$('.lesson_boxes > div:nth-child(' + current_index + ') .imgCrop').prepend( current_code );

			$.ajax({
				url : '/teacher_lessons/move/' + class_id + '?lesson_id=' + lesson_id + '&position=' + after,
				async : false
			});
		}
	});

	$(".lesson_boxes").disableSelection();

	checkbox_highlight_tiles('.lesson_boxes');
}

function checkbox_highlight_tiles(container){
	$(container + ' :checkbox').change(function(){
		if($(this).is(':checked')){
			$(this).closest('.draggable').addClass('highlight');
		}else{
			$(this).closest('.draggable').removeClass('highlight');
		}
	});
}

function init_draggable_goals(path_id) {
  var row_height;

  $('.goal_list table').mousedown(function(e) {
    row_height = $(this).outerHeight();
  });

  $(".goal_list").sortable({
    handle : '.draggable_handle',
    placeholder: {
      // Make the placeholder a different element so that it doesn't interfere with the :nth-child row coloring.
      element: function() {
        return $('<div class="ui-sortable-placeholder" style="visibility:hidden; height:' + row_height +'px"></div>');
      },
      update: function() {

      }
    },
		update : function(event, ui) {
			var after = ui.item.index('.draggable') + 1;
			var goal_id = ui.item.find(':input:first').val().replace("check_", "");

      $($('.goal_list h2 span span')).each( function(index) {
        $(this).text(index + 1);
      });

			$.ajax({
				url : '/path_admin_goals/move/' + path_id + '?goal_id=' + goal_id + '&position=' + after,
				async : false
			});
		}
	});

  $(".goal_list").disableSelection();
}

function init_draggable_bundle_items(bundle_id) {
    var row_height;

    $('.goal_list table').mousedown(function(e) {
        row_height = $(this).outerHeight();
	});

    $(".goal_list").sortable({
        handle : '.draggable_handle',
        placeholder: {
            // Make the placeholder a different element so that it doesn't interfere with the :nth-child row coloring.
            element: function() {
                return $('<div class="ui-sortable-placeholder" style="visibility:hidden; height:' + row_height +'px"></div>');
            },
            update: function() {

            }
        },
        update : function(event, ui) {
            var after = ui.item.index('.draggable') + 1;
            var item_id = ui.item.find(':input:first').val().replace("check_", "");

            $($('.goal_list h2 span span')).each( function(index) {
                $(this).text(index + 1);
            });

            $.ajax({
                url : '/bundle/move/' + bundle_id + '?item_id=' + item_id + '&position=' + after,
                async : false
            });
        }
    });

    $(".goal_list").disableSelection();
}

function init_draggable_subscription_items(subscription_id) {
    var row_height;

    $('.goal_list table').mousedown(function(e) {
        row_height = $(this).outerHeight();
	});

    $(".goal_list").sortable({
        handle : '.draggable_handle',
        placeholder: {
            // Make the placeholder a different element so that it doesn't interfere with the :nth-child row coloring.
            element: function() {
                return $('<div class="ui-sortable-placeholder" style="visibility:hidden; height:' + row_height +'px"></div>');
            },
            update: function() {

            }
        },
        update : function(event, ui) {
            var after = ui.item.index('.draggable') + 1;
            var item_id = ui.item.find(':input:first').val().replace("check_", "");

            $($('.goal_list h2 span span')).each( function(index) {
                $(this).text(index + 1);
            });

            $.ajax({
                url : '/subscription/move/' + subscription_id + '?item_id=' + item_id + '&position=' + after,
                async : false
            });
        }
    });

    $(".goal_list").disableSelection();
}

function init_draggable_sections(class_id, lesson_id) {
	$('#section_list').sortable({
		handle : 'td.draggable_section_handle',
		update : function(event, ui) {
			var after = ui.item.index('.draggable') + 1;
			var section_id = ui.item.find(':input:first').val();

			$.ajax({
				url : '/teacher_section/move/' + class_id + '?lesson_id=' + lesson_id + '&section_id=' + section_id + '&position=' + after,
				async : false
			});
		}
	});

	$('#section_list').disableSelection();
}

function init_draggable_questions(url, question_bank_id) {
    $("#question_list_" + question_bank_id).sortable({
		handle : 'td.draggable_handle',
		update : function(event, ui) {
            var after = ui.item.index('.drag_list_' + question_bank_id) + 1;
			var question_id = ui.item.find(':input:first').val();

			$.ajax({
                url: url + '?question_bank_id=' + question_bank_id + '&question_id=' + question_id + '&position=' + after,
				async : false
			});
		}
	});

	$("#question_list").disableSelection();
}

function init_draggable_question_banks(url) {
    $("#question_bank_list").sortable({
        handle: 'td.draggable_handle',
        update: function (event, ui) {
            var question_bank_id = ui.item.data('id');
            var after = ui.item.index('.drag_bank_list') + 1;
            window.location = url + '?question_bank_id=' + question_bank_id + '&position=' + after;
        }
    });

    $("#question_bank_list").disableSelection();
}

function init_draggable_resources(url) {
	$("#resource_list").sortable({
		handle : 'td.draggable_handle',
		start : function(event, ui) {
			ui.item.data('before', ui.item.index('.draggable') + 1);
		},
		update : function(event, ui) {
			var before = ui.item.data('before');
			var after = ui.item.index('.draggable') + 1;
			var resource_id = ui.item.find(':input:first').val();

			if (url.indexOf('?') == -1) {
				url += '?';
			} else {
				url += '&';
			}

			url += 'resource_id=' + resource_id + '&position=' + after;

			$.ajax({
				url : url,
				async : false
			});

			var temp = $('#resource_' + before).html();

			if (after > before) {
				for (var position = before + 1; position <= after; position += 1) {
					$('#resource_' + (position - 1)).html($('#resource_' + position).html());
				}
			} else {
				for (var position = before - 1; position >= after; position -= 1) {
					$('#resource_' + (position + 1)).html($('#resource_' + position).html());
				}
			}

			$('#resource_' + after).html(temp);
		}
	});

	$("#resource_list").disableSelection();
}

function init_draggable_slides(id) {
	$("#slide_list").sortable({
		handle : 'td.draggable_handle',
		update : function(event, ui) {
			var after = ui.item.index('#slide_list .draggable') + 1;
			var slide_id = ui.item.find(':input:first').val();
      var url = '/portal_slide/move/' + slide_id + '?portal_id=' + id + '&position=' + after;

			$.ajax({
				url : url,
				async : false
			});
		}
	});

	$("#slide_list").disableSelection();
}

function init_draggable_panels(id) {
  $("#panel_list").sortable({
    handle : 'td.draggable_handle',
    update : function(event, ui) {
      var after = ui.item.index('#panel_list .draggable') + 1;
      var panel_id = ui.item.find(':input:first').val();
      var url = '/portal_panel/move/' + panel_id + '?portal_id=' + id + '&position=' + after;

      $.ajax({
        url : url,
        async : false
      });
    }
  });

  $("#panel_list").disableSelection();
}

function init_draggable_menu_items(id) {
	$("#menu_list").sortable({
		handle : 'td.draggable_handle',
		update : function(event, ui) {
			var after = ui.item.index('#menu_list .draggable') + 1;
			var menu_id = ui.item.find(':input:first').val();
			var url = '/portal_menu/move/' + menu_id + '?portal_id=' + id + '&position=' + after;

			$.ajax({
				url : url,
				async : false
			});
		}
	});

	$("#menu_list").disableSelection();
}

function init_draggable_footer_items(id) {
	$("#footer_list").sortable({
		handle : 'td.draggable_handle',
		update : function(event, ui) {
			var after = ui.item.index('#footer_list .draggable') + 1;
			var footer_id = ui.item.find(':input:first').val();
			var url = '/portal_footer/move/' + footer_id + '?portal_id=' + id + '&position=' + after;

      $.ajax({
				url : url,
				async : false
			});
		}
	});

	$("#footer_list").disableSelection();
}

function init_draggable_boxes(name, the_id, controller) {
	var tbody_id = "#" + name + "_list";

	$(tbody_id).sortable({
		handle : 'td.draggable_handle',
		update : function(event, ui) {
			var after = ui.item.index(tbody_id + ' .draggable') + 1;
			var box_id = ui.item.find(':input:first').val();

			$.ajax({
				url : '/' + controller + '/move/' + the_id + '?box_id=' + box_id + '&position=' + after,
				async : false
			});
		}
	});

	$(tbody_id).disableSelection();
}

function init_draggable_policy_documents(controller) {
	$("#policy_documents_list").sortable({
		handle : 'td.draggable_handle',
		update : function(event, ui) {
			var after = ui.item.index('#policy_documents_list .draggable') + 1;
			var policy_document_id = ui.item.find(':input:first').val();

			$.ajax({
				url : '/' + controller + '/move/' + policy_document_id + '?position=' + after,
				async : false
			});
		}
	});

	$("#shortcuts_list").disableSelection();
}

function init_draggable_invoice_templates(controller) {
	$("#invoice_templates_list").sortable({
		handle : 'td.draggable_handle',
		update : function(event, ui) {
			var after = ui.item.index('#invoice_templates_list .draggable') + 1;
			var invoice_template_id = ui.item.find(':input:first').val();

			$.ajax({
				url : '/' + controller + '/move/' + invoice_template_id + '?position=' + after,
				async : false
			});
		}
	});

	$("#shortcuts_list").disableSelection();
}

function init_draggable_shortcuts() {
	$("#shortcuts_list").sortable({
		handle : 'td.draggable_handle',
		update : function(event, ui) {
			var after = ui.item.index('#shortcuts_list .draggable') + 1;
			var shortcut_id = ui.item.find(':input:first').val();

			$.ajax({
				url : '/shortcuts/move/' + shortcut_id + '?position=' + after,
				async : false
			});
		}
	});

	$("#shortcuts_list").disableSelection();
}

function init_draggable_footers() {
	$("#footers_list").sortable({
		handle : 'td.draggable_handle',
		update : function(event, ui) {
			var after = ui.item.index('#footers_list .draggable') + 1;
			var picture_id = ui.item.find(':input:first').val();

			$.ajax({
				url : '/footers/move/' + picture_id + '?position=' + after,
				async : false
			});
		}
	});

	$("#footers_list").disableSelection();
}

function init_draggable_tiers() {
	$("#tier_list").sortable({
		handle : 'td.draggable_handle',
		update : function(event, ui) {
			var after = ui.item.index('.draggable') + 1;
			var tier_id = ui.item.find(':input:first').val();
			$.get('/subscription_tiers/move/' + tier_id + '?position=' + after);
		}
	});

	$("#category_list").disableSelection();
}

function init_draggable_quiz_items() {
	var in_dropzone = false;

	$('.quiz_match_choice').draggable({
        containment: '.leftColumn',
		start: function(event, ui) {
			$(this).attr('aria-grabbed','true');
			$('.quiz_match_dropzone').attr('aria-dropeffect','move');

			$('.quiz_match_table').addClass('quiz_match_highlight');
		},
		stop: function(event, ui) {
			$(this).attr('aria-grabbed','false');
			$('.quiz_match_dropzone').attr('aria-dropeffect','none');

			$('.quiz_match_table').removeClass('quiz_match_highlight');
			if (!in_dropzone) {
				$(this).appendTo($('.quiz_match_choices'));
                var answer_total = 0;
                $('.quiz_match_dropzone input').each(function(){
                    answer_total += parseInt($(this).val());
                });
                if(answer_total == parseInt($(this).data('index'))){
                    $('.quiz_match_dropzone input').removeAttr('name');
                }
			}
			$(this).removeAttr('style');
			//refresh answers
			$('.quiz_match_dropzone').each(function(index){
				if($(this).find('.quiz_match_choice').length == 0){
					$(this).find('input').val(0);
				}
			});
		}
	});

	$('.quiz_match_dropzone').droppable({
		tolerance: 'pointer',
		over: function(event, ui) {
			$(this).addClass('quiz_match_over');
		},
		out: function(event, ui) {
			in_dropzone = false;
			$(this).removeClass('quiz_match_over');
		},
		drop: function(event, ui) {
			in_dropzone = true;
			$(this).removeClass('quiz_match_over');
			$(this).find('.quiz_match_choice').appendTo($('.quiz_match_choices'));
			ui.draggable.appendTo($(this)).removeAttr('style');
			$(this).find('input').val(ui.draggable.data('index'));
			$('.quiz_match_dropzone input').each(function(){
				$(this).attr('name', $(this).data('name'));
			});
		}
	});

	if($('.quiz_match_choices > div').length > 0){
		// randomize choices in the front end
		var $quiz_match_choices = document.getElementsByClassName('quiz_match_choices')[0];
		for (var i = $quiz_match_choices.children.length; i >= 0; i--) {
			$quiz_match_choices.appendChild($quiz_match_choices.children[Math.random() * i | 0]);
		}
	}

	// show chices after they are randomized
	$('.quiz_match_choices > div').show();

	$('.quiz_match_choices').droppable({
		tolerance: 'pointer',
		over: function(event, ui) {
			$('.quiz_match_choices').addClass('quiz_match_over');
		},
		out: function(event, ui) {
			$('.quiz_match_choices').removeClass('quiz_match_over');
		},
		drop: function(event, ui) {
			$('.quiz_match_choices').removeClass('quiz_match_over');
		}
	});

	$(document).keydown(
		function(e) {
			// When within .quiz_match
			if ($(':focus').closest('.quiz_match').length > 0) {

				// Right / Down arrow
				if (e.keyCode == 39 || e.keyCode == 40) {
					if ($('.tabbable').index($(':focus')) + 1 == $('.tabbable').length) {
						$('.tabbable').eq(0).focus();
					} else {
						$('.tabbable').eq($('.tabbable').index($(':focus')) + 1).focus();
					}
				}

				// Up / Left arrow
				if (e.keyCode == 37 || e.keyCode == 38) {
					$('.tabbable').eq($('.tabbable').index($(':focus')) - 1).focus();
				}

				// Space bar / Enter
				if(e.which == 32 || e.keyCode == 13) {

					if ($(':focus').hasClass('quiz_match_choice')) {
						// Selected a choice

						$('.quiz_match_table').addClass('quiz_match_highlight'); // add class to table
						$('.quiz_match_dropzone').attr('aria-dropeffect','move'); // highlight portential dropzones

						// Make empty dropzones tabbable
						$(".quiz_match_dropzone").each(function(index) {
							if ($(this).children().length == 0) {
								$(this).addClass('tabbable').attr('tabindex',0);
							}
						});

						if ($(':focus').parent().hasClass('quiz_match_dropzone')) {
							// If selecting a choice inside a dropzone

							$(':focus').parent().removeClass('tabbable').attr('tabindex',null); // prevent tab to this choice's dropzone

							if ($('.ui-draggable-dragging').length > 0) {
								// If already dragging a choice
								// Add in selected dropzone
								$('.ui-draggable-dragging').appendTo($(':focus').parent());
								$(':focus').appendTo($('.quiz_match_choices'));
								// Highlight the first option in the options holder
								$('.quiz_match_choices > div:first-child').focus();
								remove_quiz_match_highlight();
							} else {
								// If not dragging a choice

								$('.quiz_match_choices').attr('aria-dropeffect','move').addClass('tabbable').attr('tabindex',0);
								$(':focus').attr('aria-grabbed','true').addClass('ui-draggable-dragging');
							}

						} else {
							// If selecting a choice in choices div

							if ($('.ui-draggable-dragging').length > 0) {
								// If already dragging a choice
								// Insert after selected choice
								$('.ui-draggable-dragging').insertAfter($(':focus'));
								// Highlight focussed item
								$('.ui-draggable-dragging').focus();
								remove_quiz_match_highlight();
							} else {
								// If not dragging a choice

								$('.quiz_match_choice').attr('aria-grabbed','false').removeClass('ui-draggable-dragging'); // remove any drag classes
								$(':focus').attr('aria-grabbed','true').addClass('ui-draggable-dragging'); // add new drag class
							}
						}

					} else if ($(':focus').hasClass('quiz_match_dropzone')) {
						// Selected a dropzone

						if ($(':focus > div').length == 0) {
							in_dropzone = true;
							$('.ui-draggable-dragging').appendTo($(':focus')); // append choice to the dropzone

							if ($('.quiz_match_choices > div').length != 0) {
								// Highlight the first option in the options holder
								$('.quiz_match_choices > div:first-child').focus();
							} else {
								// Highlight the current option
								$('.ui-draggable-dragging').focus();
							}
						}
						remove_quiz_match_highlight();

					} else if ($(':focus').hasClass('quiz_match_choices')) {
						// Select the choices div

						$('.ui-draggable-dragging').appendTo($('.quiz_match_choices'));
						$('.quiz_match_choices > div:first-child').focus();
						remove_quiz_match_highlight();
					}

				}

				function remove_quiz_match_highlight() {
					$('.ui-draggable-dragging').attr('aria-grabbed','false').removeClass('ui-draggable-dragging');
					$('div[aria-dropeffect="move"]').attr('aria-dropeffect','none');
					$('.quiz_match_table').removeClass('quiz_match_highlight');
					$('.quiz_match_choices, .quiz_match_dropzone').removeClass('tabbable').attr('tabindex',null);
				}

			}
		}
	);
}

function set_carousel_speed(panel_id, select, portal_id) {
  $.ajax({
    url : '/carousel_panel/set_speed/' + panel_id + '?portal_id=' + portal_id + '&value=' + select.value,
    async : false
	});
}

// libraries

function update_libraries(url) {
	var checkboxes = $('input.library_checkbox');
	var name = $('input#compact_filter_phrase');

	for (var i = 0; i < checkboxes.length; i += 1) {
		var checkbox = checkboxes[i];

		if (checkbox.checked) {
			url += '&' + checkbox.name + '=true';
		}
	}

	var users_filter = $('#users_filter');

	if (users_filter.length > 0) {
		url += '&users[]=' + users_filter.val();
	}

	var subject_filter = $('#subject_filter');

	if (subject_filter.length > 0) {
		url += '&subject=' + subject_filter.val();
	}

	var classification_filter = $('#classification_filter');

	if (classification_filter.length > 0) {
		url += '&classification=' + classification_filter.val();
	}

	if (name.val() != '') {
		url += '&name=' + name.val();
	}

	url += '&filter_active=true';

	var sort_url = $('th .asc, th .desc').attr('href');

	if (typeof sort_url != 'undefined' && sort_url.length > 0){
		sort_val = get_param_from_url(sort_url, 'sort');
		if (typeof sort_val != 'undefined' && sort_val.length > 0) {
			sort_val = (sort_val.includes('-')) ? sort_val.replace('-', '') : (sort_val + '-');
			url += '&sort=' + sort_val
		}		
	} else {
		sort_val = get_param_from_url(window.location.href, 'sort');
		if (typeof sort_val != 'undefined' && sort_val.length > 0) {
			url += '&sort=' + sort_val	
		}
	}

	window.location.href = url;
}

// groups

function update_my_groups() {
	var checkboxes = $('input.group_checkbox');
	var url = '/groups_dashboard?from_form=true';

	for (var i = 0; i < checkboxes.length; i += 1) {
		var checkbox = checkboxes[i];

		if (checkbox.checked) {
			url += '&' + checkbox.name + '=true';
		}
	}

	url += '&filter_active=true';

	window.location.href = url;
}

function update_group_catalog() {
	var checkboxes = $('input.group_checkbox');
	var url = '/group_catalog/index?from_form=true';

	for (var i = 0; i < checkboxes.length; i += 1) {
		var checkbox = checkboxes[i];

		if (checkbox.checked) {
			url += '&' + checkbox.name + '=true';
		}
	}

	url += '&filter_active=true';

	window.location.href = url;
}

// policy documents

function set_policy_document_enabled(controller, policy_document_id, checkbox) {
	ajax_request('/' + controller + '/set_enabled/' + policy_document_id + '?value=' + check_s(checkbox));
}

// help desk

function set_help_desk_org_restriction(checkbox) {
	ajax_request('/help_desk_configure/set_organization_restriction?value=' + check_s(checkbox));
}

// URL parameter parsing

function get_args(url) {
	var args = [];
	var question = url.indexOf('?');

	if (question != -1) {
		var params = url.substring(question + 1).split('&');

		for (var i = 0; i < params.length; i++) {
			var pair = params[i].split('=');
			args[pair[0]] = pair[1];
		}
	}

	return args;
}

// prototype adapter
//
//function PrototypeAdaptor() {
//	this.update = function(name, value) {
//		set_html(name, value);
//	};
//}
//
// prototype adapter
//
//var Element = new PrototypeAdaptor();

// configure sync

function sync_now(el, sync_type) {
  var el = $(el);
  var query = '?from=' + sync_type;

  var users_radio = $('input[name="sync[users_from]"]:checked');
  var sections_radio = $('input[name="sync[sections_from]"]:checked');

  if (users_radio.length > 0) {
    query = query + '&users=' + users_radio.val();
  }

  if (sections_radio.length > 0) {
    //if (query.length == 0) {
    //  query = query + '?';
    // } else {
    //   query = query + '&';
    //}

    query = query + '&sections=' + sections_radio.val();
  }

  window.location = '/sis/sync' + query;
}

function sync_setting(checkbox, id, attribute) {
	ajax_request('/sis/update_setting/' + id + '?attribute=' + attribute + '&value=' + (checkbox.checked ? 'true' : 'false'));
}

function sync_version_settings(element, id, attribute) {
	ajax_request('/clever/update_version/' + id + '?attribute=' + attribute + '&value=' + element.value);
}

function sync_other_settings(element, id, attribute) {
  ajax_request('/sis/update_setting/' + id + '?attribute=' + attribute + '&value=' + element.value);
}

function sync_sso_activate(select, id) {
  $.confirm({
    confirm: function() {
      ajax_request('/clever_sso/update/' + id + '?clever_enabled=' + select.value);
    },
    cancel: function() {
      if (select.value == 'true') {
        select.value = 'false';
      } else {
        select.value = 'true';
      }
    }
  });
}

function sync_auto_activate(select, id) {
  $.confirm({
    confirm: function() {
      ajax_request('/sis/set_auto_sync/' + id + '?sis_auto_sync=' + select.value);
    },
    cancel: function() {
      if (select.value == 'true') {
        select.value = 'false';
      } else {
        select.value = 'true';
      }
    }
  });
}

function sync_check_for_ids(id) {
	$('a.start-onboarding').on('click', function(){
		var interval = setInterval(function(){
			$.ajax({
				type: "POST",
				url: "/clever/check_if_district_is_set",
				data: {id: id},
				dataType: "json",
				success: function(data) {
					console.log(data);

					if (data.status == 'success') {
						clearInterval(interval);
						window.location = '/clever';
					}
				}
			});
		}, 2500);
	});
}

// configure account

function account_setting(checkbox, attribute, refresh) {
	if (refresh) {
		window.location.href = '/account/set_attribute?attribute=' + attribute + '&value=' + (checkbox.checked ? 'true' : 'false');
	} else {
		ajax_request('/account/set_attribute?attribute=' + attribute + '&value=' + (checkbox.checked ? 'true' : 'false'));
	}
}

// configure privacy setting

function privacy_setting(checkbox, attribute, refresh) {
	if (refresh) {
		window.location.href = '/profile_privacy/set_attribute?attribute=' + attribute + '&value=' + (checkbox.checked ? 'true' : 'false');
	} else {
		ajax_request('/profile_privacy/set_attribute?attribute=' + attribute + '&value=' + (checkbox.checked ? 'true' : 'false'));
	}
}

function set_top_tab(tab) {
	window.location.href = '/account/set_top_tab?value=' + tab;
}

// mini-navigation

function set_mini_nav(tab) {
	ajax_request('/account/set_mini_nav?value=' + tab);
}

function language_setting(dropdown) {
	window.location.href = '/account/set_language?value=' + encodeURIComponent(dropdown.value);
}

function time_zone_setting(dropdown) {
	ajax_request('/account/set_time_zone?value=' + encodeURIComponent(dropdown.value));
}

function set_user_session_timeout(dropdown) {
	window.location.href = '/account/set_session_timeout?value=' + dropdown.value;
}

function google_docs_setting(checkbox) {
	if (checkbox.checked) {
		window.location.href = '/google_docs_configure/enable';
	} else {
		window.location.href = '/google_docs_configure/disable';
	}
}

function infinite_scroll(container, callback) {
	$(container).scroll(function(e) {
		if (e.target.scrollTop >= (e.target.scrollHeight - e.target.clientHeight)) {
			callback();
			$(container).unbind('scroll');
		}
	});
}
function google_drive_docs_activation_checkbox(el) {
  if (el.checked == true) {
    var wi = window.open('/google_drive/enable', 'Google Drive Authorization', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=600, height=750');

    check_google_drive_docs_activation(wi);
  } else {
    $.confirm({
      content : 'Are you sure you want to deactivate Google Drive?',
      confirm : function() {
        $.ajax({
          type : "POST",
          url : "/google_drive/disable",
          dataType : "json",
          success : function(json) {
            if (json.status == 'ok') {
              location.reload();
            } else if (json.status == 'bad') {
              $.alert({
                content : 'Couldn\'t disable Google Drive.'
              });
            } else {
              $.alert({
                content : 'Something went wrong.'
              });
            }
          }
        });
      }
    });
  }
}

function google_drive_docs_activation() {
  var wi = window.open('/google_drive/enable', 'Google Drive Authorization', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=600, height=750');
  check_google_drive_docs_activation(wi, 'auto');
}

function check_google_drive_docs_activation(wi, type){
  var counter = 0;

  var interval = setInterval(function(){
    $.ajax({
      type: "POST",
      url: "/google_drive/check_activation",
      dataType: "json",
      async: false,
      success: function(json){
        if (json.status == 'ok') {
          if (type == 'auto') {
            $.facebox({'ajax':'/google_docs/add'});
            clearInterval(interval);
          } else {
            location.reload();
          }
        }
      }
    });

    counter++;

    if (counter == 40) {
      wi.close();
      clearInterval(interval);

      $.alert({content: 'The process took too long!'});
    }
  }, 2000);
}

function google_drive_docs_disable() {
  $.ajax({
    type: "POST",
    url: "/google_drive/disable",
    dataType: "json",
    success: function(json) {
      if (json.status == 'ok') {
        google_drive_enable();
      } else if (json.status == 'bad') {
        $.alert({content: 'Couldn\'t disable Google Drive.'});
      } else {
        $.alert({content: 'Something went wrong.'});
      }
    }
  });
}

function onedrive_activation_checkbox(el, business) {
  if (business && (business == true)) {
    var controller = 'one_drive_business';
    var service = 'OneDrive for Business';
  } else {
    var controller = 'one_drive';
    var service = 'OneDrive';
  }

  if (el.checked == true) {
    var wi = window.open('/' + controller + '/enable', service + ' Authorization', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=600, height=750');

    check_onedrive_activation(wi, el, business);
  } else {
    $.confirm({
      content : 'Are you sure you wan\'t to deactivate ' + service + '?',
      cancel: function() {
        $(el).attr('checked', true);
      },
      confirm : function() {
        $.ajax({
          type : "POST",
          url : "/" + controller + "/disable",
          dataType : "json",
          success : function(json) {
            if (json.status == 'ok') {
              location.reload();
            } else if (json.status == 'bad') {
              $(el).attr('checked', false);

              $.alert({
                content : 'Couldn\'t disable ' + service + '.'
              });
            } else {
              $(el).attr('checked', false);

              $.alert({
                content : 'Something went wrong.'
              });
            }
          }
        });
      }
    });
  }
}

function check_onedrive_activation(wi, el, business){
  if (business && (business == true)) {
    var controller = 'one_drive_business';
  } else {
    var controller = 'one_drive';
  }

  var counter = 0;

  var interval = setInterval(function(){
    $.ajax({
      type: "POST",
      url: "/" + controller + "/check_activation",
      dataType: "json",
      async: false,
      success: function(json){
        if (json.status == 'ok') {
          location.reload();
        } else {
          $(el).attr('checked', false);
        }
      }
    });

    counter++;

    if (counter == 40) {
      wi.close();
      clearInterval(interval);

      $(el).attr('checked', false);
      $.alert({content: 'The process took too long!'});
    }
  }, 2000);
}

// configure catalog

function configure_catalog(attribute, invert, checkbox) {
	var value = ( invert ? !checkbox.checked : checkbox.checked);
	ajax_request('/class_catalog_configure/set_attribute?attribute=' + attribute + '&value=' + (value == true ? 'true' : 'false'));
}

// class catalog

function jump_to_class(controller, dropdown) {
	if (dropdown.value && (dropdown.value != 0)) {
		window.location.href = '/' + controller + '/show/' + dropdown.value;
	}
}

// pop-ups

function update_home_popup(value) {
	ajax_request('/home/display_popup?value=' + (value ? 'true' : 'false'), {asynchronous : false});
}

function update_ui_popup(value) {
	ajax_request('/home/display_ui_popup?value=' + (value ? 'true' : 'false'), {asynchronous : false});
}

function update_teacher_popup(class_id, value) {
	ajax_request('/teacher_class/display_popup/' + class_id + '?value=' + (value ? 'true' : 'false'), {asynchronous : false});
}

function update_student_popup(class_id, value) {
	ajax_request('/student_class/display_popup/' + class_id + '?value=' + (value ? 'true' : 'false'), {asynchronous : false});
}

// configure attribute

function configure_attribute(attribute, controller, object_id, checkbox) {
  ajax_request('/' + controller + '/set_attribute/' + object_id + '?attribute=' + attribute + '&value=' + (checkbox.checked ? 'true' : 'false'));
}

// configure compliance

function configure_compliance(controller, object_id, checkbox) {
  window.location.href = '/' + controller + '/set_required_for_compliance/' + object_id + '?value=' + (checkbox.checked ? 'true' : 'false');
}
 
// configure class

function configure_class(attribute, class_id, checkbox) {
	ajax_request('/class_configure/set_attribute/' + class_id + '?attribute=' + attribute + '&value=' + (checkbox.checked ? 'true' : 'false'));
}

function configure_class_and_refresh(attribute, class_id, checkbox, from) {
	window.location.href = '/class_configure/set_attribute_and_refresh/' + class_id + '?attribute=' + attribute + '&value=' + (checkbox.checked ? 'true' : 'false') + '&from=' + from;
}

function configure_enable_lessons_grid_view(class_id, checkbox) {
	window.location.href = '/class_configure/enable_lessons_grid_view/' + class_id + '?value=' + (checkbox.checked ? 'true' : 'false');
}

function configure_enable_lessons_row_view(class_id, checkbox) {
	window.location.href = '/class_configure/enable_lessons_row_view/' + class_id + '?value=' + (checkbox.checked ? 'true' : 'false');
}

function configure_class_inverted(attribute, class_id, checkbox) {
	ajax_request('/class_configure/set_attribute/' + class_id + '?attribute=' + attribute + '&value=' + (checkbox.checked ? 'false' : 'true'));
}

function configure_game(controller, the_id, attribute, game_id, checkbox) {
	ajax_request('/' + controller + '/set_attribute/' + the_id + '?game=' + game_id + '&attribute=' + attribute + '&value=' + (checkbox.checked ? 'true' : 'false'));
}

function configure_leaderboard(controller, the_id, game_id, checkbox, from) {
	window.location.href = '/' + controller + '/set_leaderboard/' + the_id + '?game=' + game_id + '&value=' + (checkbox.checked ? 'true' : 'false') + '&from=' + encodeURIComponent(from);
}

function configure_game_teams(controller, the_id, game_id, checkbox, from) {
	window.location.href = '/' + controller + '/set_support_teams/' + the_id + '?game=' + game_id + '&value=' + (checkbox.checked ? 'true' : 'false') + '&from=' + encodeURIComponent(from);
}

function set_student_top_tab(class_id, radio_button) {
    ajax_request('/class_configure/set_student_top_tab/' + class_id + '?attribute=' + radio_button.value);
}

function set_teacher_top_tab(class_id, radio_button) {
    ajax_request('/class_configure/set_teacher_top_tab/' + class_id + '?attribute=' + radio_button.value);
}

function configure_open_enrollment(class_id, checkbox) {
	ajax_request('/class_configure/set_open_enrollment/' + class_id + '?value=' + (checkbox.checked ? 'true' : 'false'));
}

function configure_enable_grades(class_id, checkbox) {
	window.location.href = '/class_configure/set_enable_grades/' + class_id + '?value=' + (checkbox.checked ? 'true' : 'false');
}

function configure_enable_grade_map(class_id, checkbox) {
	window.location.href = '/class_configure/set_enable_grade_map/' + class_id + '?value=' + (checkbox.checked ? 'true' : 'false');
}

function configure_enable_rubrics(class_id, checkbox) {
	window.location.href = '/class_configure/set_enable_rubrics/' + class_id + '?value=' + (checkbox.checked ? 'true' : 'false');
}

function set_class_rubric_points_ordering(class_id, value) {
	ajax_request('/class_configure/set_rubric_points_ordering/' + class_id + '?value=' + value);
}

function configure_enable_student_posts(class_id, checkbox) {
	window.location.href = '/class_configure/set_enable_student_posts/' + class_id + '?value=' + (checkbox.checked ? 'true' : 'false');
}

function set_class_announcement_comments(class_id, checkbox) {
  ajax_request('/class_configure/set_announcement_comments/' + class_id + '?value=' + (checkbox.checked ? 'true' : 'false'));
}

function set_weight_using_categories(class_id, checkbox) {
	window.location.href = '/class_configure/set_weight_using_categories/' + class_id + '?value=' + (checkbox.checked ? 'true' : 'false');
}

function configure_weighting(class_id, scheme) {
	ajax_request('/class_configure/set_weighting/' + class_id + '?value=' + scheme);
}

function configure_lessons_in_order(class_id, checkbox) {
	ajax_request('/class_configure/set_lessons_in_order/' + class_id + '?value=' + (checkbox.checked ? 'true' : 'false'));
}

function configure_sections_in_order(class_id, checkbox) {
	ajax_request('/class_configure/set_sections_in_order/' + class_id + '?value=' + (checkbox.checked ? 'true' : 'false'));
}

function configure_auto_complete_on_visit(class_id, checkbox) {
	ajax_request('/class_configure/set_auto_complete_on_visit/' + class_id + '?value=' + (checkbox.checked ? 'true' : 'false'));
}

function configure_require_video_completion(class_id, checkbox) {
	ajax_request('/class_configure/set_require_video_completion/' + class_id + '?value=' + (checkbox.checked ? 'true' : 'false'));
}

function set_mastery_display(class_id, dropdown) {
	ajax_request('/class_configure/set_mastery_display/' + class_id + '?value=' + dropdown.value);
}

function set_mastery_calculation(class_id, dropdown) {
    window.location.href = '/class_configure/set_mastery_calculation/' + class_id + '?value=' + dropdown.value;
}

function set_decaying_average_weight(class_id, dropdown) {
    ajax_request('/class_configure/set_decaying_average_weight/' + class_id + '?value=' + dropdown.value);
}

function set_mastery_value_threshold(class_id, dropdown) {
    window.location.href = '/class_configure/set_mastery_value_threshold/' + class_id + '?value=' + dropdown.value;
}

function set_mastery_count_threshold(class_id, dropdown) {
    ajax_request('/class_configure/set_mastery_count_threshold/' + class_id + '?value=' + dropdown.value);
}

// section configuration

function set_section_optional_for_completion(class_id, lesson_id, section_id, checkbox) {
    ajax_request('/teacher_section/set_optional_for_completion/' + class_id + '?lesson_id=' + lesson_id + '&section_id=' + section_id + '&value=' + (checkbox.checked ? 'false' : 'true'));
}

function set_assignment_optional_for_completion(assignment_id, checkbox) {
    ajax_request('/teacher_assignment/set_optional_for_completion/' + assignment_id + '?value=' + (checkbox.checked ? 'false' : 'true'));
}

// lesson configuration

function set_lesson_optional_for_completion(class_id, lesson_id, checkbox) {
	ajax_request('/teacher_lesson/set_optional_for_completion/' + class_id + '?lesson_id=' + lesson_id + '&value=' + (checkbox.checked ? 'false' : 'true'));
}

// path configuration

function set_path_feature(path_id, checkbox) {
	ajax_request('/path_configure/set_attribute/' + path_id + '?attribute=' + checkbox.value + '&value=' + (checkbox.checked ? 'true' : 'false'));
}

function configure_open_enrollment_path(path_id, checkbox) {
	ajax_request('/path_configure/set_open_enrollment/' + path_id + '?value=' + (checkbox.checked ? 'true' : 'false'));
}

function set_path_announcement_comments(path_id, checkbox) {
	ajax_request('/path_configure/set_announcement_comments/' + path_id + '?value=' + (checkbox.checked ? 'true' : 'false'));
}

function set_sequencing(path_id, radio_button) {
	ajax_request('/path_configure/set_sequencing/' + path_id + '?value=' + radio_button.value);
}

function configure_enable_path_student_posts(path_id, checkbox) {
	ajax_request('/path_configure/set_enable_student_posts/' + path_id + '?value=' + (checkbox.checked ? 'true' : 'false'));
}

function configure_path(attribute, path_id, checkbox) {
  ajax_request('/path_configure/set_attribute/' + path_id + '?attribute=' + attribute + '&value=' + (checkbox.checked ? 'true' : 'false'));
}

// goal configuration

function set_goal_optional_for_completion(path_id, goal_id, checkbox) {
	ajax_request('/path_admin_goal/set_optional_for_completion/' + path_id + '?goal=' + goal_id + '&value=' + (checkbox.checked ? 'false' : 'true'));
}

// bundles

function configure_bundle(attribute, bundle_id, checkbox) {
  ajax_request('/bundle_configure/set_attribute/' + bundle_id + '?attribute=' + attribute + '&value=' + (checkbox.checked ? 'true' : 'false'));
}

// subscriptions

function configure_subscription(attribute, subscription_id, checkbox) {
  ajax_request('/subscription_configure/set_attribute/' + subscription_id + '?attribute=' + attribute + '&value=' + (checkbox.checked ? 'true' : 'false'));
}

// logo

function set_left_bar_picture(value) {
	ajax_request('/logo/set_left_bar_picture?value=' + value);
}

// tile color

function configure_tile_color(controller, object_id, value){
	if(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)){
		ajax_request('/' + controller + '/set_tile_color/' + object_id + '?value=' + encodeURIComponent('#' + value));
	}
}

// tile color

function submit_quick_tile_editor(box_index, controller, object_id, lesson_id) {
	var $parent_obj = $('#quick_edit_box_' + box_index).parent();

	// name
	var name_element = $('#tile_name_' + box_index);

	if (name_element.length) {
		var name = name_element.val();
	}

	// color
	var tile_element = $('#tile_color_' + box_index);

	if (tile_element.length) {
		var tile_color = '#' + tile_element.val();
	}

	// picture
	var tile_picture_element = $('#tile_picture_' + box_index);

	if (tile_picture_element.length) {
		var picture = tile_picture_element.val();
	}

	// values
	var values = {};

	if (typeof name != 'undefined' && name.length > 0) {
		values['name'] = name;
	}

	if (typeof tile_color != 'undefined' && tile_color.length > 1 && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(tile_color)) {
		values['tile_color'] = tile_color;
	}

	if (typeof picture != 'undefined' && picture.length > 0) {
		values['picture'] = picture;
	}

	if (!$.isEmptyObject(values)) {
		// in the case of lessons, object_id is the class_id and we also pass the lesson_id
		$.post('/' + controller + '/set_quick_tile_values/' + object_id + (typeof lesson_id != 'undefined' ? '?lesson_id=' + lesson_id : ''), values, function () {
			for (var key in values) {
				switch (key) {
					case 'name':
						if ($parent_obj.parents('.has_quick_editor').length > 0) {
							$parent_obj.children('div.header').children().children('h2').html(values[key]);
						} else {
							if ($('#fixedSectionHeader').length > 0) {
								$('#fixedSectionHeader .centerHeading a').html(values[key]);
							} else if ($('.teacherLessonHeading').length > 0) {
								$('.teacherLessonHeading .centerHeading a').html(values[key]);
							} else {
								$('.sectionTitle h2, .sectionTitle h1, #leftColumn h1').html(values[key]);
							}
						}
						break;
					case 'tile_color':
						if ($('body').hasClass('catalog_class')) {
							$('head').append('<style>' +
								'html:not([dir=rtl]) .catalog_class #contentWrap:before,' +
								'[dir=rtl] .catalog_class #contentWrap:after,' +
								'.catalog_class #leftColumn {' +
								'background-color: ' + values[key] +
								'}' +
								'</style>');
						} else {
							if ($parent_obj.parent().hasClass('modern_module_wrap')) {
								$parent_obj.parent().css('background-color', values[key]);
							} else {
								$parent_obj.css('background-color', values[key]);
							}
						}
						break;
					case 'picture':
						if ($parent_obj.parents('.has_quick_editor').length > 0) {
							$parent_obj.find('.imgCrop').css('background-image', 'url(\'' + values[key] + '\')');
						} else {
							if ($('body').hasClass('catalog_class')) {
								$('#leftColumn .imgCrop').css('background-image', 'url(\'' + values[key] + '\')');
							} else {
								if ($('#leftColumn .img_crop_wrap > img').length > 0) {
									console.log('updating img src');
									$('#leftColumn .img_crop_wrap > img').attr('src', values[key]);
								} else {
									console.log('updating div bg image');
									$('#leftColumn .imgCrop').css('background-image', 'url(\'' + values[key] + '\')');
								}
							}
						}
						break;
				}
			}
		});
	}
}

//default image editor 
function submit_image_editor(image) {
	var $url_input = $('#tile_picture_' + image);
	if($url_input.length > 0 && $url_input.val().length > 0){
		var url = $url_input.val();
        var $parent_obj = $('#quick_edit_box_' + image).parent();
        var values = {
            image: image,
			      url: url
        };

		$.post('/custom_tile_images/save_image/', values, function() {
			$parent_obj.find('.imgCrop').css('background-image', 'url(\'' + values.url +'\')');
            $parent_obj.removeClass('default_image');
		});
	}
}

function reset_tile_picture(image){
	var box_id = '#quick_edit_box_' + image;
    $tile = $(box_id).parent();
    $.post('/custom_tile_images/delete_image/', {image: image}, function() {
        $tile.find('.imgCrop').css('background-image', 'url(\'' + $tile.data('original_url') +'\')');
        $(box_id).hide();
        $tile.addClass('default_image');
    });
}

function submit_image_job_title(id) {
  var $url_input = $('#job_title_picture_' + id);
  if($url_input.length > 0 && $url_input.val().length > 0){
    var url = $url_input.val();
    var $parent_obj = $('#quick_edit_box_' + id).parent();
    var values = {
      url: url
    };

    $.post('/job_title/save_image/' + id, values, function () {
		$parent_obj.css('background-image', 'url(\'' + url + '\')');
	});
  }
}

function reset_job_title_picture(id){
	var box_id = '#quick_edit_box_' + id;
    $tile = $(box_id).parent();
    $.post('/job_title/delete_image/' + id, function () {
		$tile.css('background-image', 'url(\'' + $tile.data('original_url') + '\')');
		$(box_id).hide();
	});
}

function init_quick_edit_box(box_id){
	$box = $(box_id);
	$box.find('.options_btn').hide();
	$box.find('.uploader-list').show();
}

function update_tile_color_input(input_id, color){
	$(input_id).css('background-color', color).val(color.replace('#', ''));
}

// fonts

function select_font(dropdown) {
	window.location.href = '/portal/set_font?value=' + dropdown.value;
}

function select_font_size(dropdown) {
	window.location.href = '/portal/set_font_size?value=' + dropdown.value;
}

// icons

function set_icon_for_profile(checkbox) {
	window.location.href = '/icons/set_icon_for_profile?value=' + check_s(checkbox);
}

// disable social share

function set_disable_social_share(checkbox) {
    ajax_request('/portal/set_disable_social_share?value=' + check_s(checkbox));
}

// suppress embed links

function set_suppress_embed_links(checkbox) {
	ajax_request('/portal/set_suppress_embed_links?value=' + check_s(checkbox));
}

// suppress embed links

function set_wide_screen_support(checkbox) {
	window.location.href = '/portal/set_wide_screen_support?value=' + check_s(checkbox);
}

// thinner navigation

function set_use_thinner_nav(checkbox) {
	window.location.href = '/portal/set_use_thinner_nav?value=' + check_s(checkbox);
}

// mini-navigation

function set_site_mini_nav(tab) {
	ajax_request('/portal/set_mini_nav?value=' + tab);
}

// dropdown navigation

function set_disable_dropdown_nav(checkbox) {
	ajax_request('/portal/set_disable_dropdown_nav?value=' + check_s(checkbox));
}

// tiles

function set_show_tile_view_by_default(checkbox) {
	ajax_request('/portal/set_show_tile_view_by_default?value=' + check_s(checkbox));
}

// captcha

function set_use_captcha(checkbox) {
	ajax_request('/portal/set_use_captcha?value=' + check_s(checkbox));
}

// portal type

// TODO: could be done better
function set_portal_type(controller, value, id) {
  if (id == false) {
    window.location.href = '/' + controller + '/set_portal_type?value=' + value;
  } else {
    window.location.href = '/' + controller + '/set_portal_type/' + id + '?value=' + value;
  }
}

// use accessible portal carousel

function set_accessible_carousel(checkbox) {
    ajax_request('/portal/set_accessible_carousel?value=' + check_s(checkbox));
}

// underline all links

function set_underline_links(checkbox) {
	$.post('/portal/set_underline_links?value=' + check_s(checkbox), function(){
		location.reload();
	});
}

// use high contrast theme

function set_high_contrast_theme(checkbox) {
    $.post('/portal/set_high_contrast_theme?value=' + check_s(checkbox), function(){
        location.reload();
	});
}

// language

function set_show_language_in_footer(checkbox) {
	window.location.href = '/portal/set_show_language_in_footer?value=' + check_s(checkbox);
}

// ssl

function set_ssl_support(checkbox) {
	window.location.href = '/portal/set_ssl_support?value=' + check_s(checkbox);
}

// terminology

function set_disable_plural_mapping(checkbox) {
	window.location.href = '/substitutions/set_disable_plural_mapping?value=' + check_s(checkbox);
}

// home tabs

function set_enable_top_tab(attribute, checkbox) {
	window.location.href = '/portal/set_enable_top_tab?attribute=' + attribute + '&value=' + check_s(checkbox);
}

function set_landing_tab(value) {
	window.location.href = '/portal/set_landing_tab?value=' + value;
}

// left bar

function set_display_my_classes(checkbox) {
	window.location.href = '/portal/set_display_my_classes?value=' + check_s(checkbox);
}

function set_display_my_paths(checkbox) {
	window.location.href = '/portal/set_display_my_paths?value=' + check_s(checkbox);
}

function set_display_my_groups(checkbox) {
	window.location.href = '/portal/set_display_my_groups?value=' + check_s(checkbox);
}

// simple login

function set_simple_login(checkbox) {
  ajax_request('/configure_sso/set_simple_login?value=' + check_s(checkbox));
}

// password reset

function set_password_reset(checkbox) {
  ajax_request('/configure_sso/set_password_reset?value=' + check_s(checkbox));
}

// O365 create account option

function set_office_account_create(checkbox) {
  ajax_request('/office365_sso/set_office_account_create?value=' + check_s(checkbox));
}

function set_auto_create_auth0(checkbox){
	if (check_s(checkbox) == 'true') {
		$('#auth0_custom_fields').show();	
	}else{
		$('#auth0_custom_fields').hide();	
	}	
}

function set_auto_create_auth0_user(checkbox){
	if (check_s(checkbox) == 'true') {
		$('#email_verif').show();
	}else{
		$('#email_verif').hide();
	}
}

// configure group

function configure_group(attribute, group_id, checkbox) {
	ajax_request('/group_configure/set_attribute/' + group_id + '?attribute=' + attribute + '&value=' + (checkbox.checked ? 'true' : 'false'));
}

function configure_group_top_tab(group_id, radio_button) {
	window.location.href = '/group_configure/set_top_tab/' + group_id + '?attribute=' + radio_button.value;
}

function set_group_announcement_comments(group_id, checkbox) {
	ajax_request('/group_configure/set_announcement_comments/' + group_id + '?value=' + (checkbox.checked ? 'true' : 'false'));
}

// configure organization

function configure_organization(attribute, org_id, checkbox) {
	ajax_request('/organization/set_attribute/' + org_id + '?attribute=' + attribute + '&value=' + (checkbox.checked ? 'true' : 'false'));
}

// organizations

function set_partition_organizations(checkbox) {
	window.location.href = '/organizations/set_partition_organizations?value=' + (checkbox.checked ? 'true' : 'false');
}

function set_missing_organization(dropdown) {
	ajax_request('/organizations/set_missing_organization?value=' + dropdown.value);
}

// portal tabs

function configure_portal_tab(attribute, checkbox) {
	window.location.href = '/portal/set_tab/' + class_id + '?attribute=' + attribute + '&value=' + (checkbox.checked ? 'true' : 'false');
}

function configure_portal_top_tab(attribute) {
	window.location.href = '/portal/set_top_tab?attribute=' + attribute;
}

function set_profile_account_field(dropdown) {
    ajax_request('/profile_tabs/set_profile_account_field?value=' + dropdown.value);
}

function set_profile_field_name(checkbox) {
	ajax_request('/profile_tabs/set_profile_field_name?value=' + (checkbox.checked ? 'true' : 'false'));
}

// affiliate groups

function configure_default_affiliate_group(group_id) {
    ajax_request('/affiliate_tiers/set_default?group_id=' + group_id);
}

function assign_affiliate_group(element) {

    var ids = [];
    $('#affiliates input[type="checkbox"]:checked').each(function(){
    	ids.push($(this).val());
    });

	$.facebox({
        'ajax' : $(element).attr('href') + '?ids=' + ids.join(',')
    });

    return false;
}

// left bar

function expand_online() {
	expand('online_bar');
	ajax_request('/navigation/expand_online');
}

function collapse_online() {
	collapse('online_bar');
	ajax_request('/navigation/collapse_online');
}

function expand_classes() {
	expand('classes_bar');
	ajax_request('/navigation/expand_classes');
}

function collapse_classes() {
	collapse('classes_bar');
	ajax_request('/navigation/collapse_classes');
}

function expand_groups() {
	expand('groups_bar');
	ajax_request('/navigation/expand_groups');
}

function collapse_groups() {
	collapse('groups_bar');
	ajax_request('/navigation/collapse_groups');
}

function expand_shortcuts() {
	expand('shortcuts_bar');
	ajax_request('/navigation/expand_shortcuts');
}

function collapse_shortcuts() {
	collapse('shortcuts_bar');
	ajax_request('/navigation/collapse_shortcuts');
}

// to-do list

function over_todo(number) {
	set_style_element('todo_options' + number, {
		display : "inline-block"
	});
}

function out_todo(number) {
	hide_element('todo_options' + number);
}

function delete_todo(number) {
	ajax_request('/task/destroy/' + number);
	fade_element('todo' + number);
}

// publish student review

function publish_student_review(class_id, review_id, checkbox) {
	ajax_request('/teacher_reviews/set_publish/' + class_id + '?review=' + review_id + '&value=' + (checkbox.checked ? 'true' : 'false'));
}

// enable coupon

function set_enable_coupon(coupon_id, checkbox) {
	ajax_request('/coupon/set_enabled/' + coupon_id + '?value=' + (checkbox.checked ? 'true' : 'false'));
}

// catalog calendar

function set_catalog_calendar(checkbox) {
	ajax_request('/class_catalog_configure/set_catalog_calendar?value=' + (checkbox.checked ? 'true' : 'false'));
}

// location filtering

function set_catalog_location_filtering(checkbox) {
	ajax_request('/class_catalog_configure/set_catalog_location_filtering?value=' + (checkbox.checked ? 'true' : 'false'));
}

// catalog search

function set_catalog_search(checkbox) {
	ajax_request('/class_catalog_configure/set_catalog_search?value=' + (checkbox.checked ? 'true' : 'false'));
}

function search_catalog(url) {
	var phrase = $('#catalog_search').val();

	if (url.indexOf('?') == -1) {
		window.location.href = url + "?phrase=" + phrase;
	} else {
		window.location.href = url + "&phrase=" + phrase;
	}
}

function process_search_catalog(event, url) {
	if (event.keyCode == 13) {
		search_catalog(url);
		return false;
	} else {
		return true;
	}
}

// search

function submit_compact_search(url) {
	//var phrase = get_value('compact_search_phrase');
	var phrase = $('.compact_search_phrase').last().val();

	if (url.indexOf('?') == -1) {
		window.location.href = url + "?phrase=" + phrase;
	} else {
		window.location.href = url + "&phrase=" + phrase;
	}
}

function process_search(event, url) {
	if (event.keyCode == 13) {
		submit_compact_search(url);
		return false;
	} else {
		return true;
	}
}

// gateway

function update_lesson(select) {
	if (select.selectedIndex == 0) {
		hide_element('lesson_info');
	} else {
		show_element('lesson_info');
	}
}

function update_gateway(select) {
	if (select.selectedIndex == 0) {
		hide_element('gateway');
	} else {
		show_element('gateway');
	}
}

function update_threshold(checkbox) {
	if (checkbox.checked) {
		show_element('threshold');
	} else {
		hide_element('threshold');
	}
}

// accounts misc options

function set_enable_catalog_accounts(checkbox) {
	ajax_request('/accounts/set_enable_catalog_accounts?value=' + check_s(checkbox));
}

function set_default_to_school_address(checkbox) {
	ajax_request('/accounts/set_default_to_school_address?value=' + check_s(checkbox));
}

// grading

function update_excused(checkbox) {
	if (checkbox.checked) {
		hide_element('score_area');
		hide_element('edit_attachments');
		hide_element('adjust_score');
		hide_element('missing_area');
		hide_element('absent_area');
		hide_element('incomplete_area');
		hide_element('rubric');
		set_checked('excused', true);
		set_checked('absent', false);
		set_checked('missing', false);
		set_checked('incomplete', false);
	} else {
		show_element('score_area');
		show_element('edit_attachments');
		show_element('adjust_score');
		show_element('missing_area');
		show_element('absent_area');
		show_element('incomplete_area');
		show_element('rubric');
		set_checked('excused', false);
	}
}

function update_absent(checkbox) {
	if (checkbox.checked) {
		hide_element('score_area');
		hide_element('edit_attachments');
		hide_element('adjust_score');
		hide_element('excused_area');
		hide_element('missing_area');
		hide_element('incomplete_area');
		hide_element('rubric');
		set_checked('excused', false);
		set_checked('absent', true);
		set_checked('missing', false);
		set_checked('incomplete', false);
	} else {
		show_element('score_area');
		show_element('edit_attachments');
		show_element('adjust_score');
		show_element('excused_area');
		show_element('missing_area');
		show_element('incomplete_area');
		show_element('rubric');
		set_checked('absent', false);
	}
}

function update_missing(checkbox) {
	if (checkbox.checked) {
		hide_element('score_area');
		hide_element('edit_attachments');
		hide_element('adjust_score');
		hide_element('excused_area');
		hide_element('absent_area');
		hide_element('incomplete_area');
		hide_element('rubric');
		set_checked('excused', false);
		set_checked('absent', false);
		set_checked('missing', true);
		set_checked('incomplete', false);
	} else {
		show_element('score_area');
		show_element('edit_attachments');
		show_element('adjust_score');
		show_element('excused_area');
		show_element('absent_area');
		show_element('incomplete_area');
		show_element('rubric');
		set_checked('missing', false);
	}
}

function update_incomplete(checkbox) {
	if (checkbox.checked) {
		hide_element('score_area');
		hide_element('edit_attachments');
		hide_element('adjust_score');
		hide_element('excused_area');
		hide_element('absent_area');
		hide_element('missing_area');
		hide_element('rubric');
		set_checked('excused', false);
		set_checked('absent', false);
		set_checked('missing', false);
		set_checked('incomplete', true);
	} else {
		show_element('score_area');
		show_element('edit_attachments');
		show_element('adjust_score');
		show_element('excused_area');
		show_element('absent_area');
		show_element('missing_area');
		show_element('rubric');
		set_checked('incomplete', false);
	}
}

// student comments

function set_allow_student_comments(assignment_id, checkbox) {
	ajax_request('/teacher_freeform_assignment/set_allow_student_comments/' + assignment_id + '?value=' + check_s(checkbox));
}

// multiple choice

function enable_feedback() {
	show_element('feedback');
}

function disable_feedback() {
	hide_element('feedback');
}

// freeform

function enable_correct_answer() {
    show_element('correct_answer');
}

function disable_correct_answer() {
    hide_element('correct_answer');
}

// true/false

var correct_answer = null;

function set_correct_answer(value) {
	correct_answer = value;

	if (value) {
		hide_element('correction');
	} else if (correction_box) {
		show_element('correction');
	}
}

var correction_box = null;

function set_correction_box(value) {
	correction_box = value;

	if (value) {
		if (correct_answer == false) {
			show_element('correction');
		}
	} else {
		hide_element('correction');
	}
}

function answered_false() {
	show_element('correction');
}

function answered_true() {
	hide_element('correction');
	$('#correct_answer').val('');
}

// sections

function set_section_hidden(checkbox, class_id, lesson_id, section_id) {
	ajax_request('/teacher_section/set_hidden/' + class_id + '?lesson_id=' + lesson_id + '&section_id=' + section_id + '&value=' + check_s(checkbox));
}

// portal pages

function set_portal_page_enabled(portal_page_id, checkbox, portal_id) {
	ajax_request('/portal_page/set_enabled?id=' + portal_page_id + '&portal_id=' + portal_id + '&value=' + check_s(checkbox));
}

// custom html

function set_portal_custom_html_enabled(portal_custom_html_id, checkbox, portal_id) {
	window.location.href = '/portal_custom_htmls/set_enabled?id=' + portal_custom_html_id + '&value=' + check_s(checkbox);
}

// profile pages

function set_profile_tab_enabled(profile_tab_id, checkbox) {
	var n = $('input:checkbox[id^="profile_tab_"]:checked').length;

	if (n > 0) {
		ajax_request('/profile_tab/set_enabled?id=' + profile_tab_id + '&value=' + check_s(checkbox));
	} else {
		$('#' + checkbox.id).attr('checked', 'checked');
		show_error('You cannot disable all User profile tabs. At least one should be enabled.');
	}
}

// portal slides

function set_portal_slide_enabled(portal_slide_id, checkbox, portal_id) {
	ajax_request('/portal_slide/set_enabled?id=' + portal_slide_id + '&portal_id=' + portal_id + '&value=' + check_s(checkbox));
}

// portal icons

function set_show_visitors(portal_icon_id, checkbox) {
	ajax_request('/portal_icon/set_show_visitors?id=' + portal_icon_id + '&value=' + check_s(checkbox));
}

function set_show_users(portal_icon_id, checkbox) {
	window.location.href = '/portal_icon/set_show_users?id=' + portal_icon_id + '&value=' + check_s(checkbox);
}

// portal panels

function set_portal_panel_enabled(portal_panel_id, checkbox, portal_id) {
  ajax_request('/portal_panel/set_enabled?id=' + portal_panel_id + '&portal_id=' + portal_id + '&value=' + check_s(checkbox));
}

// footers

function set_footer_enabled(footer_id, checkbox) {
	window.location.href = '/footers/set_enabled?footer_id=' + footer_id + '&value=' + check_s(checkbox);
}

// boxes

function set_box_enabled(box_id, id, checkbox) {
	if (id == null) {
		ajax_request('/box/set_enabled?box_id=' + box_id + '&value=' + check_s(checkbox));
	} else {
		ajax_request('/box/set_enabled/' + id + '?box_id=' + box_id + '&value=' + check_s(checkbox));
	}
}

function set_box_hideable(box_id, id, checkbox) {
	if (id == null) {
		ajax_request('/box/set_hideable?box_id=' + box_id + '&value=' + check_s(checkbox));
	} else {
		ajax_request('/box/set_hideable/' + id + '?box_id=' + box_id + '&value=' + check_s(checkbox));
	}
}

// monitoring

function set_monitoring(controller, checkbox) {
	ajax_request('/' + controller + '/set_monitoring?value=' + check_s(checkbox));
}

// email sync

function email_sync(type) {
	ajax_request('/inbox/email_sync' + '?type=' + type);
}

function sms_sync(type) {
	ajax_request('/inbox/sms_sync' + '?type=' + type);
}

// teacher assignments

function set_allow_late(controller, assignment_id, checkbox) {
	ajax_request('/' + controller + '/set_allow_late/' + assignment_id + '?value=' + check_s(checkbox));
}

function set_maximum_submissions(controller, assignment_id, dropdown) {
	ajax_request('/' + controller + '/set_maximum_submissions/' + assignment_id + '?value=' + dropdown.value);
}

function override_allow_late(controller, assignment_id, student_id, checkbox) {
	ajax_request('/' + controller + '/override_allow_late/' + assignment_id + '?student=' + student_id + '&value=' + check_s(checkbox));
}

function override_maximum_submissions(controller, assignment_id, student_id, dropdown) {
	ajax_request('/' + controller + '/override_maximum_submissions/' + assignment_id + '?student=' + student_id + '&value=' + dropdown.value);
}

// attachments

function add_attachment(suffix, max, remove_string, the_width, custom) {
	var p = document.createElement("p");

	var line = document.createElement("input");
	line.setAttribute("name", "attachments" + suffix + "[]");
	line.setAttribute("type", "file");
	line.setAttribute("class", "textInput");

	if (the_width != null) {
		if (custom) {
			line.setAttribute("style", "width: " + the_width + "px;float:left");
		} else {
			line.setAttribute("style", "width: " + the_width + "px;");
		}
	}

	p.appendChild(line);

	if (!custom) {
		var text1 = document.createTextNode(' [');
		p.appendChild(text1);
	}

	var a = document.createElement("a");
	a.setAttribute("style", "cursor:pointer;");

	if (custom) {
		a.setAttribute("style", "cursor:pointer;float:right;margin-top:6px");
	}

	a.onclick = function(evt) {
		remove_attachment(this, suffix);
	};

	if (custom) {
		var text2 = document.createElement('i');
		text2.setAttribute("class", "delete");
		a.appendChild(text2);
		p.appendChild(a);
	} else {
		var text2 = document.createTextNode(remove_string);
		a.appendChild(text2);
		p.appendChild(a);
	}

	if (!custom) {
		var text3 = document.createTextNode(']');
		p.appendChild(text3);
	}

	var element = document.getElementById("attachments" + suffix);
	element.appendChild(p);

	var count = element.childNodes.length;

	if (count == 1) {
		hide_element("add_attachment" + suffix + "_option");
	}

	if ((count < max) || (max == 0)) {
		show_element("add_another_attachment" + suffix + "_option");
	} else {
		hide_element("add_another_attachment" + suffix + "_option");
	}
}

function remove_attachment(href, suffix) {
	var node = href.parentNode;
	node.parentNode.removeChild(node);

	var element = document.getElementById("attachments" + suffix);
	var count = element.childNodes.length;

	if (count == 0) {
		hide_element("add_another_attachment" + suffix + "_option");
		show_element("add_attachment" + suffix + "_option");
	} else {
		show_element("add_another_attachment" + suffix + "_option");
	}
}

// original assignment instructions

function pop_up_assignment_instructions(controller, id) {
	if(is_mobile_app_mode()){
		window.parent.postMessage("{\"method\": \"loadBrowser\", \"href\": \"" + '/' + controller + '/instructions/' + id + "\"}", "*");
	}else{
		window.open('/' + controller + '/instructions/' + id, 'instructions', 'height=560px,width=500px,toolbar=yes,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,modal=no');
	}
}

// correct answer for freeform assignments

function pop_up_correct_answer(controller, id) {
	if(is_mobile_app_mode()){
		window.parent.postMessage("{\"method\": \"loadBrowser\", \"href\": \"" + '/' + controller + '/correct_answer/' + id + "\"}", "*");
	}else {
		window.open('/' + controller + '/correct_answer/' + id, 'correctanswer', 'height=560px,width=500px,toolbar=yes,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,modal=no');
	}
}

// account field

function pop_up_field(user_id, field_id) {
	if(is_mobile_app_mode()){
		window.parent.postMessage("{\"method\": \"loadBrowser\", \"href\": \"" + '/user/field/' + user_id + '?field=' + field_id + "\"}", "*");
	}else {
		window.open('/user/field/' + user_id + '?field=' + field_id, 'field', 'height=560px,width=500px,toolbar=yes,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,modal=no');
	}
}

// changes

function toggle_child(checkbox, child_id) {
	if (checkbox.checked) {
		select_all_checkboxes('child_' + child_id);
	} else {
		clear_all_checkboxes('child_' + child_id);
	}
}

function toggle_common_changes(checkbox) {
	if (checkbox.checked) {
		select_all_checkboxes_by_id('common_');
	} else {
		clear_all_checkboxes_by_id('common_');
	}
}

function toggle_common_change(checkbox, count) {
  if (checkbox.checked) {
    select_all_checkboxes_by_id('common_' + count);
  } else {
    clear_all_checkboxes_by_id('common_' + count);
  }  
}

function select_all_checkboxes(prefix) {
	var checkboxes = $('input:checkbox[name^=' + prefix + ']');

	for (var i = 0; i < checkboxes.length; i++) {
		checkboxes[i].checked = true;
	}
}

function clear_all_checkboxes(prefix) {
	var checkboxes = $('input:checkbox[name^=' + prefix + ']');

	for (var i = 0; i < checkboxes.length; i++) {
		checkboxes[i].checked = false;
	}
}

function select_all_checkboxes_by_id(prefix) {
  var checkboxes = $('input:checkbox[id^=' + prefix + ']');

  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = true;
  }
}

function clear_all_checkboxes_by_id(prefix) {
  var checkboxes = $('input:checkbox[id^=' + prefix + ']');

  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }
}

// edit_state

function update_state(select, name) {
	var country = select.options[select.selectedIndex].value;

	if (country == 'United States') {
		show_element(name + '_state');
		hide_element(name + '_other_state');
	} else {
		hide_element(name + '_state');
		show_element(name + '_other_state');
	}
}

// district policies

function set_district_policy(attribute, invert, checkbox) {
	var value = ( invert ? !checkbox.checked : checkbox.checked);
	ajax_request('/policies/set_district_attribute?attribute=' + attribute + '&value=' + (value == true ? 'true' : 'false'));
}

// event

function update_all_day(checkbox) {
	if (checkbox.checked) {
		show_element('all_day');
		hide_element('not_all_day');
		set_checked('is_conference', false);
	} else {
		show_element('not_all_day');
		hide_element('all_day');
	}
}

// recurring event

function update_recurring(checkbox, is_zoomus) {
	if (checkbox.checked) {
		show_element('recurring');
        hide_element('based_on_week');
        $("#is_weekly_based").prop( "checked", false );
		hide_element('event_rsvp');
		set_checked('event_rsvp', false);
		hide_element('event_rsvp_label');
		if(!is_zoomus) {
            hide_element('is_conference');
            set_checked('is_conference', false);
			hide_element('event_conference_label');
        }
		if(get_value('event_repeats') == "Monthly"){
            show_element('is_weekly_based');
            show_element('is_weekly_based_label');
		}
	} else {
		show_element('event_rsvp');
		show_element('event_rsvp_label');
        hide_element('is_weekly_based');
        hide_element('is_weekly_based_label');
        $("#is_weekly_based").prop( "checked", false );
        show_element('based_on_week');
		hide_element('recurring');
        if(!is_zoomus) {
            show_element('is_conference');
            show_element('event_conference_label')
        }
	}
}

function update_rsvp_field(checkbox) {
	if (checkbox.checked) {
		hide_element('event_recurring');
		hide_element('event_recurring_label');
	} else {
		show_element('event_recurring');
		show_element('event_recurring_label');
	}
}

function update_weekly_based(checkbox) {
    if (checkbox.checked) {
    	show_element('based_on_week');
    } else {
        hide_element('based_on_week');
    }
}

// ends none

function update_ends_none(radio_button) {
	if (radio_button.checked) {
		hide_element('ends_on');
		hide_element('ends_after');
		hide_element('after_occurrences');
	}
}

// ends after

function update_ends_after(radio_button) {
	if (radio_button.checked) {
		hide_element('ends_on');
		show_element('after_occurrences');
		$('#event_ends_occurrences').width( 60 );
		show_element('ends_after');
	}
}

// ends on

function update_ends_at(radio_button) {
	if (radio_button.checked) {
		show_element('ends_on');
		hide_element('ends_after');
		hide_element('after_occurrences');
	}
}

function get_repeats_value(){
	$('#event_repeats').width( 80 );
	$('#event_repeat_every').width( 60 );
	$('#event_ends_occurrences').width( 60 );
	var e = document.getElementById("event_repeats");
	var repeats = e.options[e.selectedIndex].text;
	set_repeats_options(repeats);
}

// repeats options

function set_repeats_options(dropdown){
	if(dropdown == 'Daily'){
		show_element('repeats_every_days');
		hide_element('repeats_every_weeks');
		hide_element('repeats_every_months');
		hide_element('repeats_every_years');
        hide_element('weekly_based');
        hide_element('is_weekly_based');
        hide_element('is_weekly_based_label');
        $("#is_weekly_based").prop( "checked", false );
        hide_element('based_on_week');
	}else if(dropdown == 'Weekly'){
		show_element('repeats_every_weeks');
		hide_element('repeats_every_days');
		hide_element('repeats_every_months');
		hide_element('repeats_every_years');
        hide_element('weekly_based');
        hide_element('is_weekly_based');
        hide_element('is_weekly_based_label');
        $("#is_weekly_based").prop( "checked", false );
        hide_element('based_on_week');
	}else if(dropdown == 'Monthly'){
		hide_element('repeats_every_days');
		hide_element('repeats_every_weeks');
		show_element('repeats_every_months');
		hide_element('repeats_every_years');
		show_element('weekly_based');
        show_element('is_weekly_based');
        show_element('is_weekly_based_label');
	}else if(dropdown == 'Yearly'){
		hide_element('repeats_every_days');
		hide_element('repeats_every_weeks');
		hide_element('repeats_every_months');
		show_element('repeats_every_years');
        hide_element('weekly_based');
        hide_element('is_weekly_based');
        hide_element('is_weekly_based_label');
        $("#is_weekly_based").prop( "checked", false );
        hide_element('based_on_week');
	}
}

// repeats scheduled reports

function get_repeats_value_scheduled_reports(){
	$('#report_id').width( 480 );
	$('#repeats').width( 90 );
	$('#repeat_every').width( 50 );
	var e = document.getElementById("repeats");
	var repeats = e.options[e.selectedIndex].text;
	set_repeats_scheduled_reports(repeats);
}

function set_repeats_scheduled_reports(dropdown){
	if(dropdown == 'Minutely') {
		show_element('repeats_every_minutes');
		hide_element('repeats_every_days');
		hide_element('repeats_every_weeks');
		hide_element('repeats_every_months');
		hide_element('repeats_every_years');
	}else if(dropdown == 'Daily'){
		hide_element('repeats_every_minutes');
		show_element('repeats_every_days');
		hide_element('repeats_every_weeks');
		hide_element('repeats_every_months');
		hide_element('repeats_every_years');
	}else if(dropdown == 'Weekly'){
		hide_element('repeats_every_minutes');
		show_element('repeats_every_weeks');
		hide_element('repeats_every_days');
		hide_element('repeats_every_months');
		hide_element('repeats_every_years');
	}else if(dropdown == 'Monthly'){
		hide_element('repeats_every_minutes');
		hide_element('repeats_every_days');
		hide_element('repeats_every_weeks');
		show_element('repeats_every_months');
		hide_element('repeats_every_years');
	}else if(dropdown == 'Yearly'){
		hide_element('repeats_every_minutes');
		hide_element('repeats_every_days');
		hide_element('repeats_every_weeks');
		hide_element('repeats_every_months');
		show_element('repeats_every_years');
	}
}

function update_repeats_schedule_job(checkbox) {
	if (checkbox.checked) {
		show_element('repeats_job');
	} else {
		hide_element('repeats_job');
	}
}

// reports new popup

// period type

function update_period_type_range(radio_button) {
	if (radio_button.checked) {
		hide_element('period_type_last');
		hide_element('period_type_current');
		show_element('period_type_range');
	}
}

function update_period_type_last(radio_button) {
	if (radio_button.checked) {
		show_element('period_type_last');
		hide_element('period_type_current');
		hide_element('period_type_range');
	}
}

function update_period_type_current(radio_button) {
	if (radio_button.checked) {
		hide_element('period_type_last');
		show_element('period_type_current');
		hide_element('period_type_range');
	}
}

// my reports

function set_my_report(report_id, checkbox) {
	ajax_request('/reports/set_my_report?report_id=' + report_id + '&value=' + (checkbox.checked ? 'true' : 'false'));
}

// web conferencing on-click processing


function common_checked_conference_gateway(is_zoomus) {
  set_checked('event_all_day', false);
  $("#event_all_day").prop( "checked", false );
  show_element('not_all_day');
  hide_element('all_day');
  if(!is_zoomus) {
	  hide_element('event_recurring');
	  hide_element('event_recurring_label');
  }
}

function common_unchecked_conference_gateway(is_zoomus) {
  $('#event_form button[type="submit"]').off('click');
  if(!is_zoomus) {
	  show_element('event_recurring');
	  show_element('event_recurring_label');
  }
}

function process_onclick_for_no_conference_gateway(checkbox) {
  if (checkbox.checked) {
    common_checked_conference_gateway();
    $.alert({content : 'Please configure your web conferencing gateway via Admin/Web Conferencing'});
    set_checked('is_conference', false);
  } else {
    common_unchecked_conference_gateway();
  }
}

function process_onclick_for_gotomeeting(checkbox, no_token, consumer_key, state, gototraining) {
  if (checkbox.checked) {
    common_checked_conference_gateway();
    
    if (no_token) {
			if(is_mobile_app_mode()){
				window.parent.postMessage("{\"method\": \"loadBrowser\", \"href\": \"'https://api.getgo.com/oauth/v2/authorize?client_id=" + consumer_key + "&response_type=code&state=" + state + "\"}", "*");
			}else{
                var goto_window = window.open("", "g2mWindow");
				if(!(typeof goto_window === 'undefined' || goto_window === null)) {
					goto_window.close();
				}
				window.open('https://api.getgo.com/oauth/v2/authorize?client_id=' + consumer_key + '&response_type=code&state=' + state, 'g2mWindow', 'width=350, height=500');
			}
    }
	  var goto = gototraining ? 'GotoTraining' : 'GotoMeeting';
    $('#event_form button[type="submit"]').click(function() {
      $('#conference_status').html('<p>Communicating with ' + goto + '... <img style="margin-left:10px" src="/images/loading-16.gif" /></p>').show();
    });
  } else {
    common_unchecked_conference_gateway();
  }
}

function process_onclick_for_zoomus(checkbox, no_account) {
  if (checkbox.checked) {
    common_checked_conference_gateway();
    
    if (no_account) {
			if(is_mobile_app_mode()){
				window.parent.postMessage("{\"method\": \"loadBrowser\", \"href\": \"/zoomus_account/new\"}", "*");
			}else{
				window.open('/zoomus_account/new', 'zoomusWindow', 'width=353, height=276');
			}
    }

    $('#event_form button[type="submit"]').click(function() {
      $('#conference_status').html('<p>Communicating with Zoom.US... <img style="margin-left:10px" src="/images/loading-16.gif" /></p>').show();
    });
  } else {
    common_unchecked_conference_gateway();
  }
}

function process_onclick_for_zoomus_lti(checkbox, is_zoomus) {
  if (checkbox.checked) {
    common_checked_conference_gateway(is_zoomus);
  } else {
    common_unchecked_conference_gateway(is_zoomus);
  }
}

function process_onclick_for_webex(checkbox, no_account) {
  if (checkbox.checked) {
    common_checked_conference_gateway();
    
    if (no_account) {
			if(is_mobile_app_mode()) {
				window.parent.postMessage("{\"method\": \"loadBrowser\", \"href\": \"/webex_account/new\"}", "*");
			}else{
				window.open('/webex_account/new', 'webexWindow', 'width=353, height=350');
			}
    }

    $('#event_form button[type="submit"]').click(function() {
      $('#conference_status').html('<p>Communicating with WebEx... <img style="margin-left:10px" src="/images/loading-16.gif" /></p>').show();
    });
  } else {
    common_unchecked_conference_gateway();
  }
}

function process_onclick_for_skype(checkbox, client_id){
	if (checkbox.checked) {
		common_checked_conference_gateway();
		window.open(
          'https://login.microsoftonline.com/common/oauth2/authorize?response_type=token'+
          '&client_id='+client_id+
          '&resource=https://webdir.online.lync.com'+
          '&redirect_uri='+ location.origin + '/skype/office_login',
          "myWindow","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, copyhistory=yes, width=510, height=550"
      );
	}
	else {
		common_unchecked_conference_gateway();
	}
}

function update_is_conference(type, checkbox, no_token, no_consumer_key, consumer_key, redirect_uri, zoomus_key_nil) {
	if (checkbox.checked) {
		set_checked('event_all_day', false);
		show_element('not_all_day');
		hide_element('all_day');
		hide_element('event_recurring');
		hide_element('event_recurring_label');

    // TODO Avoid this non-object-oriented design - also do we need similar handling for Webex?
		if(type == 'ZoomusGateway') {
			if (zoomus_key_nil == true) {
				window.open('/zoomus_account/new', 'zoomusWindow', 'width=353, height=276');	
			}
		} else if (no_token) {
			if (no_consumer_key) {
				$.alert({content: 'Please configure your web conferencing gateway in Admin / Web Conferencing'});
				set_checked('is_conference', false);
			} else {
				var g2m_login = window.open('https://api.getgo.com/oauth/v2/authorize?client_id=' + consumer_key + '&response_type=code&state=' + state, 'g2mWindow', 'width=350, height=500');
            }
		}

		$('#event_form button[type="submit"]').click(function(){
			$('#conference_status').html('<p>Communicating with the servers... <img style="margin-left:10px" src="/images/loading-16.gif" /></p>').show();
		});
	}else{
		$('#event_form button[type="submit"]').off('click');
		show_element('event_recurring');
		show_element('event_recurring_label');
	}
}

// report

function update_current_month(checkbox) {
  if (checkbox.checked) {
    show_element('organizations_option');
    hide_element('output_option');
  } else {
    hide_element('organizations_option');
    show_element('output_option');
  }
}

// grade

function update_adjust(checkbox) {
	if (checkbox.checked) {
		show_element('adjust');
	} else {
		hide_element('adjust');
	}
}

function update_adjust_link(el) {
	if ($('#adjust').is(':visible')) {
		$(el).parent().find('input[name="adjustment[enable]"]').val(false);
	} else {
		$(el).parent().find('input[name="adjustment[enable]"]').val(true);
	}

	$('#adjust').toggle();
}

// groups

function show_public() {
	show_element('public');
	hide_element('private');
}

function show_private() {
	show_element('private');
	hide_element('public');
}

// lessons

function set_current_lesson(radio_button, position) {
	if (current_lesson == position) {
		current_lesson = null;
		radio_button.checked = false;
		ajax_request('/teacher_lessons/clear_current/' + class_id);
	} else {
		current_lesson = position;
		ajax_request('/teacher_lessons/set_current/' + class_id + '?position=' + position);
	}
}

function set_current_lesson_tile() {
	// TODO: change this method to send lesson id instead
	var checked_lessons = [];
	var lesson_position = 1;

	$('#lessons input:checkbox').each(function () {
		if (this.checked) {
			checked_lessons.push(lesson_position);
		}

		lesson_position++;
	});

	// TODO: translate
	if (checked_lessons.length == 0) {
		$.alert({content: 'Please select one lesson to make current'});
	} else if (checked_lessons.length > 1) {
		$.alert({content: 'You have selected more than one lesson, but you can only make one lesson current'});
	} else {
		var position = checked_lessons[0];

		if (current_lesson == position) {
			current_lesson = null;
			$.get('/teacher_lessons/clear_current/' + class_id, function () {
				window.location.reload();
			});
		} else {
			current_lesson = position;
			$.get('/teacher_lessons/set_current/' + class_id + '?position=' + position, function () {
				window.location.reload();
			});
		}
	}
}

function set_current_lesson_row() {
  var checked_lessons = [];
  var lesson_position = 1;
  $('.instructor_module_view input:checkbox').each(function(){
    if(this.checked){
      checked_lessons.push(lesson_position);
    }
    lesson_position++;
  });
  if(checked_lessons.length == 0){
    $.alert({content: 'Please select one lesson to make current'});
  }else if(checked_lessons.length > 1){
    $.alert({content: 'You have selected more than one lesson, but you can only make one lesson current'});
  }else{
    var position = checked_lessons[0];
    $('.instructor_module_view .imgCrop .current').addClass('hide');
    $('.instructor_module_view > table:nth-of-type(' + position + ') .imgCrop .current').removeClass('hide');

    if (current_lesson == position) {
      current_lesson = null;
      $.get('/teacher_lessons/clear_current/' + class_id, function(){
        $('.instructor_module_view > table:nth-of-type(' + position + ') .imgCrop .current').addClass('hide');
        //window.location.reload();
      });
    } else {
      current_lesson = position;
      $.get('/teacher_lessons/set_current/' + class_id + '?position=' + position, function(){
        //window.location.reload();
      });
    }
  }
}

// launch SCORM

function launch_scorm(url, title, height, width) {
	window.open(url, 'SCORM', 'height=' + height + ',width=' + width + ',toolbar=no,directories=no,location=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,modal=no');
}

function refreshScormNavigation(type){
	if ($('#'+type+'_launch_mode_always').is(':checked')) {
		$('#set_navigation').hide();
	} else {
		$('#set_navigation').show();
	}
}

// configure quiz

function init_quiz_configure(the_controller, the_id) {
	configure_controller = the_controller;
	configure_id = the_id;
}

// school policies

function set_walled_community(checkbox) {
	ajax_request('/policies/set_walled_community?value=' + check_s(checkbox));
}

function set_attribute(attribute, invert, checkbox, confirm_on_true, confirm_on_false) {
	var value = (invert ? !checkbox.checked : checkbox.checked);
	var confirm = (value && confirm_on_true) || (!value && confirm_on_false);
	var uncheck = function () {
		$(checkbox).prop("checked", !$(checkbox).prop("checked"));
	};

	var ajaxCall = function() {
		var url = '/policies/set_attribute?attribute=' + attribute + '&value=' + (value == true ? 'true' : 'false');

		$.ajax({
			url: url,
			method: 'post',
			dataType: 'json',
			success: function(data) {
				if(data && data.info ) {
					show_warning( data.info );
					uncheck();
				}
			}
		});
	};

	if( confirm )
		$.confirm({ content: confirm, confirm: ajaxCall, cancel: uncheck });
	else
		ajaxCall();
}

function set_attribute_with_refresh(attribute, invert, checkbox, from) {
    var value = (invert ? !checkbox.checked : checkbox.checked);
    window.location.href = '/policies/set_attribute_with_refresh?attribute=' + attribute + '&value=' + (value == true ? 'true' : 'false') + '&from=' + encodeURIComponent(from);
}

function set_avatar_attribute(attribute, invert, checkbox, refresh) {
  var value = (invert ? !checkbox.checked : checkbox.checked);
  
  if (refresh) {
    ajax_request('/avatars/set_attribute?attribute=' + attribute + '&value=' + (value == true ? 'true' : 'false'), {asynchronous : false});    
    window.location.href = '/avatars';
  } else {
    ajax_request('/avatars/set_attribute?attribute=' + attribute + '&value=' + (value == true ? 'true' : 'false'));    
  }
}

function set_zapier_attribute(field) {
	var values = [];

	$('input[name^="zapier_events"]').each(function(){
		if($(this).is(':checked')){
			values.push($(this).attr('id').replace('zapier_events_', ''));
		}
	});

	ajax_request('/zapier_configure/set_attribute?value=' + values.join(','));
}

function set_level_display(dropdown) {
	ajax_request('/policies/set_level_display?value=' + dropdown.value);
}

// ecommerce

function set_ecommerce_attribute(attribute, checkbox) {
    ajax_request('/ecommerce/set_attribute?attribute=' + attribute + '&value=' + (checkbox.checked == true ? 'true' : 'false'));
}

function set_toggle_tax_code(checkbox, tax_code) {
    $('.tax_code').attr('disabled', true);
    window.location.href = '/tax_codes/set_enable_tax_code?tax_code=' + tax_code + '&value=' + (checkbox.checked ? 'true' : 'false');
}

function set_cc_processing_gateway(school_id, radio_button) {
	ajax_request('/payment_gateways/set_credit_card_processor_gateway?payment_gateway_id=' + radio_button.value);
}

function set_enable_payment_gateway(payment_gateway_id, checkbox, user_subscriptions_count) {
	if ((!checkbox.checked) && (user_subscriptions_count > 0)) {
		prompt = "Please note that there are "+ user_subscriptions_count + " active subscriptions created with this payment gateway. By disabling this gateway, all subscriptions will be cancelled. Are you sure you want to proceed?";
		$.confirm({
			content: prompt,
			confirm: function() {
				ajax_request('/payment_gateways/set_enable_payment_gateway?payment_gateway_id=' + payment_gateway_id + '&value=' + 'false');
			},
			cancel: function() {
				checkbox.checked = true;
			}
		});
	} else {
		ajax_request('/payment_gateways/set_enable_payment_gateway?payment_gateway_id=' + payment_gateway_id + '&value=' + (checkbox.checked ? 'true' : 'false'));
	}
}

// catalog

function set_catalog_format(dropdown) {
	ajax_request('/class_catalog_configure/set_format?value=' + dropdown.value);
}

function set_category_ordering(dropdown) {
	window.location.href = '/class_catalog_configure/set_category_ordering?value=' + dropdown.value;
}

function set_class_ordering(dropdown) {
	ajax_request('/class_catalog_configure/set_class_ordering?value=' + dropdown.value);
}

// portal

function set_enable_indexing(checkbox) {
	ajax_request('/portal/set_enable_indexing?value=' + (checkbox.checked ? 'true' : 'false'));
}

function set_enable_seo_urls(checkbox) {
	ajax_request('/portal/set_enable_seo_urls?value=' + (checkbox.checked ? 'true' : 'false'));
}

function set_show_contact(checkbox) {
	ajax_request('/portal/set_show_contact?value=' + (checkbox.checked ? 'true' : 'false'));
}

// dashboard

function set_dashboard_organization(checkbox) {
	ajax_request('/dashboard_configure/display_organization?value=' + (checkbox.checked ? 'true' : 'false'));
}

function set_dashboard_item_descriptions(checkbox) {
	ajax_request('/dashboard_configure/display_item_descriptions?value=' + (checkbox.checked ? 'true' : 'false'));
}

// people

function update_administrator(checkbox, index) {
	if (checkbox.checked) {
		show_element('administrator_' + index);
	} else {
		hide_element('administrator_' + index);
	}
}

function update_account_type(administrator) {
	if (administrator) {
		show_element('full_administrator');
	} else {
		hide_element('full_administrator');
	}
}

// rsvp

function update_rsvp(controller, id, calendar_id, event_id, refresh, radio_button, facebox_refresh_url) {
	if (refresh) {
		window.location.href = '/' + controller + '/update_rsvp/' + id + '?calendar=' + calendar_id + '&event=' + event_id + '&value=' + radio_button.value + '&refresh=true';
	} else {
		if(typeof facebox_refresh_url == 'undefined'){
			ajax_request('/' + controller + '/update_rsvp/' + id + '?calendar=' + calendar_id + '&event=' + event_id + '&value=' + radio_button.value);
		}else{
			$.get('/' + controller + '/update_rsvp/' + id + '?calendar=' + calendar_id + '&event=' + event_id + '&value=' + radio_button.value, function(){
				$.facebox({'ajax': facebox_refresh_url});
			});
		}
	}
}

// tips

function show_tip(name) {
	show_element('show_' + name);
	hide_element('hide_' + name);
	ajax_request('/tips/show?value=' + name);
}

function hide_tip(name) {
	show_element('hide_' + name);
	hide_element('show_' + name);
	ajax_request('/tips/hide?value=' + name);
}

// questions

function submit_freeform(operation) {
	set_value('operation', operation);
	submit_form('response');
}

function submit_new_question(operation) {
	set_value('operation', operation);
	submit_form('question');
}

// reports

function submit_report(operation) {
  set_value('operation', operation);
  submit_form('report');
}

function submit_new_report(operation) {
	set_value('operation', operation);
}

// printing

function print_page() {
	if(is_mobile_app_mode()){
		window.parent.postMessage("{\"method\": \"loadBrowser\", \"href\": \"" + window.location + (window.location.search == "" ? "?" : "&") + 'print=true' + "\"}", "*");
	}else {
		window.open(window.location + (window.location.search == "" ? "?" : "&") + 'print=true');
	}
}

function print_this_page() {
	if(is_mobile_app_mode()){
		window.parent.postMessage("{\"method\": \"loadBrowser\", \"href\": \"" + window.location + (window.location.search == "" ? "?" : "&") + 'print=true' + "\"}", "*");
	}else {
		if ($('.search-navigation').length > 0){
			//'($('table').not('.rightColumn table, #Table table, #TableA table, #TableB table, #TableC table, .print_portfolio').length) && (!$('div#transcripts').length)  && (!$('form#userids_passwords').length)) {
			console.log("PRINT: ",window.location);
			if (window.location.hash == "") {
				new_location = window.location + (window.location.search == "" ? "?" : "&") + 'print=true'
			} else {
				new_location = window.location.pathname + (window.location.search == "" ? "?" : "&") + 'print=true' + window.location.hash;
			}
			new_window = window.open(new_location);
			new_window.onload = function () {
				new_window.document.title = window.document.title ;
				new_window.print();
				setTimeout(function(){
					new_window.close();
				}, 300);
			};
		} else {
			fix_total_colspan_for_assignments();
			fix_colspan_for_th();
			window.print();
		}
	}
}

function fix_total_colspan_for_assignments(){
	var mediaQueryList = window.matchMedia('print');
	var value1 = $("tr td.print_total").attr('colspan');
	var value2 = $("tr td.print_overall").attr('colspan');
	mediaQueryList.addListener(function(mql) {
		if (mql.matches) {
			$("tr td.print_total").attr('colspan', value1 - 2);
			$("tr td.print_overall").attr('colspan', value2 - 1);
			console.log('onbeforeprint', value1);
			console.log('onbeforeprint', value2);
		} else {
			$("tr td.print_total").attr('colspan', value1);
			$("tr td.print_overall").attr('colspan', value2);
			console.log('onafterprint');
		}
	});
}

function no_print_column(new_window, selector){
	elements = new_window.document.querySelectorAll(selector);

	for (var i = 0; i < elements.length; i++) {
		elements[i].style.display="none";
	}
}

function fix_colspan_for_th(){
	var mediaQueryList = window.matchMedia('print');
	mediaQueryList.addListener(function(mql) {
		if (mql.matches) {
			$("table th[colspan=2]").attr('colspan',0);
			$("table th[scope=colgroup]").attr('scope','col');
			console.log('onbeforeprint');
		} else {
			$("table th[colspan=0]").attr('colspan',2);
			$("table th[scope=col]").attr('scope','colgroup');
			console.log('onafterprint');
		}
	});
}

function fix_colspan_userid_passwords() {
	var mediaQueryList = window.matchMedia('print');
	mediaQueryList.addListener(function(mql) {
		if (mql.matches) {
			$("table th#to-print[colspan=2]").attr('colspan',0); //fix colspan from members/userid_passwords
			console.log('onbeforeprint');
		} else {
			$("table th#to-print").attr('colspan',2); //fix colspan from members/userid_passwords
			console.log('onafterprint');
		}
	});
}

/**===================
 * ===================
 * DEMO PRINT Function
 * ===================
 * ====== START ======
 * */

function print_pdf(options) {
	var location = window.location;
  var pathname = (location.pathname.indexOf('/', 1) == -1 ? location.pathname + '/index' : location.pathname);
  var query_string = [];

  if (options) {
    $.each(options, function(key, value) {
      query_string.push(key + '=' + encodeURIComponent(value));
    });

    query_string = '?' + query_string.join('&');
  } else {
    query_string = location.search;
  }

  if(is_mobile_app_mode()){
    window.parent.postMessage("{\"method\": \"loadBrowser\", \"href\": \"" + location.protocol + "//" + location.host + pathname + ".pdf" + query_string + "\"}", "*");
  }else{
    window.open(location.protocol + "//" + location.host + pathname + ".pdf" + query_string);
  }
}

function popup_with_print(data, title, window_parent) {
	var windowUrl = 'Student list';
	var uniqueName = new Date();
	var windowName = 'Print' + uniqueName.getTime();
	var printWindow = window.open(windowUrl, windowName, 'left=0,top=0,width=1000,height=700');

	printWindow.document.write('<html><head><title>' + title + '</title>');
	printWindow.document.write('<link href="/stylesheets/base-colors-user.css" media="screen,print" rel="stylesheet" type="text/css" /> \
    		<link href="/stylesheets/themes/monochrome_user.css" media="screen,print" rel="stylesheet" title="theme" type="text/css"> \
    		<link href="/stylesheets/default-styles.css" media="screen,print" rel="stylesheet" type="text/css" /> \
    		<link href="/stylesheets/styles-user.css" media="screen,print" rel="stylesheet" type="text/css" /> \
    		<link href="/stylesheets/extra-user.css" media="screen,print" rel="stylesheet" type="text/css" /> \
    		<link href="/stylesheets/fonts/font-all.css" media="screen,print" rel="stylesheet" type="text/css" /> \
    		<link href="/stylesheets/facebox.css?2" media="screen,print" rel="stylesheet" type="text/css" /> \
    		<link href="/stylesheets/print.css?2" media="screen,print" rel="stylesheet" type="text/css" />');
	printWindow.document.write('</head><body >');
	printWindow.document.write(data);
	printWindow.document.write('</body></html>');
	printWindow.document.close();

	printWindow.focus();
	printWindow.print();
	setTimeout(function(){
		printWindow.close();
		window_parent.close();
	}, 1000);
}

/**===================
 * ======= END =======
 * ===================
 * */

function print_pdf_select(selected) {
	var location = window.location;
	var pathname = (location.pathname.indexOf('/', 1) == -1 ? location.pathname + '/index' : location.pathname);
	var url = location.protocol + "//" + location.host + pathname + ".pdf" + location.search;

	// should really avoid adding duplicate select[] if already in locaation.search
	for (var i = 0; i < selected.length; i++) {
		if (i == 0) {
			if (location.search.length == 0) {
				url += '?';
			} else {
				url += '&';
			}
		} else {
			url += '&';
		}

		url += ("select[]=" + selected[i]);
	}

	if(is_mobile_app_mode()){
		window.parent.postMessage("{\"method\": \"loadBrowser\", \"href\": \"" + url + "\"}", "*");
	}else{
		window.open(url);
	}
}

function help_page(anchor, superuser) {
	var url = ((anchor == null) ? '/help' : '/help/#' + anchor);

	if (superuser) {
		window.open(url, 'Help', 'height=700px,width=520px,location=yes,toolbar=no,directories=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes,modal=no');
	} else {
		window.open(url, 'Help', 'height=700px,width=520px,toolbar=no,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,modal=yes');
	}
}

function editor_help() {
	window.open('/help/editor', 'Help', 'height=700px,width=520px,toolbar=no,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,modal=yes');
}

function getScrollXY() {
	var scrOfX = 0, scrOfY = 0;

	if ( typeof (window.pageYOffset) == 'number') {
		// Netscape compliant
		scrOfY = window.pageYOffset;
		scrOfX = window.pageXOffset;
	} else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
		// DOM compliant
		scrOfY = document.body.scrollTop;
		scrOfX = document.body.scrollLeft;
	} else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
		// IE6 standards compliant mode
		scrOfY = document.documentElement.scrollTop;
		scrOfX = document.documentElement.scrollLeft;
	}

	return [scrOfX, scrOfY];
}

function submit_form_with_confirm(form_id, event, prompt) {
	$.confirm({
		content: prompt,
		confirm: function(){
			var form = $('#' + form_id);
			form.attr('method', 'POST');
			form.attr('action', event.href);
			form.submit();
		}
	});
}

function submit_form_without_confirm(form_id, event) {
	var form = $('#' + form_id);
	form.attr('method', 'POST');
	form.attr('action', event.href);
	form.submit();
}

// launch video

function launch_video(id, url, height, width, mobile_app, resume_video) {
	var extra_params = "&require_video_completion=" + (typeof window.require_video_completion !== 'undefined').toString() + "&resume_video=" + (typeof resume_video !== 'undefined').toString();

	if (mobile_app) {
		window.parent.postMessage("{\"method\": \"loadBrowser\", \"href\": \"/video_player?id=" + id + "&url=" + url + extra_params + "\"}", "*");
	} else {
		window.open('/video_player?id=' + id + '&url=' + url + extra_params, 'VIDEO', 'height=' + height + 'px,width=' + width + 'px,toolbar=no,directories=no,location=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,modal=no');
	}
}

// launch popup

function popup(title, url, height, width) {
	window.open(url, title, 'height=' + height + 'px,width=' + width + 'px,toolbar=no,directories=no,location=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,modal=no');
}

// table item selection

function toggle_all(checkbox, disable_message, target) {
	disable_message = disable_message || false;
	target = target || false;

	var form = $(checkbox).closest('form');
	console.log('form = ' + form);
	var form_id = form.attr('id');
	console.log('form_id = ' + form_id);
	var checkboxes;
	var data = form.data('table');

	if (target) {
		checkboxes = $(target).find('tr td:nth-child(1) input[type=checkbox]');
	} else {
		checkboxes = form.find('tr td:nth-child(1) input[type=checkbox]');
	}

	console.log('data = ' + data + ', data.count = ' + data.count + ', data.size = ' + data.size + ' disable_message = ' + disable_message);
	if ((data != null) && (data.count > data.size) && !disable_message) {
		console.log('should check if to show message');
		if (checkbox.checked) {
			var tr = form.find('tr:eq(0)');
			console.log('should show message');
			tr.after("<tr><td style='background:#E0F1ff;' colspan='100'>" + you_have_selected_all_text + " <a class='select_all' href='javascript:select_all_items(\"" + form_id + "\");' style='vertical-align:0;'>" + select_all_items_text + "</a>" + "</td></tr>");
		} else {
			console.log('should delete message');
			form.find('tr:eq(1)').remove();
		}
	}

	for (var i = 0; i < checkboxes.length; i++) {
		var row_checkbox = checkboxes[i];
		row_checkbox.checked = checkbox.checked;
		var row = $(row_checkbox).closest('tr');

		if (checkbox.checked) {
			row.addClass('highlight');
		} else {
			row.removeClass('highlight');
		}
	}

	if ((data != null) && data.popup) {
		if (checkbox.checked) {
			show_options_bar(form);
		} else {
			hide_options_bar(form);
		}
	}
}

function toggle(checkbox, event) {
	// toggle the table row background color
	var form = $(checkbox).closest('form');

	if ((event.shiftKey == 1) && (last_toggled_id != null) && (last_toggled_id != checkbox.value)) {
		var checkboxes = form.find('input[type=checkbox]');

		// find the one that was last tagged
		for (var i = 0; i < checkboxes.length; i++) {
			var row_checkbox = checkboxes[i];

			if (row_checkbox.value == last_toggled_id) {
				start = i;
			}

			if (row_checkbox.value == checkbox.value) {
				stop = i;
			}
		}

		if (start > stop) {
			var tmp = start;
			start = stop;
			stop = tmp;
		}

		for (var i = start; i <= stop; i++) {
			var row_checkbox = checkboxes[i];
			row_checkbox.checked = checkbox.checked;
			var row = $(row_checkbox).closest('tr');
			checkbox.checked ? row.addClass('highlight') : row.removeClass('highlight');
		}
	} else {
		var row = $(checkbox).closest('tr');
		checkbox.checked ? row.addClass('highlight') : row.removeClass('highlight');
	}

	// remember the last toggle
	last_toggled_id = checkbox.value;

	// update top bar
	update_options_bar(form);
}

function checked_toggle(id) {
	var checkbox = $(":checkbox[value=" + id + "]");
	var row = $(checkbox).closest('tr');
	row.css('background', '#FFF6BA');
}

function toggle_all_lessons(value, link) {
	$('#lessons').find('input[name="select[]"]').prop('checked', value);
	$(link).attr('onclick', 'toggle_all_lessons(' + (value ? 'false' : 'true') + ', this)');

	if (value) {
		$(link).html('<i class="checkboxUnchecked"></i>' + deselect_all_text);
		$('.lesson_boxes > div').addClass('highlight');
		$('.modern_module_row').addClass('highlight');
	} else {
		$(link).html('<i class="checkboxChecked"></i>' + select_all_text);
		$('.lesson_boxes > div').removeClass('highlight');
		$('.modern_module_row').removeClass('highlight');
	}
}

function toggle_all_goals(value, link) {
	$('.goal_list').find('input[name="select[]"]').prop('checked', value);
	$(link).attr('onclick', 'toggle_all_goals(' + (value ? 'false' : 'true') + ', this)');

	if (value) {
		$(link).html('<i class="checkboxUnchecked"></i>' + deselect_all_text);
		$('.goal_list .modern_module_row').addClass('highlight');
	} else {
		$(link).html('<i class="checkboxChecked"></i>' + select_all_text);
		$('.goal_list .modern_module_row').removeClass('highlight');
	}
}

function toggle_all_bundle_items(value, link) {
    $('.goal_list').find('input[name="select[]"]').prop('checked', value);
    $(link).attr('onclick', 'toggle_all_bundle_items(' + (value ? 'false' : 'true') + ', this)');

    if (value) {
        $(link).html('<i class="checkboxUnchecked"></i>' + deselect_all_text);
        $('.goal_list .modern_module_row').addClass('highlight');
    } else {
        $(link).html('<i class="checkboxChecked"></i>' + select_all_text);
        $('.goal_list .modern_module_row').removeClass('highlight');
    }
}

function toggle_all_subscription_items(value, link) {
    $('.goal_list').find('input[name="select[]"]').prop('checked', value);
    $(link).attr('onclick', 'toggle_all_subscription_items(' + (value ? 'false' : 'true') + ', this)');

    if (value) {
        $(link).html('<i class="checkboxUnchecked"></i>' + deselect_all_text);
        $('.goal_list .modern_module_row').addClass('highlight');
    } else {
        $(link).html('<i class="checkboxChecked"></i>' + select_all_text);
        $('.goal_list .modern_module_row').removeClass('highlight');
    }
}

function goal_row_click(event, element_id){
  if (!$(event.target).is("label") && !$(event.target).is("a")) {
    window.location = document.getElementById(element_id).querySelector('.goal_list h2 > a').href;
  }
}

function bundle_item_row_click(event, element_id){
    if (!$(event.target).is("label") && !$(event.target).is("a")) {
        window.location = document.getElementById(element_id).querySelector('.goal_list h2 > a').href;
    }
}

function subscription_item_row_click(event, element_id){
    if (!$(event.target).is("label") && !$(event.target).is("a")) {
        window.location = document.getElementById(element_id).querySelector('.goal_list h2 > a').href;
    }
}
function toggle_all_users(value, link) {
	$('.user_boxes').find('input[name="select[]"]').prop('checked', value);
	$(link).attr('onclick', 'toggle_all_users(' + (value ? 'false' : 'true') + ', this)');

	if (value) {
		$(link).html('<i class="checkboxUnchecked"></i>' + deselect_all_text);
		$('.user_boxes > a').addClass('highlight');
		
		if ($('.search-navigation').length > 0) {
			$('#select_all_warning').html("<p>" + you_have_selected_all_text + " <a href='javascript:select_all_tiled_users();'>" + select_all_items_text + "</a></p>").show();
		}
	} else {
		$(link).html('<i class="checkboxChecked"></i>' + select_all_text);
		$('.user_boxes > a').removeClass('highlight');
		$('#select_all_warning').hide();
	}
}

function toggle_all_awards(value, link) {
	$('.user_boxes').find('input[name="select[]"]').prop('checked', value);
	$(link).attr('onclick', 'toggle_all_awards(' + (value ? 'false' : 'true') + ', this)');

	if (value) {
		$(link).html('<i class="checkboxUnchecked"></i>' + deselect_all_text);
		$('.user_boxes > a').addClass('highlight');
		
		if ($('.search-navigation').length > 0) {
			$('#select_all_warning').html("<p>" + you_have_selected_all_text + " <a href='javascript:select_all_tiled_awards();'>" + select_all_items_text + "</a></p>").show();
		}
	} else {
		$(link).html('<i class="checkboxChecked"></i>' + select_all_text);
		$('.user_boxes > a').removeClass('highlight');
		$('#select_all_warning').hide();
	}
}
function init_options_bar(form_id) {
	var form = $('#' + form_id);
	update_options_bar(form);
}

function update_options_bar(form) {
	var data = form.data('table');

	if (data != null && data.popup) {
		if (form.find("input[type=checkbox][name='select[]']:checked").length) {
			show_options_bar(form);
		} else {
			hide_options_bar(form);
		}
	}
}

function show_options_bar(container) {
	var div = container.find('.optionsRibbonTable_separate');

	if (div.length) {
		div.css('display', '');
	}
}

function hide_options_bar(container) {
	var div = container.find('.optionsRibbonTable_separate');

	if (div.length) {
		div.css('display', 'none');
	}
}

function show_options_bar_for(form_id) {
	var form = $('#' + form_id);
	var data = form.data('table');

	if (data != null && data.popup) {
		var table = form.find('table');
		show_options_bar(table);
	}
}

function select_all_items(form_id) {
	var form = $('#' + form_id);
	var form_id = form.attr('id');
	var tr = form.find('tr:eq(1)');
	var td = tr.find('td');
	td.html(all_items_selected_text + " <a class='select_all' href='javascript:unselect_all_items(\"" + form_id + "\");' style='vertical-align:0;'>" + clear_selection_text + "</a>");
	td.after("<input type='hidden' name='select_all' value='true'>");
}

function unselect_all_items(form_id) {
	var form = $('#' + form_id);
	form.find('tr:eq(1)').remove();
	var checkboxes = form.find('input[type=checkbox]');

	for (var i = 0; i < checkboxes.length; i++) {
		var checkbox = checkboxes[i];
		checkbox.checked = false;
		var row = $(checkbox).closest('tr');
		row.removeClass('highlight');
	}

	var data = form.data('table');

	if (data != null && data.popup) {
		var table = form.find('table');
		hide_options_bar(table);
	}
}

function select_all_tiled_users() {
	$('.user_boxes').before("<input type='hidden' name='select_all' id='select_all_flag' value='true'>");
	$('#select_all_warning').html("<p>" + all_items_selected_text + " <a class='select_all' href='javascript:unselect_all_tiled_users();' style='vertical-align:0;'>" + clear_selection_text + "</a></p>");
}

function unselect_all_tiled_users() {
	$('#select_all_flag').remove();
	toggle_all_users(false, '#toggle_users_link');
}

function set_select(form_id, checkbox) {
	var checkboxes = $('input[name="' + form_id + '[]"]');

	for (var i = 0; i < checkboxes.length; i++) {
		checkboxes[i].checked = checkbox.checked;
	}
}

// checkbox utility

function check_s(checkbox) {
	return (checkbox.checked == true ? 'true' : 'false');
}

// optionsRibbon toggle

function optionsRibbonToggle(name1, name2, thisLink) {
	$(thisLink).closest('ul').siblings().removeClass('selected');
	$(thisLink).closest('ul').addClass('selected');
	show_element(name1);
	hide_element(name2);
}

// abstractions

function expand(label) {
	show_element('remaining_' + label);
	hide_element(label);
}

function collapse(label) {
	show_element(label);
	hide_element('remaining_' + label);
}

function show_element(name) {
	$('#' + name).show();
}

function hide_element(name) {
	$('#' + name).hide();
}

function set_style_element(name, style) {
	$('#' + name).css(style);
}

function highlight_element(name, parent) {
	if( parent) {
		$('#' + name).parent().effect("highlight", {}, 3000);
	} else {
		$('#' + name).effect("highlight", {}, 3000);
	}
}

function fade_element(name) {
	$('#' + name).fadeOut();
}

function remove_element(name) {
	$('#' + name).remove();
}

function focus_element(name) {
	if(!is_mobile_app_mode()){
		$('#' + name).focus();
	}
}

function clear_value(name) {
	$('#' + name).val('');
}

function get_value(name) {
	return $('#' + name).val();
}

function set_value(name, value) {
	$('#' + name).val(value);
}

function is_checked(name) {
	return $('#' + name).attr('checked');
}

function set_checked(name, value) {
	return $('#' + name).attr('checked', value);
}

function set_html(name, value) {
	$('#' + name).html(value);
}

function ajax_request(url, options) {
	if (options == null) {
		$.ajax({
			url : url,
			type : 'POST'
		});
	} else {
		$.ajax({
			url : url,
			type : 'POST',
			async : options.asynchronous
		});
	}
}

function get_ajax_response(url, data, async) {
	var result;

	if (async == null) {
		$.ajax({
			url : url,
			type : 'POST',
			dataType: data,
			success: function(response) {
				result = response;
			}
		});
	} else {
		$.ajax({
			url : url,
			type : 'POST',
			dataType: data,
			async : async,
			success: function(response) {
				result = response;
			}
		});
	}

	return result;
}

function get_ajax_response_async(url, data, callback) {
	$.ajax({
		url : url,
		type : 'POST',
		dataType: data,
		success: callback
	});
}

function ajax_update(name, url, options) {
	$.post(url, function(data) {
		set_html(name, data);
	});
}
function ajax_update_data(name, url, options) {
	data = options;
	$.post(url, data, function (data) {
		set_html(name, data);
	});
}

function submit_form(name) {
	$('#' + name).submit();
}

// portal login

function find_portal() {
	$('nav.mainNav ol > li:last-child div').removeClass('dDownShow');

	$.facebox({
		'ajax' : '/info/find_portal?name=' + $('#portal_name').val()
	});
}

function find_portal_new() {
	if($('#portal_name').val().length > 0) {
		$.facebox({
			'ajax': '/info/find_portal?name=' + $('#portal_name').val()
		});
	}else{
		$('#portal_name').css('border', '1px solid red').focus();
	}
}

function submit_signup(){
	add_progress($('.signupForm button[type="submit"]'));
}

// form concatenation for authorize.net integration

function concat_form_fields() {
	$('#x_exp_date').val($('#x_month').val() + $('#x_year').val().substr(2,2));
}

// display utilities

function fade_alert() {
	closeAlertTimer = setInterval(function() {
		$('div.info').animate({
			height : '0',
			opacity : '0'
		}, 500, function() {
			$(this).css('display', 'none');
		});
	}, 3000);
}

function get_maximum_upload_size() {
	return window.maxUploadLimit + 'mb';
}

// show timer function

function show_quiz_timer(id) {
	$("#" + id).on("change", function(){
		if ( $(this).is(':checked') ) {
			show_element('timer');
		} else {
			hide_element('timer');
		}
	});
}

// show options

function show_assignment_option_check(changed, hidden) {
  $("#" + changed).on("change", function(){
    if ( $(this).is(':checked') ) {
      show_element(hidden);
    } else {
      hide_element(hidden);
    }
  });
}

function show_assignment_option_radio(changed, value, hidden) {
  $("input[id^='" + changed + "']").on("change", function(){
    if ( $(this).val() == value ) {
      show_element(hidden);
    } else {
      hide_element(hidden);
    }
  });
}

// login credentials

function display_login_credentials(secure_protocol, current_host, ssl_host, user_id, auth_token) {
	if (ssl_host.toUpperCase() == current_host.toUpperCase()) {
		$.ajax({
			type : 'GET',
			url : secure_protocol + '://' + current_host + '/user/get_login_info/' + user_id + (auth_token ? '?one_time_auth_token=' + auth_token : ''),
			dataType : 'jsonp',
			success : function(json, text_status, jqXHR) {
				$('#userid_placeholder').html(json.userid);
				$('#password_placeholder').html(json.password);
			},
			error : function(jqXHR, text_status, errorThrown) {
				$.alert({content: 'error ' + text_status});
			}
		});
	} else {
		$.ajax({
			type : 'GET',
			url : 'http://' + current_host + '/authentication/get_auth_token',
			dataType : 'jsonp',
			success : function(json, text_status, jqXHR) {
				display_login_credentials(secure_protocol, ssl_host, ssl_host, user_id, json.auth_token);
			},
			error : function(jqXHR, text_status, errorThrown) {
				$.alert({content: 'error ' + text_status});
			}
		});
	}
}

function display_users_credentials(secure_protocol, current_host, ssl_host, controller, id, auth_token, key) {
	if (ssl_host.toUpperCase() == current_host.toUpperCase()) {
		var select = [];

		$('tr[id^="user_"]').each(function() {
			select.push($(this).attr('id').split('_')[1]);
		});

		$.ajax({
			type : 'GET',
			data : {
				'select' : select
			},
			url : secure_protocol + '://' + current_host + '/' + controller + '/get_login_info' + (id ? ('/' + id) : '') + (auth_token ? '?one_time_auth_token=' + auth_token : '') + (key ? (auth_token ? '&key=' : '?key=') + key : ''),
			dataType : 'jsonp',
			success : function(json, text_status, jqXHR) {
				for (var i = 0; i < json.users.length; i++) {
					var user = json.users[i];
					$('#userid_placeholder_' + user.id).html(user.userid);
					$('#password_placeholder_' + user.id).html(user.password);
				}
			},
			error : function(jqXHR, text_status, errorThrown) {
				$.alert({content: 'error ' + text_status});
			}
		});
	} else {
		$.ajax({
			type : 'GET',
			url : 'http://' + current_host + '/authentication/get_auth_token',
			dataType : 'jsonp',
			success : function(json, text_status, jqXHR) {
				display_users_credentials(secure_protocol, ssl_host, ssl_host, controller, id, json.auth_token, key);
			},
			error : function(jqXHR, text_status, errorThrown) {
				$.alert({content: 'error ' + text_status});
			}
		});
	}
}

// OnChange function for grading

function no_grading() {
	var id = 'assignmentScore';
	var el = $('#facebox [name="assignment[grading]"]');
	var visible = $('#' + id).css("display");

	if (visible === 'none') {
		el.parent().find('> label').addClass('min-w-76');
	}

	el.on('change', function() {
		var val = $(this).val().toLowerCase();
		var chd = $(this).parent().find('span:first-child');

		if (val === 'not graded') {
			$('#' + id).hide();
			chd.next('label').addClass('min-w-76');
		} else {
			$('#' + id).show();
			$(this).parent().find('> label').removeClass('min-w-76');
		}
	});
}

function no_grading_list() {
	var el = $('[name$="[grading]"]');

	el.on('change', function() {
		var id = $(this).parent().attr('id');
		var val = $(this).val().toLowerCase();
		var mel = $('.max_score_' + id + ', .max_weight_' + id);

		if (val === 'not graded') {
			mel.find('span:first-child').show();
			mel.find('span:last-child').hide();
		} else {
			mel.find('span:first-child').hide();
			mel.find('span:last-child').show();
		}
	});
}

/* rule action message support */

function show_message_content() {
	$('#message_type input').click(function() {
		if ($('#rule_action_message_type_custom').is(':checked')) {
			$('#canned_message').hide();
			$('#custom_message').show();
			$('#notification_type').show();
		} else if ($('#rule_action_message_type_canned').is(':checked')) {
			$('#canned_message').show();
			$('#custom_message').hide();
			$('#notification_type').show();
		} else { // none
      $('#canned_message').hide();
      $('#custom_message').hide();
      $('#notification_type').hide();
		}
	});
}

/**
 * =====================================================================
 * Session timeout functionality. Save everything in cookies so it will
 * be available inside every window of the browser.
 * Cookies expire on browser close ( = no expiration date specified )
 * =====================================================================
 * ===============================START=================================
 * =====================================================================
 */

// session timeout -> Everything goes into cookies
// session_timeout_warning should not be cookie in order to open the warning pop-up in every window

var session_timeout_timer = null;
var next_countdown_value = null;
var session_timeout_warning = false;
var SESSION_WARNING_SECONDS = 30;
var SCAN_FRAME_SECONDS = 5;

function session_timeout_after(seconds) {
	set_lms_cookie('session_timeout_seconds', parseInt(seconds), '/');
	add_events(document);
	frame_activity_monitor();
	reset_session_timeout_timer();
	session_timeout_timer = setInterval(decrement_session_countdown, 1000);
}

function add_events(el, frame) {
	$(el).on('click mouseup mousedown touchend touchstart touchmove mousewheel mousemove keypress keydown', function(e) {
		if (frame) {
			window.parent.session_activity_detected();
		} else {
			session_activity_detected();
		}
	});
}

function reset_session_timeout_timer() {
	set_lms_cookie('session_timeout_countdown', get_lms_cookie('session_timeout_seconds'), '/');
	next_countdown_value = parseInt(get_lms_cookie('session_timeout_seconds')) - 1;
	session_timeout_warning = false;
}

function decrement_session_countdown() {
	// make sure that only one window updates the countdown cookie
	if ((parseInt(get_lms_cookie('session_timeout_countdown')) - 1) == next_countdown_value) {
		set_lms_cookie('session_timeout_countdown', parseInt(get_lms_cookie('session_timeout_countdown')) - 1, '/');
	}

	next_countdown_value = parseInt(get_lms_cookie('session_timeout_countdown')) - 1;

	if ((parseInt(get_lms_cookie('session_timeout_countdown')) <= SESSION_WARNING_SECONDS) && session_timeout_warning == false) {
		session_timeout_warning = true;
		$.facebox({'ajax' : '/session_timeout/idle'});
	} else if (parseInt(get_lms_cookie('session_timeout_countdown')) <= 0) {
		clearInterval(session_timeout_timer);
		window.location = '/log_out?timeout=true';
	} else if ((parseInt(get_lms_cookie('session_timeout_countdown')) > SESSION_WARNING_SECONDS) && session_timeout_warning == true) {
		session_timeout_warning = false;
		$.facebox.close();
	}
}

function session_activity_detected() {
	if (session_timeout_warning && $('#facebox').find('.idle').length != 0) {
		$.facebox.close();
	}

	reset_session_timeout_timer();
}

// Frame activity monitor

function frame_activity_monitor(win) {
	function getInnerFrame(win) {
		win = (win || window);
		var frames = win.frames;

		if (frames.length > 0) {
			var i;

			for (i=0; i < frames.length; i++) {
				add_events(frames[i], true);

				getInnerFrame(frames[i]);
			}
		} else {
			return win;
		}
	}

	if (win) {
		setInterval(function() {
			if (win.length) {
				getInnerFrame(win);
			}
		}, SCAN_FRAME_SECONDS * 1000);
	} else if (window.frames.length > 0) {
		setInterval(function() {
			getInnerFrame();
		}, SCAN_FRAME_SECONDS * 1000);
	}
}

function display_timeout() {
	if ($('#facebox').find('.timeout').length == 0) {
		$.facebox({'ajax': '/session_timeout/timeout'});
	}
}

function display_sync_popup(class_id, sync_job_id) {
  if ($('#facebox').find('.sync_popup').length == 0) {
    $.facebox({'ajax': '/session_group/sync_from_job/' + class_id + '?sync_job_id=' + sync_job_id});
  }
}

function display_moved() {
  if ($('#facebox').find('.moved').length == 0) {
    $.facebox({'ajax': '/portal_moved/message'});
  }
}

function display_deleted() {
	if ($('#facebox').find('.deleted').length == 0) {
		$.facebox({'ajax': '/info/deleted'});
	}
}

function display_sso_error(message, title) {
	if ($('#facebox').find('.sso').length == 0) {
		$.facebox({'ajax': '/sso/error?error=' + encodeURIComponent(message) + (title ? '&title=' + encodeURIComponent(title) : '')});
	}
}

/**
 * ======================================
 * Standard GET/SET functions for COOKIES
 * ======================================
 */

function get_lms_cookie(name) {
	var value = document.cookie;
	var start = value.indexOf(" " + name + "=");

	if (start == -1) {
		start = value.indexOf(name + "=");
	}

	if (start == -1) {
		value = null;
	} else {
		start = value.indexOf("=", start) + 1;
		var end = value.indexOf(";", start);

		if (end == -1) {
			end = value.length;
		}

		value = unescape(value.substring(start, end));
	}

	return value;
}

function set_lms_cookie(name, value, path, exdays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	value = escape(value);

	if (path != null) {
		value += "; path=" + path;
	}

	if (exdays != null) {
		value += "; expires=" + exdate.toUTCString();
	}

	document.cookie = name + "=" + value;
}

/**
 * =====================================================================
 * Here is where the dropdown for messages magic happens:
 * - infinite scroll with ajax
 * - view message / send message popups
 * - keep mouse wheel scroll inside the div
 * - auto-suggest multiple receivers with remove option ( tag style )
 * - ajax delete
 * - reply, reply to forum and send message using ajax
 * - IE focus forcer...
 * =====================================================================
 * ===============================START=================================
 * =====================================================================
 */

/* Message box get message */
var box_offset = 0;
var box_limit = 10;
var scroll_check_mess =  scroll_check_not = true;

function call_for_messages(container, controller) {
	var holder = $(container).find('.dropDown ul');
	isolatedScroll($(container).find('.dropDown .scroll'));
	holder.html('').append('<div class="loader"></div>');
	box_offset = 0;

	if (holder.find('li').length == 0) {
		ajax_call_for_messages(holder, container, controller);

		if (container == '.messagesHolder' && scroll_check_mess) {
			exec_scroll(holder, container, controller);
		} else if (container == '.notificationsHolder' && scroll_check_not) {
			exec_scroll(holder, container, controller);
		}
	}

	if (container == '.messagesHolder') {
		just_read_message();
	} else if (container == '.notificationsHolder') {
		just_read_notification();
	}
}

function ajax_call_for_messages(holder, container, controller) {
	$.ajax({
		type : "POST",
		url : "/" + controller + "/get_messages",
		data : {
			offset : box_offset,
			limit : box_limit
		},
		dataType : "json",
		async : false,
		success : function(data) {
			var k_read_at = false;

			holder.find('.loader').remove();

			if (data.count == 0) {
				var empty_message = (controller == 'inbox' ? no_messages_text : no_notifications_text);
				holder.html('').append('<p align="center">' + empty_message + '</p>');
			} else if (data.count >= box_offset) {
				for (var i = 0; i < data.messages.length; i++) {
					var message = data.messages[i];
					var class_name = message.class_name;
					var forum = (message.forum ? message.forum : null);
					var html = '';

					html += '<li class="ms-holder message-' + message.id + '" id="message-' + message.id + '">';
					html += '<a href="/' + controller + '/show?popup=true&' + (controller == 'inbox' ? 'message' : 'notification' ) + '=' + message.id + '"  onclick="return popup_clicked(this);" class="ms-main-open">';
					html += '<span class="ms-image"><img src="' + message.photo + '" width="30" height="30" alt="" /></span>';
					html += '<span class="ms-user">' + message.first_name + ' ' + message.last_name;
					html += ( class_name ? ' - <span class="ms-class-name">' + class_name + '</span>' : '');
					html += ( forum ? ' <span class="ms-arrow"></span> ' + forum : '');
					html += '</span>';
					html += '<span class="ms-subject">' + message.name + '</span>';
					html += '<span class="ms-date">' + message.date + '</span>';
          html += '</a>';

          html += '<a href="#" excalibur-click="load_un_read_bindings" class="ms-status-holder">';

					if (message.read_at) {
            html += '<span class="ms-status left" data-tooltip="' + mark_as_unread_text + '"><i class="tick icnColor"></i><span class="textOffScreen">Mark as unread</span></span>';
					} else {
            html += '<span class="ms-status unread left" data-tooltip="' + mark_as_read_text + '"><i class="xCross icnColor"></i><span class="textOffScreen">Mark as read</span></span>';
						k_read_at = true;
					}

					html += '</a>';
					html += '</li>';

					holder.append(html);

          $('#message-' + message.id + ' a.ms-main-open').on('click', function() {
            var parent =  $(this).parent();

            if (parent.hasClass('ms-unread')) {
              parent.find('.ms-status-holder').html('<span class="ms-status" title="' + mark_as_unread_text + '"><i class="tick icnColor"></i><span class="textOffScreen">Mark as unread</span></span>');

              // change the newAlert counter value after unread message was opened
              var newAlert = $(this).parents(container).find('.newAlert');
              var messIcon = newAlert.next('i');

              if (newAlert.length != 0) {
                var newAlertValue = parseInt(newAlert.text());

                if (newAlertValue > 1) {
                  newAlert.text(newAlertValue - 1);
                } else {
                  messIcon.removeClass('messages').addClass('unread');
                  newAlert.remove();
                }
              }
            }
          });

				}
			}

			if ( k_read_at ) {
				$(container).find('.markAllAsRead').show();
			}

			box_offset += 10;
			isolatedScroll($(container).find('.dropDown .scroll'));
		}
	});
}

function load_un_read_bindings() {
    var el = this;
    var id = el.parent('li').attr('id').split('-')[1];

    if (el.parents('.notificationsHolder').length > 0) {
      un_read_update_status('notifications', '.notificationsHolder', id);
    } else if (el.parents('.messagesDropDown').length > 0) {
      un_read_update_status('inbox', '.messagesHolder', id);
    }
}

function un_read_update_status(controller, container, id) {
  $.post('/' + controller + '/mark_un_read', {posting: id}, function(response) {
    if (response.status === 'ok') {
      un_read_action(container, id);
    } else {
      alert(response.message);
    }
  });
}

function un_read_action(container, id) {
  var el = $(container + ' li.message-' + id);
  var status = el.find('span.ms-status i');

  if (status.attr('class').indexOf('xCross') != -1) {
    status.removeClass('xCross').addClass('tick');
    status.parent('span').attr('data-tooltip', mark_as_unread_text);
    status.parent('span').find('.textOffScreen').text(mark_as_unread_text);
    un_read_update_counters(container, -1);
  } else {
    status.removeClass('tick').addClass('xCross');
    status.parent('span').attr('data-tooltip', mark_as_read_text);
    status.parent('span').find('.textOffScreen').text(mark_as_read_text);
    un_read_update_counters(container, 1);
  }
}

function un_read_update_counters(container, value) {
  var counter = $(container + ' span.newAlert');

  if (counter.length == 0) {
    $(container + ' > a').prepend('<span class="newAlert"></span>');
    counter = $(container).find('span.newAlert');
  }

  var count = ((counter.text() == '' || isNaN(counter.text())) ? 0 : parseInt(counter.text())) + value;

  if (count > 0) {
    counter.html(count);
    $(container + ' a.markAllAsRead').show();

    if (container == '.messagesHolder' && $(container + '  a  i').hasClass('unread')) {
      $(container + ' > a  i').removeClass('unread').addClass('messages');
    }
  } else {
    counter.remove();
    $(container + ' a.markAllAsRead').hide();

    if (container == '.messagesHolder' && $(container + '  a  i').hasClass('messages')) {
      $(container + ' > a  i').removeClass('messages').addClass('unread');
    }
  }
}

// scroll

function exec_scroll(holder, container, controller) {
	$(container).find('.scroll').scroll(function(e) {
		if (e.target.scrollTop >= (e.target.scrollHeight - e.target.clientHeight)) {
			ajax_call_for_messages(holder, container, controller);
		}
	});

	if (controller == 'inbox') {
		scroll_check_mess = false;
	} else if (controller = 'notifications') {
		scroll_check_not = false;
	}
}

// Isolate the scroll inside the element from the page

function isolatedScroll(element) {
	element.bind('mousewheel DOMMouseScroll', function(e) {
		var delta = (e.wheelDelta || (e.originalEvent && e.originalEvent.wheelDelta) || -e.detail);
		var bottomOverflow = ((this.scrollTop + $(this).outerHeight() - this.scrollHeight) >= 0);
		var topOverflow = (this.scrollTop <= 0);

		if ((delta < 0 && bottomOverflow) || (delta > 0 && topOverflow)) {
			e.preventDefault();
		}
	});

	return element;
}
// memory variable with the user selections field,
// it's an array of Objects, every Object being a selection
// we need it to re-populate the field if error in sending process
var select2_memory = {};
select2_memory.to = [];
select2_memory.cc = [];
select2_memory.bcc = [];
var select2_data = [];
var select2_data_size = 0;

// Auto suggest input for the send message box

function autoSuggestInit(element, selected_elems_size, selected_elems) {
	var el = $(element), results, preload_data, ln, fn, tln, tfn, tlnfn, tfnln, q;
	var recipient_type = element.split("#")[1];

	select2_memory.to = [];
	select2_memory.cc = [];
	select2_memory.bcc = [];

	if (selected_elems != undefined && (selected_elems.length > 0)) {
		select2_memory[recipient_type] = selected_elems;
	}

	if (recipient_type == 'to') {
		select2_data = select2_memory.to;
		select2_data_size = parseInt(selected_elems_size);
		var max_selection_size = (select2_data.length > 0 ? (select2_data.length + 10) : 10);
	} else {
		var max_selection_size = 10;
	}

	el.select2({
		multiple : true,
		maximumSelectionSize : max_selection_size, // for limitation of people number in the "to" fields
		minimumInputLength : 2, // minimum chars to start the suggest query
		ajax : {
			type : "GET",
			url : "/inbox/suggest_users",
			dataType : 'json',
			quietMillis : 500, // bigger delay before ajax is called
			data : function(term) {
				q = term;
				return {
					name : q
				};
			},
			results : function(data) {
				results = {
					results : []
				};
				preload_data = data.results;

				$.each(preload_data, function() {
					ln = this.last_name;
					fn = this.first_name;
					tln = ln.toUpperCase();
					tfn = fn.toUpperCase();
					tfnln = tfn + tln;
					tlnfn = tln + tfn;

					q = q.replace(" ", "");
					q = q.toUpperCase();

					if (tln.indexOf(q) >= 0 || tfn.indexOf(q) >= 0 || tfnln.indexOf(q) >= 0 || tlnfn.indexOf(q) >= 0) {
						results.results.push({
							id : this.id,
							text : fn + ' ' + ln
						});
					}
				});

				// the #to input will contain the ids: id1,id2,id3
				return results;
			}
		}
	}).on('change', function() {
		select2_memory[$(this).attr('id')] = $(this).select2('data');

		if ($(this).attr('id') == 'to'){
			select2_data = select2_memory[$(this).attr('id')];
			select2_data_size = select2_data.length;
		}
	});

	if (select2_memory[recipient_type].length > 0) {
		el.data().select2.updateSelection(select2_memory[recipient_type]);

		if (select2_data_size > 5 && recipient_type == 'to') {
			setTimeout(function(){
				add_sender_placeholder();
			}, 100);
		}
	}
}

function popup_delete(element) {
	var url = $(element).attr('href');
	var id = url.split('=')[1];
	var extra = url.split('=')[0].split('?')[1];
	var parent;

	if (extra == 'message') {
		parent = '.messagesHolder';
	} else {
		parent = '.notificationsHolder';
	}

	$.confirm({
		content : are_you_sure_text,
		confirm : function() {
			$.ajax({
				type : "POST",
				url : url,
				complete : function() {
					var el = $(parent).find('.message-' + id);

					if (el.length != 0) {
						el.remove();
					}

					$.facebox.close();
				}
			});
		}
	});

	return false;
}

function scroll_to_bottom(element) {
	setTimeout(function() {
		var el = $(element).find('> h2').last();

		$(element).animate({
			scrollTop : el.offset().top - 115
		}, 0);
	}, 50);
}

// send message and replies using ajax

function ajax_send(element) {
	var url = $('.messageSendPopup').parent('form').attr('action');

	if ((typeof(tinymce) == 'undefined') || (tinymce.get('popupContent') == null)) {
		var content = $('.messageSendPopup #popupContent').html();
	} else {
		var content = tinymce.get('popupContent').getContent();
	}

	var obj = {
		url : url,
		data : {
			to : $('.messageSendPopup #to').val(),
			cc : $('.messageSendPopup #cc').val(),
			bcc : $('.messageSendPopup #bcc').val(),
			subject : $('.messageSendPopup #subject').val(),
			content : content,
      field : $('.messageSendPopup #field').val()
		}
	};

	ajax_send_message(obj);
	return false;
}

function ajax_reply(element) {
	var url = $('.replyPopup').parent('form').attr('action').split('?');

	if ((typeof(tinymce) == 'undefined') || (tinymce.get('popupContent') == null)) {
		var content = $('.replyPopup #popupContent').html();
	} else {
		var content = tinymce.get('popupContent').getContent();
	}

	var obj = {
		url : url[0],
		data : {
			to : $('.replyPopup #to').val(),
			cc : $('.replyPopup #cc').val(),
			bcc : $('.replyPopup #bcc').val(),
			message : url[1].split('=')[1],
			subject : $('.replyPopup #subject').val(),
			content : content,
			ajax : true
		}
	};

	ajax_send_message(obj);
	return false;
}

function ajax_reply_to_forum(element) {
	var url = $('.replyPopup').parents('form').attr('action').split('?');

	var obj = {
		url : url[0],
		data : {
			message : url[1].split('=')[1],
			notification : url[1].split('=')[1],
			content : tinymce.get('popupContent').getContent(),
			ajax : true
		}
	};

	ajax_send_message(obj);
	return false;
}

function ajax_send_message(obj) {
	$.ajax({
		type : 'POST',
		url : obj.url,
		data : obj.data,
		dataType : 'json'
	}).done(function(data) {
		if (data.error) {
			$('#facebox').find('.error').remove();
			$('#facebox').find('#alerts').after('<div class="alert_block error" role="alert"><div class="alert_flex"><div class="alert_icon"><i class="error inverted"></i></div><p>' + data.error + '</p><a href=""><i class="xCrossSmall"></i><span class="textOffScreen">Close alert</span></a></div></div>');

		} else {
			tinyPop = false;

			if (select2_memory) {
				select2_memory.to = [];
				select2_memory.cc = [];
				select2_memory.bcc = [];
				$('.messageSendPopup #to').val('');
			}

			$.facebox.close();

			$('#centreColumn').find('> .info').remove();
			$('#centreColumn').find('#alerts').after('<div class="alert_block info" role="alert"><div class="alert_flex"><div class="alert_icon"><i class="info inverted"></i></div><p>' + data.info + '</p><a href=""><i class="xCrossSmall"></i><span class="textOffScreen">Close alert</span></a></div></div>');

			// reset the fade_alert() interval
			clearInterval(closeAlertTimer);
			fade_alert();

			tinyPop = true;
		}
	});
}

function tinyMceFocusForce(editor_id) {
	var check_interval = setInterval(function() {
		if (tinymce.get(editor_id)) {
			tinymce.get(editor_id).focus();
			clearInterval(check_interval);
		}
	}, 10);
}

// notifications

var notifications_active = true;
var notification_main_wrapper = '.notificationsPopUpHolder';
var notifications_timer = null;
var notification_close_after = 5000;
var notifications_timer_cycles = 0;
var notifications_play_sound = false;
var notifications_close_arrow;

function init_notifications_popup(sounds) {
	notifications_play_sound = sounds;

	if(!is_mobile_app_mode()) {
		notifications_close_arrow = $(notification_main_wrapper).find('.notificationsBottom span');
		notifications_click_outside();

		notifications_close_arrow.on('click', function (data) {
			$.each($(notification_main_wrapper).find('> div > ul li'), function () {
				$(this).animate({height: '0'}, 300, function () {
					$(this).remove();
					notifications_hide_arrow();
				});
			});
		});
	}

	reset_notifications_timer_for_popup();
}

function notifications_click_outside() {
	$('html *').on('click', function(e) {
		if ($(this).hasClass('closeNotifications') || $(this).parent('span').hasClass('closeNotifications')) {
			$('.notificationsPopUpHolder').find('li').animate({'height' : '0'}, 300, function() {
				$(this).remove();
				notifications_hide_arrow();
			});
		}

		if (($(this).parents('.notificationsPopUpHolder').length == 1) || ($(this).parents('#facebox').length == 1)) {
			e.stopPropagation();
		} else {
			$('.notificationsPopUpHolder').find('li').animate({'height' : '0'}, 300, function() {
				$(this).remove();
				notifications_hide_arrow();
			});
		}

		if (($(this).parents('.dropDownHolder').length == 0) && ($(this).parents('#facebox').length == 0)) {
			if (notifications_active == false) {
				reset_notifications_timer_for_popup();
			}
		}
	});
}

function reset_notifications_timer_for_popup() {
	notifications_active = true;
	notifications_timer_cycles++;
	var delay = notifications_timer_delay();

	if (delay != 0) {
		notifications_timer = setTimeout(get_notifications_ajax, delay);
	}
}

function notifications_timer_delay() {
	if (notifications_timer_cycles <= 3) {
		// every 2 seconds for first 3 cycles (6 seconds total)
		return 2000;
	} else if (notifications_timer_cycles <= 6) {
		// every 3 seconds for next 3 cycles (9 seconds total)
		return 3000;
	} else if (notifications_timer_cycles <= 12) {
		// every 10 seconds for next 6 cycles (1 minute total)
		return 10000;
	} else if (notifications_timer_cycles <= 27) {
		// every 20 seconds for next 15 cycles (5 minutes total)
		return 20000;
	} else if (notifications_timer_cycles <= 42) {
		// every 2 minutes for next 15 cycles (30 minutes total)
		return 120000;
	} else {
		// every hour
		return 3600000;
	}
}

function get_notifications_ajax() {
	if (!notifications_active) {
		return;
	}

	$.ajax({
		url: '/updates/get_latest',
		dataType: 'json',
		success: function (data) {
			var messages = data.messages;
			var notifications = data.alerts;
			var new_messages = (messages && (messages.length > 0));
			var new_notifications = (notifications && (notifications.length > 0));
			var notifications_to_pop = [];
			var show_dropdown = false;

			update_top_nav_counter(data.new_messages_count, '.messagesHolder', '.mobileMessagesHolder');
			update_top_nav_counter(data.new_notifications_count, '.notificationsHolder', '.mobileNotificationsHolder');

			if (new_messages || new_notifications) {
				if (notifications_play_sound == true) {
					notifications_sound();
				}

				if (new_messages) {
					$.each(messages, function (key, value) {
						$('.notificationsPopUpHolder ul').append(notifications_html('message', value));
						notifications_animate(notification_main_wrapper + ' .message-' + value.id);
						show_dropdown = true;
					});
				}

				if (new_notifications) {
					$.each(notifications, function (key, value) {
						if (value.popup == true) {
							notifications_to_pop.push(value);
						} else {
							$('.notificationsPopUpHolder ul').append(notifications_html('notification', value));
							notifications_animate(notification_main_wrapper + ' .notification-' + value.id);
							show_dropdown = true;
						}
					});
				}

				if (show_dropdown == true) {
					$(notification_main_wrapper).find('.notificationsBottom').css('display', 'block');
				}

				notifications_popups(notifications_to_pop);

				if (is_mobile_app_mode()) {
					send_header_to_app();
					window.parent.postMessage('{"method": "notificationsPopup", "content": "1"}', '*');
				}
			}

			if (data.chat_from_id != null) {
				display_chat_alert(data.chat_from_id, data.chat_from_name, data.chat_room_id);
			}

			reset_notifications_timer_for_popup();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			notifications_timer_cycles = 27; // check at every 20 seconds
			reset_notifications_timer_for_popup();
			console.log(textStatus, errorThrown);
		}
	});
}

function notifications_popups(notifications) {
	var stack = {};

	stack.className = 'vex-theme-os';
	stack.initialDialogsClassName = 'vex-theme-os vex-theme-stack-demo';

	stack.advanceDemoDialogs = function () {
		var $remaining = $('.stack > .vex:not(".vex-closing")');
		$('.stack').show();
		$.each($remaining.removeClass('v0 v1 v2 v3 v4').toArray().reverse(), function (i, item) {
			$(item).addClass('v' + i);
		});
	};

	$.each(notifications, function (index, notification) {
		$.ajax({
			url: '/notifications/show',
			data: {small: true, popup: true, notification: notification.id},
			dataType: 'html',
			async: false,
			success: function (html) {
				vex.dialog.alert({
					appendLocation: '.stack',
					unsafeMessage: html,
					className: stack.initialDialogsClassName,
					callback: function (value) {
						setTimeout(function () {
							stack.advanceDemoDialogs();
						}, 0);
					}
				});

				stack.advanceDemoDialogs();

        var timer = 0;

        $.each($($.parseHTML(html, document, true)).find('script'), function(index, value) {
          setTimeout(function() {
            if (value.src == '') {
              eval(value.text);
            } else {
              eval($.getScript(value.src));
            }
          }, timer);

          timer = timer + 100;
        });
			}
		});
	});
}

function notifications_html(type, notification) {
	var html = '';
	var url;

	if (type == 'notification') {
		url = '/notifications/show?popup=true&amp;notification=' + notification.id;
		icon = 'signal3';
	} else {
		url = '/inbox/show?popup=true&amp;message=' + notification.id;
		icon = 'messages';
	}

	html += '<li class="ms-holder ' + type + '-' + notification.id + '" style="height: 57px;">';
	html += '<a href="' + url + '" onclick="return popup_clicked(this);">';
	html += '<span class="ms-image"><img src="' + notification.photo + '" width="30" height="30" alt=""></span>';
	html += '<span class="ms-user">' + notification.first_name + ' ' + notification.last_name + '</span>';
	html += (notification.class_name ? ' - <span class="ms-class-name">' + notification.class_name + '</span>' : '');
	html += (notification.forum ? ' <span class="ms-arrow"></span> ' + notification.forum : '');
	html += '<span class="ms-subject">' + notification.name + '</span>';
	html += '<span class="ms-date">' + notification.date + '</span>';
	html += '<span class="ms-status"><i class="' + icon + ' icnColor"></i></span>';
	html += '</a>';
	html += '</li>';

	return html;
}

function notifications_animate(element) {
	var TimeOut;
	var height = '57px';

	$(element).animate({height: height}, 300);

	TimeOut = setTimeout(function () {
		$(element).animate({height: '0'}, 300, function () {
			$(this).remove();
			notifications_hide_arrow();
		});
	}, notification_close_after);

	$(element).mouseout(function () {
		TimeOut = setTimeout(function () {
			$(element).animate({height: '0'}, 300, function () {
				$(this).remove();
				notifications_hide_arrow();
			});
		}, notification_close_after);
	});

	$(element).mouseover(function () {
		clearTimeout(TimeOut);
	});
}

function notifications_hide_arrow() {
	if ($(notification_main_wrapper).find('> div > ul li').length == 0) {
		$(notification_main_wrapper).find('.notificationsBottom').hide();
	}
}

function notifications_sound() {
	if (self == top) {
		var sound = new Audio('/audio/notification-2.wav');
		sound.play();
	} else {
		window.parent.postMessage('{"method": "playNotificationSound", "src": "/audio/notification-2.wav"}', '*');
	}
}

function notification_mute() {
	var el = $('.audioNotifications');
	var enable = el.data('enable');

	$.getJSON('/account/set_notifications_sound_enabled', {value: enable}, function (data) {
		if (data.status == 'ok') {
			if (enable == true) {
				el.data('enable', false);
				el.find('i').removeClass('audioOff').addClass('audioOn');
				el.find('span.textOffScreen').html('Notification audio off');
				notifications_play_sound = true;
			} else if (enable == false) {
				el.data('enable', true);
				el.find('i').removeClass('audioOn').addClass('audioOff');
				el.find('span.textOffScreen').html('Notification audio on');
				notifications_play_sound = false;
			}
		}
	});
}

function notification_mute_app(enable) {
	$.getJSON('/account/set_notifications_sound_enabled', {value: enable}, function (data) {
		if (data.status == 'ok') {
			if (enable == true) {
				notifications_play_sound = true;
			} else if (enable == false) {
				notifications_play_sound = false;
			}
		}
	});
}

function notification_system_status(el) {
	if ($(el).hasClass('highlight')) {
		notifications_active = false;
	} else {
		reset_notifications_timer_for_popup();
	}
}

// notifications counter

function just_read_notification(id) {
	if (id) {
		update_unread_status_in_dd('.notificationsDropDown', id);
	}

	update_unread_notifications();
	notifications_arrow_navigation();
}

function update_unread_notifications() {
	$.getJSON('/updates/get_unread_notifications_count', function(data) {
		update_top_nav_counter(data.count, '.notificationsHolder', '.mobileNotificationsHolder');
	});
}

// messages counter

function just_read_message(id) {
	if (id) {
		update_unread_status_in_dd('.messagesDropDown', id);
	}

	update_unread_messages();
	notifications_arrow_navigation();
}

function update_unread_messages() {
	$.getJSON('/updates/get_unread_messages_count', function(data) {
		update_top_nav_counter(data.count, '.messagesHolder', '.mobileMessagesHolder');
	});
}

// update status icon in dropdowns

function update_unread_status_in_dd(wrapper, id) {
	var dd = $(wrapper);
	var dd_is_open = dd.hasClass('dDownShow');

	if (dd_is_open === true) {
		var element = dd.find('#message-' + id).find('span.ms-status i');

		if (element.hasClass('xCross')) {
			element.removeClass('xCross').addClass('tick');
		}
	}
}

// notifications/messages popup navigation
var arrow_navig_usage = true;

function notifications_arrow_navigation() {
	$(document).keydown(function(e) {
		switch(e.which) {
			case 37: // left
				if (arrow_navig_usage == true && $('#facebox .popup_left').length != 0 && $('#facebox .popup_left').is(':visible')) {
					$('#facebox .popup_left').trigger('click');
					e.preventDefault();

					arrow_navig_usage = false;
					setTimeout(function() { arrow_navig_usage = true; }, 800);
				}
				break;

			case 39: // right
				if (arrow_navig_usage == true && $('#facebox .popup_right').length != 0 && $('#facebox .popup_right').is(':visible')) {
					$('#facebox .popup_right').trigger('click');
					e.preventDefault();

					arrow_navig_usage = false;
					setTimeout(function() { arrow_navig_usage = true; }, 800);
				}
				break;

			default: return; // exit this handler for other keys
		}
	});
}

// counters

function update_top_nav_counter(count, parent, mobile_parent) {
	var selector = $(parent);
	var mobile_selector = $(mobile_parent);

	if (selector.length == 0) {
		return; // not found
	}

	execute_update_top_nav_counter(count, selector);

	if (mobile_selector.length == 0) {
		return; // not found
	}

	execute_update_top_nav_counter(count, mobile_selector);

	if (is_mobile_app_mode() &&
		(
			(
				parent == '.messagesHolder' &&
				(mobile_messages_count == 0 || count < mobile_messages_count)
			) || (
				parent == '.notificationsHolder' &&
				(mobile_notifications_count == 0 || count < mobile_notifications_count)
			)
		)) {
		switch (parent) {
			case '.messagesHolder':
				mobile_messages_count = count;
				break;
			case '.notificationsHolder':
				mobile_notifications_count = count;
				break;
		}
		send_header_to_app();
	}
}

function execute_update_top_nav_counter(count, selector) {
	var alert_el = selector.find('.newAlert');
	var link_el = selector.find('> a:first-child');

	if (alert_el.length != 0) {
		var inline_count = parseInt(alert_el.text());

		if (inline_count != count) {
			if (count > 0) {
				alert_el.text(count.toString());
			} else {
				alert_el.next('i').removeClass('messages').addClass('unread');
				alert_el.remove();
			}
		}
	} else {
		if (count > 0) {
			link_el.prepend('<span class="newAlert">' + count + '</span>').find('i').addClass('messages').removeClass('unread');
		}
	}
}

// mark as read

function mark_all_as_read(controller, parent, mobile_parent) {
	$.confirm({
		content : are_you_sure_text,
		confirm : function() {
			$.ajax({
				type : "POST",
				url : "/" + controller + "/mark_all_as_read",
				dataType : "json",
				async : false,
				success : function(data) {
					if (data.status == 'done') {
						update_top_nav_counter(0, parent, mobile_parent);

						$(parent).find('.dropDown li').each(function(index, value) {
							$(value).removeClass('ms-unread');
						});

						$(parent).find('.markAllAsRead').hide();
					}
				}
			});
		}
	});
}

/**
 * =====================================================================
 * ================================END==================================
 * =====================================================================
 */

function set_back_link_url(url){
	$('.backLink').attr('href', url);
}

function init_portal_login() {
	$('#access_code_form').submit(function(e) {
		e.preventDefault();
		$('#submit_access_code').click();
		return false;
	});

	$('#submit_access_code').click(function(e) {
		$.post($('#access_code_form').attr('action'), $('#access_code_form').serialize(), function(data) {
			switch (data.status) {
				case 'submit':
					document.location = '/join_with_access_code/form?registration_code=' + $('#registration_code').val();
					break;

				case 'problem':
					$('#access_code_form').siblings('#alerts').html('<div class="alert_block error" style="width:auto" role="alert"><div class="alert_flex"><div class="alert_icon"><i class="error inverted"></i></div><p>' + data.text + '</p></div></div>').show();
					break;
			}
		});

		return false;
	});

	$('#illini_btn, #saml2_btn, #clever_btn, #google_apps_btn, #sso_custom_btn, #office365_sso_btn').click(function(){
		if($(this).hasClass('is-mobile-app')){
			window.parent.postMessage("{\"method\": \"loadBrowser\", \"href\": \""+$(this).attr('href')+"\", \"refresh_on_close\": \"1\"}", "*");
		}else{
			document.location = $(this).attr('href');
		}
	});

	var switchForms = {
		container : $('[data-active_window]'),

		config : {
			speed : 200
		},

		init : function() {
			$('[data-change_active]').on('click', this.toggleForm);
		},

		toggleForm : function(e) {
			changeButton = $(this);
			$('div.warning, div.info, div.error').remove();

			switchForms.container.each(function() {
				$this = $(this);
				// Find active change and show
				if ($this.data('active_window') == changeButton.data('change_active')) {
					$this.slideDown(switchForms.config.speed);
					$this.find('input[type="text"]').first().focus();
				} else {
					$this.slideUp(switchForms.config.speed);
				}

			});

			e.preventDefault();
		}
	};

	switchForms.init();

	setTimeout(function() {
		focus_element('userid');
	}, 0);
}

function ajax_submit_login(login_submit_url) {
	var progress = add_progress($('#submit_button'));

	$.support.cors = true;

	$.ajax({
		url: login_submit_url,
		data: $('#login_form').serialize(),
		dataType: 'json',
		method: 'post',
		success: function(data) {
			switch (data.status) {
				case 'redirect':
					document.location = data.url;
					break;

				case 'problem':
					$('#login_form').siblings('#alerts').html('<div class="alert_block error" style="width:auto" role="alert"><div class="alert_flex"><div class="alert_icon"><i class="error inverted"></i></div><p>' + data.text + '</p></div></div>').show();
					progress.stop();
					break;
			}
		},
		error: function(x, t, m) {
			$('#login_form').siblings('#alerts').html('<div class="alert_block error" style="width:auto" role="alert"><div class="alert_flex"><div class="alert_icon"><i class="error inverted"></i></div><p>'+m+'</p></div></div>').show();
			progress.stop();
		}
	});

	return false;
}

/* Login popup stuff */

function request_password() {
	$('div.warning, div.info, div.error').remove();

	var email = $('#email').val();
	var login = '';

	$.ajax({
		type: "POST",
		url: "/log_in/request_password_ajax",
		data: {email: email},
		dataType: "json",
		//async: false, // if is async it works. don't know the effect of enabling it, couldn't find any !!!
		success: function(data) {
			var info = data;

			if ($('#simple_login').val() == 'true') {
        login = 'admin';
      } else {
        login = 'credentials';
      }

			if (info.ok) {
				// this extra code adds a little animation effect
				$('.frmLogin[data-active_window="password"]').slideUp(200);
				$('.frmLogin[data-active_window="' + login + '"]').slideDown(200).prepend("<div class='info closeAlert keepopen' style='display:none'><p>" + info.message + "</p><a href=''></a></div>");
				$('.frmLogin[data-active_window="' + login + '"] .info').delay(250).fadeIn(400);

				$('.frmLogin[data-active_window="' + login + '"] .info > a').bind('click', function(e) {
					$(this).parent().animate({
						height : '0',
						opacity : '0',
						margin : '0'
					});

					e.preventDefault();
				});
			} else {
				// this extra code adds a little animation effect
				$('.frmLogin[data-active_window="password"]').prepend("<div class='alert_block warning close_alert' style='display:none' role='alert'><div class='alert_flex'><div class='alert_icon'><i class='error inverted'></i></div><p>" + info.message + "</p><a href=''><i class='xCrossSmall'></i><span class='textOffScreen'>Close alert</span></a></div></div>");
				$('.frmLogin[data-active_window="password"] .warning').fadeIn(400);

				$('.frmLogin[data-active_window="password"] .warning > div > a').bind('click', function(e) {
					$(this).parent().parent().animate({
						height : '0',
						opacity : '0',
						margin : '0'
					});

					e.preventDefault();
				});
			}
		},
		error : function(request, status) {
			console.log(request);
			console.log(status);
		}
	});

	return false;
}

// close popup function
function close_facebox_popup() {
	remove_close_button(); // if the autoclose is on we don't need close button anymore

	setTimeout(function(){
		$.facebox.close();
	}, FACEBOX_CLOSING_TIME);

}

// remove the close from the facebox
function remove_close_button() {
	$('#facebox').find('a.close').remove();
}

function add_mobile_heading(heading, heading1_override) {
	if ($('.pageHeading').length) {
		$('#mobile_page_heading').html(heading);
		if(heading1_override.length){
			$('#mobile_page_heading').next().html(heading1_override);
			$('.pageHeading').addClass('switch_heading');
		}
	}
}

// alert

function show_error(message) {
	var alerts = $('#alerts');
	alerts.html('<div class="alert_block error close_alert" role="alert"><div class="alert_flex"><div class="alert_icon"><i class="error inverted"></i></div><p>' + message + '</p><a href=""><i class="xCrossSmall"></i><span class="textOffScreen">Close alert</span></a></div></div>');
	alerts.show();
	$('html, body').animate({scrollTop: 0}, 300);
}

function show_warning(message) {
	var alerts = $('#alerts');
	alerts.html('<div class="warning close_alert alert_block" role="alert"><div class="alert_flex"><div class="alert_icon"><i class="flag inverted"></i></div><p>' + message + '</p><a href=""><i class="xCrossSmall"><span class="textOffScreen">Close Alert</span></i></a></div></div>');
	alerts.show();
	$('html, body').animate({scrollTop: 0}, 300);
}

// add progress

function add_progress(elem, options){
	// disable button
	elem.attr('disabled','disabled').addClass('in-progress');
	var opts = {
		lines: 11, // The number of lines to draw
		length: 4, // The length of each line
		width: 2, // The line thickness
		radius: 5, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: '#FFF', // #rgb or #rrggbb or array of colors
		speed: 1, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: 'auto', // Top position relative to parent in px
		left: 'auto' // Left position relative to parent in px
	};
	var spinner = new Spinner( $.extend(opts, options) ).spin();
	var progress = {
		elem: elem,
		spinner: spinner,
		stop: function() {
			this.spinner.stop();
			this.elem.removeAttr('disabled').removeClass('in-progress');
		}
	};
	elem.append(spinner.el);
	return progress;
}

/* Payment processing popup for plans purchase */

function show_processing(message) {
	if ($('#facebox_overlay').length == 0)
	  $('body').append('<div id="facebox_overlay" class="facebox_overlayBG fullscreen_progress"></div>');
	$('.facebox_overlayBG').css('opacity','0.4');

	data = '<div class="header center"> \
	          <h2>' + processing + '</h2> \
	        </div> \
	        <div class="fullscreen_msg_content center"> \
	          <div class="spinner_holder mt5"></div> \
	          <p class="mb0">' + message + '<br>' + do_not_press_refresh_or_back_button + '</p> \
	        </div>';

	$('body').append('<div id="fullscreen_msg_holder" class="fullscreen_progress"><div id="fullscreen_msg" role="dialog" tabindex="-1"></div></div>');
	$('#fullscreen_msg').html(data).focus();
	var opts = {
		lines: 11, // The number of lines to draw
		length: 10, // The length of each line
		width: 4, // The line thickness
		radius: 13, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: '#5e5f5f', // #rgb or #rrggbb or array of colors
		speed: 1, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: 'auto', // Top position relative to parent in px
		left: 'auto' // Left position relative to parent in px
	};
	var spinner = new Spinner(opts).spin();
	$('.spinner_holder').append(spinner.el);
	var fullscreen_progress = {
		stop: function() {
			$('.fullscreen_progress').remove();
		}
	};
	return fullscreen_progress;
}

// over plan charges

// note that "secure_protocol", host, etc. could be set once in lite.js during startup

function pay_over_plan_charges(secure_protocol, current_host, ssl_host, message) {
	return secure_ajax_pay(secure_protocol, 'matrix_billing', 'submit_pay_over_plan_charges', 'payment_received', current_host, ssl_host, message);
}

function start_plan_using_credit_card(secure_protocol, controller, current_host, ssl_host, message) {
	return secure_ajax_pay(secure_protocol, controller, 'create_credit_card', 'payment_plan_activated', current_host, ssl_host, message);
}

function change_plan_using_credit_card(secure_protocol, controller, current_host, ssl_host, message) {
	return secure_ajax_pay(secure_protocol, controller, 'save_credit_card', 'payment_plan_changed', current_host, ssl_host, message);
}

function change_credit_card(secure_protocol, controller, current_host, ssl_host, message) {
	return secure_ajax_pay(secure_protocol, controller, 'save_change_credit_card', 'credit_card_changed', current_host, ssl_host, message);
}

function secure_ajax_pay(secure_protocol, controller, action, success_action, current_host, ssl_host, message, data, auth_token) {
	var fullscreen_progress;
	if (ssl_host.toUpperCase() == current_host.toUpperCase()) {
		$.ajax({
			type : 'GET',
			data : data || $('#ecommerce_form').formSerialize(),
			url : secure_protocol + '://' + current_host + '/' + controller + '/' + action + (auth_token ? '?one_time_auth_token=' + auth_token : ''),
			dataType : 'jsonp',
			beforeSend: function(){
				fullscreen_progress = show_processing(message);
			},
			success : function(json, text_status, jqXHR) {
				if (json.error != null) {
					fullscreen_progress.stop();
					show_error(json.error);
				} else {
					var stripe_card_error = '';
					if (json.stripe_card_error) { stripe_card_error = '?stripe_card_error=true'}
					window.location.href = '/' + controller + '/' + success_action + stripe_card_error;
				}
			},
			error : function(jqXHR, text_status, errorThrown) {
				fullscreen_progress.stop();
				show_error(text_status);
			}
		});
	} else {
		$.ajax({
			type : 'GET',
			url : 'http://' + current_host + '/authentication/get_auth_token',
			dataType : 'jsonp',
			beforeSend: function(){
				fullscreen_progress = show_processing(message);
			},
			success : function(json, text_status, jqXHR) {
				secure_ajax_pay(secure_protocol, controller, action, success_action, ssl_host, ssl_host, message, data, json.auth_token);
			},
			error : function(jqXHR, text_status, errorThrown) {
				fullscreen_progress.stop();
				show_error(text_status);
			}
		});
	}

	return false;
}

/* re-initialize checkboxes */
function update_checkboxes() {
	$("input[type='checkbox']").each(function(index) {
		if (!$(this).next().is('label')) {
			$(this).after('<label for="' + $(this).attr('id') + '"></label>');
			$(this).addClass("emptyLabel");
		}
	});
}

/* tabs utility function */
function tabs_selected_pointer(element, container, type, extra) {
	$(container+' ul.tabnav li a').removeClass('selected').parent().attr("aria-selected","false");
	$(container+' div.tab-content').removeClass('active-tab').hide().attr("aria-hidden","true");
	$(container+' #'+$(element).attr('rel')).show().addClass('active-tab').attr("aria-hidden","false");
	$(element).addClass('selected').parent().attr("aria-selected","true");

	if ( type == 'hc' ) {
		$('#facebox .help_centre').find('#hc_content_selector').remove();
		$('#facebox .help_centre').find('#help_phrase').val('');
	} else if ( type == 'pp' ) {
		if ( extra == true ){
			$('.tabs-extra-class').show();
		} else {
			$('.tabs-extra-class').hide();
		}
	}

	if ($('body').hasClass('catalog_class')) {
		resizeFixedLeftColumn();
	}

	$(element).parents('.dropDownHolder').find('a:first-child').removeClass('highlight');
	$(element).parents('.dropDownHolder').find('.dropDown').removeClass('dDownShow');
}

function tabnav_adjustment(containerId) {
	if(is_mobile_app_mode()){
		console.log('NATIVE APP: inside tabnav_adjustment');
	}
	if ($(containerId + ' ul.tabnav').length && !(is_mobile_app_mode() && $('#fixedSectionHeader').length)) {
		if(is_mobile_app_mode()) {
			console.log('NATIVE APP: ' + containerId + ' ul.tabnav exists');
		}
		$(containerId + ' ul.tabnav').css('overflow', 'visible');
		if ($(containerId + ' ul.tabnav li.tabs_more_link .dropDown a').length > 0){
			if(is_mobile_app_mode()) {
				console.log('NATIVE APP: ' + containerId + ' ul.tabnav li.tabs_more_link .dropDown a exists');
			}
			$(containerId + ' ul.tabnav li.tabs_more_link .dropDown a').wrap('<li></li>');
			$(containerId + ' ul.tabnav li.tabs_more_link .dropDown li').insertBefore(containerId + ' ul.tabnav li.tabs_more_link');
		}

		if(globalWindowWidth < 768 || $(containerId + ' ul.tabnav a.selected').parents('.dropDown').length > 0){
			if(is_mobile_app_mode()) {
				console.log('NATIVE APP: prepending selected tab to beginning of list');
			}
			$(containerId + ' ul.tabnav a.selected').parent().prependTo(containerId + ' ul.tabnav');
		}

		$(containerId + ' ul.tabnav li:not(.tabs_more_link)').each(function() {
			if(is_mobile_app_mode()) {
				console.log('NATIVE APP: going through tab items, checking $(this).offset().top (' + $(this).offset().top + ') > $(\'' + containerId + ' ul.tabnav li:first-child\').offset().top (' + $(containerId + ' ul.tabnav li:first-child').offset().top + ')');
			}
			if ($(this).offset().top > $(containerId + ' ul.tabnav li:first-child').offset().top) {
				$(this).appendTo(containerId + ' ul.tabnav .dropDown').find('a').unwrap();
				$(containerId + ' ul.tabnav li.tabs_more_link').css('display','inline-block');
			}
		});

		if($(containerId + ' ul.tabnav li.tabs_more_link:visible').length){
			if(is_mobile_app_mode()) {
				console.log('NATIVE APP: ul.tabnav li.tabs_more_link:visible');
			}
			var i = 0;
			while (i < 5 && $(containerId + ' ul.tabnav li.tabs_more_link').offset().top > $(containerId + ' ul.tabnav li:first-child').offset().top) {
				if(is_mobile_app_mode()) {
					console.log('NATIVE APP: adding item to dropdown');
				}
				$(containerId + ' ul.tabnav li.tabs_more_link').prev().prependTo(containerId + ' ul.tabnav .dropDown').find('a').unwrap();
				i++;
			}
		}

		if ($(containerId + ' ul.tabnav li.tabs_more_link .dropDown a').length == 0) {
			if(is_mobile_app_mode()) {
				console.log('NATIVE APP: no item in dropdown, hiding more_link');
			}
			$(containerId + ' ul.tabnav li.tabs_more_link').css('display','none');
		}

		$(containerId + ' ul.tabnav .dropDownHolder > a').off('click').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			$(this).siblings('.dropDown').toggleClass('dDownShow');
			$(this).toggleClass('highlight');
		});
	}
}

/* help center */
function open_tab() {
	$('#helpTabs a[rel="popup_help_center_overview"]').parent().next().children('a').trigger('click');
}

function hc_load_content_with_ajax(container) {
	var $this = $(container);
	var scroll = $this.find('.scroll');
	var help_list = $this.find('.helpList a');

	$.each(help_list, function(index, value){
		$(this).click(function(e){
			e.preventDefault();

			var wrapper = $(this).parents('.tab-content');
			var response = get_ajax_response($(this).attr('href'), 'html', false);
			var html = '<div id="hc_content_selector">' + response + '</div>';

			$('#facebox .help_centre').find('#hc_content_selector').remove();

			$(html).insertAfter(wrapper);

			$('#hc_content_selector').height(wrapper.height()).find('.help_centre_content').height((wrapper.height() - $('.help_centre_heading').outerHeight()));

			wrapper.hide();

			hc_content_links();

			$('#facebox .help_centre').find('#help_phrase').val('');

			isolatedScroll($('.help_centre_content'));
		});
	});

	hc_help_for_page();

	hc_search_with_ajax();

	isolatedScroll(scroll);
}

function hc_content_links() {
	$('img.imgL-blue').remove();

	$('a.back_to_list').click(function(e){
		$('#facebox .help_centre').find('#hc_content_selector').remove();
		$('#facebox .help_centre').find('#help_phrase').val('');
		$('.active-tab').show();
	});

	$.each($('#hc_content_selector a[href*="/help/"]'), function(index, value){
		$(this).click(function(e){
			e.preventDefault();

			var wrapper = $(this).parents('#hc_content_selector');
			var response = get_ajax_response($(this).attr('href'), 'html', false);
			var html = '<div id="hc_content_selector">' + response + '</div>';

			$('#facebox .help_centre').find('#hc_content_selector').remove();

			$(html).insertAfter($('.active-tab'));

			$('#hc_content_selector').height(wrapper.height()).find('.help_centre_content').height((wrapper.height() - $('.help_centre_heading').outerHeight()));

			hc_content_links();

			$('#facebox .help_centre').find('#help_phrase').val('');

			isolatedScroll($('.help_centre_content'));
		});
	});

	$('#hc_content_selector a[href*="#"]:not([href*="#help-"])').each(function(){
		$(this).click(function(e){
			e.preventDefault();
			var link_name = $(this).attr('href').replace('#', '');
			link_name = link_name.replace('%20', ' ');
			var scrollTop = $('#hc_content_selector a[name="'+link_name+'"]').position().top;
			$('.help_centre_content').scrollTop(scrollTop - 170);
		});
	});
}

function hc_help_for_page() {
	var block = $('#popup_help_center_overview').find('.help_for_page');

	if (block.length != 0) {
		block.click(function(e){
			e.preventDefault();

			var link = $(this).attr('href');
			var section = link.split('?')[0].split('/')[2];
			var topic = get_param_from_url(link, 'topic');

			$('#helpTabs a[rel="popup_help_center_' + section + '"]').trigger('click');
			$('#popup_help_center_' + section).find('a[href="/help/' + section + '?topic=' + topic + '"]').trigger('click');
		});
	}
}

function hc_go_to_topic($this) {
	if(typeof $this == "string"){
		var link = $this;
	}else{
		$($this).on('click', function(e) { e.preventDefault(); });
		var link = $($this).attr('href');
	}
	$.facebox(function() {
		$.ajax({
			type: 'GET',
			url: '/help',
			dataType: 'html',
			async: false,
			success: function(data) {
				$.facebox(data);
				var section = link.split('?')[0].split('/')[2];
				var topic = get_param_from_url(link, 'topic');
				$('#helpTabs a[rel="popup_help_center_' + section + '"]').trigger('click');
				$('#popup_help_center_' + section).find('a[href="/help/' + section + '?topic=' + topic + '"]').trigger('click');
			}
		});
	});
}

function hc_search_with_ajax() {
	$('#facebox .help_centre').find('button[name="search_button"]').click(function(e){
		e.preventDefault();

		var search_string = $(this).prev('input').val();
		var search_name = $(this).prev('input').attr('name');
		var wrapper = $('.help_centre');
		var active = wrapper.find('.active-tab');
		var response = get_ajax_response($(this).parents('form').attr('action') + '?' + search_name + '=' + search_string, 'html', false);
		var html = '<div id="hc_content_selector">' + response + '</div>';

		$('#facebox .help_centre').find('#hc_content_selector').remove();

		wrapper.append(html);

		$('#hc_content_selector').height(active.height()).find('.help_centre_content').height((active.height() - $('.help_centre_heading').outerHeight()));

		active.hide();

		hc_content_links();

		isolatedScroll($('.help_centre_content'));
	});
}

function hc_edit_ajax_submit(options) {
	$('.hc-edit').find('button[type="submit"]').on('click', function(e) {
		e.preventDefault();

		var form = $('.hc-edit');
		var action = form.attr('action');
		var content = tinymce.get('hc_content').getContent();
		var saved = false;

		$.ajax({
			type: 'POST',
			url: action,
			data: {content: content},
			dataType: 'json',
			async: false,
			success: function(data) {
				if (data.status == 'ok') {
					saved = true;
				} else {
					$.alert({content: options.error});
				}
			}
		});

		if (saved == true) {
			var link = decodeURIComponent(action).split('?');
			var topic = get_param_from_url('?'+link[2], 'topic');
			var section = link[1].replace('from=/help/', '').replace('/', '');

			$('#helpTabs a[rel="popup_help_center_' + section + '"]').trigger('click');
			$('#popup_help_center_' + section).find('a[href="/help/' + section + '?topic=' + topic + '"]').trigger('click');
		}
	});
}

function help_hack_for_tinymce_correct_destroy(id) {
	if (id.indexOf('#') == 0) {
		id = id.substr(1);
	}

	if (id.indexOf('.') == 0) {
		id = id.substr(1);
	}

	if (typeof(tinymce) != 'undefined') {
		if (tinymce.get(id))
			tinymce.get(id).destroy();
	}
}

function get_param_from_url(string, key, all) {
	var query = string.split("?")[1];
	var data = (typeof query == 'undefined') ? [] : query.split("&");
	var result = {};
	for(var i=0; i<data.length; i++) {
		var item = data[i].split("=");
		result[item[0]] = item[1];
	}
	if (all) {
		return result;
	} else {
		return result[key];
	}
}

function submit_classes_export(t, controller, action, age) {
	var t = $(t);
	var form = $('form#classes');

	form.attr('action', ('/' + controller + (action ? ('/' + action + (age ? '?age=' + age : '')) : '')));

	form.submit();
}

// tool provider edit form fields

function show_tp_fields(t) {
	var t = $(t);
	var s = t.selected().val();
	var w = t.parents('form').find('.domain-url-xml');

	if (s == 'URL') {
		w.find('label').first().text('Url:');
		w.find('textarea').parent('p').show();
	} else if (s == 'Domain') {
		w.find('label').first().text('Domain:');
		w.find('textarea').parent('p').show();
	} else if (s == 'URL/XML') {
		w.find('label').first().text('Url:');
		w.find('textarea').parent('p').hide();
		w.find('textarea').val('');
	} else {
		$.alert({content: 'Not Good!'});
	}
}

// export more classes gradebook

function check_checked(t) {
	var form = $(t).parents('form');

  if (form.length == 0) {
    form = $(".tableForm");
  }

	if (form.find('input[type="checkbox"]:checked').length > 0) {
		return true;
	} else {
		$.alert({content: 'Nothing selected. Select at least one item.'});
		return false;
	}
}

// tool info autocomplet when tool provider selected

function handle_lti_version_data(select){
	if(select.value == "LtiV1p3"){
		$("#p_tool_public_key").show();
	}else{
        $("#p_tool_public_key").hide();
	}
}

function do_tp_autofill(t, resource) {
	var tool_provider_id = $(t).val();
	var form = $(t).parents('form');
  	var resource = resource || 'resource';

	if (!tool_provider_id) {
		form.find('input#' + resource + '_name').val('');
		form.find('textarea#' + resource + '_description').val('');
		form.find('input#' + resource + '_config_url').val('');
        $("#p_tool_public_key").hide();
        $('#' + resource + '_tool_public_key').val('');
        $('#' + resource + '_deployment_id').val('');
	} else {
		get_tp_data(tool_provider_id, form, resource);
	}
}

function get_tp_data(tool_provider_id, wrapper, resource) {
	$.ajax({
		type: "POST",
		url: "/tool_provider/get_info/" + tool_provider_id,
		dataType: "json",
		success: function(data) {
			$.each(data, function(k,v) {
				wrapper.find('[id="' + resource + '_' + k + '"]').val(v);
                if(k === 'lti_type' && v === 'LtiV1p3'){
                    $('#p_tool_public_key').show();
                }
                if(k === 'lti_type' && v === 'Lti'){
                    $('#p_tool_public_key').hide();
                    $('#' + resource + '_tool_public_key').val('');
                    $('#' + resource + '_deployment_id').val('');
				}
			});
		}
	});
}

function launch_lti(t, controller) {
	var t = $(t);
	var id = t.attr('href').split('/')[3];
	var url = decodeURIComponent(location.protocol + "//" + location.host + '/' + (controller || 'lti') + '/launch/' + id);
	var title = t.text();
	var data = t.data();

	var w = data.width || '1000px';
	var h = data.height || '800px';

	window.open(url, "'" + title + "'", "scrollbars=1, width=" + w + ", height=" + h);
}

function custom_lti_launch(t, no_email) {
  if (no_email == true) {
    $.alert({content: 'You must first set your account email in profile settings!'});
    return false;
  }

  var t = $(t);
  var id = t.attr('href').replace( /^\D+/g, '').split('?')[0];
  var url = location.protocol + "//" + location.host + '/assignment_lti/launch?assignment_id=' + id;
  var title = t.text();

  if(is_mobile_app_mode()){
    window.parent.postMessage("{\"method\": \"loadBrowser\", \"href\": \"" + decodeURIComponent(url) + "\"}", "*");
  }else{
    window.open(decodeURIComponent(url), "'" + title + "'", "scrollbars=1,width=1000px,height=600px,resizable=true");
  }
}

function h5p_launch(t, no_email) {
	if (no_email == true) {
		$.alert({content: 'You must first set your account email in profile settings!'});
		return false;
	}

	var t = $(t);
	var id = t.attr('href').replace( /.+?\/show\//, '').split('?')[0];
	var url = location.protocol + "//" + location.host + '/assignment_h5p/launch?assignment_id=' + id;
	var title = t.text();

	if(is_mobile_app_mode()){
		window.parent.postMessage("{\"method\": \"loadBrowser\", \"href\": \"" + decodeURIComponent(url) + "\"}", "*");
	}else{
		window.open(decodeURIComponent(url), "'" + title + "'", "scrollbars=1,width=1000px,height=600px,resizable=true");
	}
}

function turnitin_launch(t, method, no_email, query) {
	if (no_email == true) {
		$.alert({content: 'You must first set your account email in profile settings!'});
		return false;
	}

	var t = $(t);
	var id = t.attr('href').replace( /^\D+/g, '').split('?')[0];
	var url = location.protocol + "//" + location.host + '/turnitin_lti/launch?assignment_id=' + id;
	var title = t.text();

	url += "&section=" + method;

	if (query) {
		var query_size = Object.keys(query).length;

		url += "&";
		k = 1;

		$.each(query, function(key, val) {
			url += key + "=" + val;
			url += (k < query_size ? '&' : '');
			k++;
		});
	}

	if(is_mobile_app_mode()){
		window.parent.postMessage("{\"method\": \"loadBrowser\", \"href\": \"" + decodeURIComponent(url) + "\"}", "*");
	}else{
		window.open(decodeURIComponent(url), "'" + title + "'", "scrollbars=1,width=1000px,height=600px,resizable=true");
	}
}

function check_turnitin_sync(class_id, assignment_id) {
	var interval = setInterval(function() {
		$.ajax({
			type: 'POST',
			url: '/turnitin_lti/check_for_synchronization/' + class_id,
			data: {assignment_id: assignment_id},
			dataType: 'json',
			async: false,
			success: function(json){
				if (json.status == 'ok') {
					$('.sync-message').css('background-color', '#21A1B2').find('p').text(json.message);
					clearInterval(interval);
					setTimeout(function(){ location.reload(); }, 1500);
				}
			}
		});
	}, 3000);
}

function turnitin_forced_sync(el, id) {
	$.post("/teacher_turnitin_assignment/forced_sync", {id: id});
	setTimeout(function(){ location.reload(); }, 700);
}

function sync_sections(url){
	$.post(url, $('#classes').serialize(), function(data){
		$.facebox(data);
	});
}

function overwrite_box_with(max) {
	$("#facebox").css('max-width', max + 'px');
	$("#facebox #faceboxContent").css('width', '100%');
}

// this is the filter search button show/hide engine

function init_filter_effect(button, wrapper, extra, ajax) {
	button = (button || '.show-filter-field');
	wrapper = (wrapper || '.compactFilterContainer');
	extra = (extra || true);
	ajax = (ajax || false);

	var search_button = $(button).parent('li');
	var filter_wrapper = $(wrapper);

	if (ajax == true) {
		$.ajax({url: '/library/set_filter_session'});
	}

	if (search_button.is(":visible")) {
		show_filter_field(search_button, filter_wrapper, extra);
	} else {
		hide_filter_field(search_button, filter_wrapper, extra);
	}

	if ($('input#compact_filter_phrase').length != 0) {
		focus_element('compact_filter_phrase');
	}
}

function show_filter_field(button, wrapper, extra) {
	if (button.parent().not(':only-child') && button.is(':only-child')) {
		button.parent().hide();
	} else {
		button.hide();

		if (button.prev('li').length == 0) {
			button.next('li').css('border-left-width', '0');
		}
	}

	wrapper.show().find('input').focus();
}

function hide_filter_field(button, wrapper, extra) {
	var input = wrapper.hide().find('input');

	if (button.parent().not(':only-child') && button.is(':only-child')) {
		button.parent().show();
	} else {
		button.show().next('li').css('border-left-width', '1px');
	}

	if (input.val() != '') {
		input.val('').keyup().blur();
	}

	if (extra == true) {
		var drop_downs = wrapper.find('select');
		var k = 0;

		$.each(drop_downs, function(key,val) {
			k++;

			$(val).find('option[value="0"]').attr("selected", "selected");

			if (k == drop_downs.length) {
				$(val).trigger('change');
			}
		});
	}
}

function close_filter(url, button, wrapper, ajax) {
	var checkboxes = $(wrapper + ' input:checkbox:not(:checked)');
	var name = $('input#compact_filter_phrase');

	if (ajax == true) {
		$.ajax({url: '/library/set_filter_session', async: false});
	}

	if (checkboxes.length > 0 || (name.length != 0 && name.val() != '')) {
		if (url.includes('library')) {
			url = removeUrlQueryParameter(window.location.href, 'name');
			url = removeUrlQueryParameter(url, 'filter_active');
		}
		window.location.href = url;
	} else {
		if ($(button).closest('ul').not(':only-child') && $(button).parent('li').is(':only-child')) {
			$(button).closest('ul').show();
		} else {
			$(button).parent('li').show().next('li').css('border-left-width', '1px');
		}

		$(wrapper).hide();
	}
}

function removeUrlQueryParameter(url, paramKey)
{
	var r = new URL(url);
	r.searchParams.delete(paramKey);
	return r.href;
}

// turnitin originality sync
// TODO: AT: Refactor the next to function for originality - if the refresh is kept !!!

function do_turnitin_originality_sync_refresh(klass, assignment) {
  var pendings = $('#centreColumn').find('.originality-status-completed');
  var error, error_count = 0;
  var synced = 0;

  if (pendings.length > 0) {
    $('#centreColumn').find('#fixedSectionHeader').prepend('<div class="sync-message" style="width:auto;margin:1px 0 15px;background-color:#F4A30D;position:relative;padding:1px 10px;"><p><img src="/images/loading-16.gif" style="float:left;margin:2px 15px 0 0;" /> <span style="color:#fff;">Refreshing similarities report, for the users on this page, from Turnitin...</span></p></div>');

    resizeSectionHeader();

    var time = 1000;

    $.each(pendings, function(k,v) {
      setTimeout(function(){
        var pending = $(v);
        var paper_id = pending.data('paper');
        var student_id = pending.data('student');

        $.ajax({
          type: "POST",
          url: "/turnitin_lti/get_originality_status",
          data: {assignment_id: assignment, klass_id: klass, paper_id: paper_id, student_id: student_id},
          dataType: 'json',
          success: function(data) {
            if (data.error) {
              error_count++;
              error = data.error;

              $('.sync-message').css('background-color', '#C83131');
              $('.sync-message').find('img').remove();
              $('.sync-message span').html(error);

              return false;
            } else {
              if (data.text == 'Pending') {
                $('span[data-student="' + data.student + '"]').html(data.text);
              } else {
                synced++;

                $('span[data-student="' + data.student + '"]').html('<a href="' + assignment + '" class="tableLink2" onclick="turnitin_launch(this, \'originality\', false, {\'student\': ' + data.student + ', \'paperid\': ' + data.paper + '}); return false;">' + data.text + '</a>');
              }
            }

            if (error_count > 0) {
              return false;
            }

            if ((error_count == 0) && (pendings.length == synced)) {
              $('.sync-message').css('background-color', '#21A1B2');
              $('.sync-message').find('img').remove();
              $('.sync-message span').html("Similarities successfully synchronized.");
            }
          }
        });
      }, time);

      time += 1000;
    });
  }
}

function do_turnitin_originality_sync(klass, assignment) {
	var pendings = $('#centreColumn').find('.pending-needs-sync');
	var error, error_count = 0;
	var synced = 0;

	if (pendings.length > 0) {
		$('#centreColumn').find('#fixedSectionHeader').prepend('<div class="sync-message" style="width:auto;margin:1px 0 15px;background-color:#F4A30D;position:relative;padding:1px 10px;"><p><img src="/images/loading-16.gif" style="float:left;margin:2px 15px 0 0;" /> <span style="color:#fff;">Fetching pending similarities from Turnitin...</span></p></div>');

		resizeSectionHeader();

		var synchronize_turnitin = function() {
			$.each(pendings, function() {
				var pending = $(this);
				var paper_id = pending.data('paper');
				var student_id = pending.data('student');

				$.ajax({
					type: "POST",
					url: "/turnitin_lti/get_originality_status",
					data: {assignment_id: assignment, klass_id: klass, paper_id: paper_id, student_id: student_id},
					dataType: 'json',
					async: false,
					success: function(data) {
						if (data.error) {
							error_count++;
							error = data.error;

							$('.sync-message').css('background-color', '#C83131');
							$('.sync-message').find('img').remove();
							$('.sync-message span').html(error);

							return false;
						} else {
							if (data.text == 'Pending') {
								$('span[data-student="' + data.student + '"]').html(data.text);
							} else {
								synced++;

								$('span[data-student="' + data.student + '"]').html('<a href="' + assignment + '" class="tableLink2" onclick="turnitin_launch(this, \'originality\', false, {\'student\': ' + data.student + ', \'paperid\': ' + data.paper + '}); return false;">' + data.text + '</a>');
							}
						}
					}
				});

				if (error_count > 0) {
					return false;
				}
			});

			if ((error_count == 0) && (pendings.length == synced)) {
				$('.sync-message').css('background-color', '#21A1B2');
				$('.sync-message').find('img').remove();
				$('.sync-message span').html("Similarities successfully synchronized.");

				clearInterval(interval);
			}
		};

		interval = setInterval(function(){ synchronize_turnitin(); }, 2500);
	}
}

var check_submission_id = null;
var check_submission_student = null;
var check_submission_date = null;

function check_for_submissions(id, student, date) {
  if ($('#lti_launch_frame').length > 0) {
    check_submission_id = id;
    check_submission_student = student;

    if (date) {
      check_submission_date = date;
    }
  }

	$('.optionsRibbon a[onclick*="submit"], .optionsRibbon a[onclick*="h5p"]').on('click', function(e){
    check_for_submissions_implementation(id, student, date)
	});
}

function check_for_submissions_from_frame() {
  if (check_submission_date) {
    check_for_submissions_implementation(check_submission_id, check_submission_student, check_submission_date);
  } else {
    check_for_submissions_implementation(check_submission_id, check_submission_student);
  }
}

function check_for_submissions_implementation(id, student, date) {
  var attempts = $('span.number-of-attempts');
  var result;
  var query_string = window.location.search;
  var cycles = 60;
  var cycle = 0;
  var timer = 2000;

  function check() {
    var time = setTimeout(function(){
      $.ajax({
        type: 'POST',
        url: '/assignment/check_for_submission/' + id,
        data: {student_id: student, date: date},
        dataType: 'json',
        async: false,
        success: function(data) {
          result = parseInt(data.count);
        }
      });

      if ((parseInt(attempts.text()) < result) || (date && result > 0)) {
        if (query_string == '') {
          window.location = window.location.href + '?submitted=true';
        } else if (query_string.indexOf('submitted=true') > -1) {
          window.location = window.location.href;
        } else {
          window.location = window.location.href + '&submitted=true';
        }
      }

      cycle++;

      if (cycle <= cycles) {
        if ((timer < 7000) && (cycle % 3 == 0)) {
          timer += 500;
        }

        check();
      }
    }, timer);
  }

  check();
}

function style_select_action() {
	$('select[name="klass[style]"]').on('change', function(){
		var selected = $(this).find('option:selected').val();

		if (selected == 'Instructor' || selected == 'Blended') {
			show_element('duration');
			hide_element('duration_text');
			hide_element('duration_text textarea');
		} else if (selected == 'Self paced' || selected == 'Micro class') {
			hide_element('duration');
			show_element('duration_text');
			show_element('duration_text textarea');
		}
	});
}

function replace_relative_paths(string){
	string = string.replace(/href="\//g, 'target="contentFrame" href="'+window.location.protocol+'//' + window.location.host + '/');
	string = string.replace(/href='\//g, 'target=\'contentFrame\' href=\''+window.location.protocol+'//' + window.location.host + '/');
	string = string.replace(/src="\//g, 'src="'+window.location.protocol+'//' + window.location.host + '/');
	string = string.replace(/src='\//g, 'src=\''+window.location.protocol+'//' + window.location.host + '/');
	string = string.replace(/action="\//g, 'target="contentFrame" action="'+window.location.protocol+'//' + window.location.host + '/');
	string = string.replace(/action='\//g, 'target=\'contentFrame\' action=\''+window.location.protocol+'//' + window.location.host + '/');

	return string;
}

function refresh_private_key(el) {
	$.confirm({
		content : 'Are you sure you want to reset your private key?',
		confirm : function() {
			$.ajax({
				type : "POST",
				url : "/single_sign_on/refresh_private",
				dataType : "json",
				success : function(data) {
					$('#school_sso_custom_secret').val(data.key);
				}
			});
		}
	});
}

// resource library filtering

function init_resource_library_filter(controller, action, id, lesson, section, folder, game, popup) {
	var name = $('#resource_name');
	var subject = $('#resource_subject');
	var classification = $('#resource_type');
	var library = $('#resource_library');
	var assignment_type = $('#resource_assignment_type');

	name.keyup(function(e) {
		typewatch(function() { resource_library_filter(controller, action, id, lesson, section, folder, game, popup, name, subject, classification, library); }, 1000);
	});

	subject.on('change', function(e) {
		resource_library_filter(controller, action, id, lesson, section, folder, game, popup, name, subject, classification, library, assignment_type);
	});

	classification.on('change', function(e) {
		resource_library_filter(controller, action, id, lesson, section, folder, game, popup, name, subject, classification, library, assignment_type);
	});

	library.on('change', function(e) {
		resource_library_filter(controller, action, id, lesson, section, folder, game, popup, name, subject, classification, library, assignment_type);
	});

	assignment_type.on('change', function(e) {
		resource_library_filter(controller, action, id, lesson, section, folder, game, popup, name, subject, classification, library, assignment_type);
	});
}

function resource_library_filter(controller, action, id, lesson, section, folder, game, popup, name, subject, classification, library, assignment_type) {
	var wrapper = $("#ResourceLibraryFilterWrapper");
	var url = '/' + controller + '/' + action + '/' + id + '?';
	var args = [];

	if (name) {
		args.push('resource_name=' + encodeURIComponent(name.val()));
	}

	if (lesson) {
		args.push('lesson_id=' + lesson);
	}

	if (section) {
		args.push('section_id=' + section);
	}

	if (folder) {
		args.push('folder=' + folder);
	}

	if (game) {
		args.push('game=' + game);
	}

	if (subject) {
		var value = subject.val();

		if (value) {
			args.push('subject=' + value);
		}
	}

	if (classification) {
		var value = classification.val();

		if (value) {
			args.push('classification=' + value);
		}
	}

	if (library) {
		var value = library.val();

		if (value) {
			args.push('library=' + value);
		}
	}

	if (assignment_type) {
		var value = assignment_type.val();

		if (value) {
			args.push('assignment_type=' + value);
		}
	}

	args.push('ajax=true');
	url += args.join('&');

	$.ajax({
		type: "POST",
		url: url,
		dataType: 'html',
		beforeSend: function(){
			ajax_add_loader(wrapper, true);
		},
		success: function(html) {
			wrapper.find('.content').html(html);
			close_ajax_loader();

			if (wrapper.find('.facebox-content').length == 1) {
				isolatedScroll(wrapper.find('.facebox-content'));
			}
		}
	});
}

function ajax_add_loader(container, remove_footer_height) {
	container.css('position', 'relative');

	if ($('#AppendedLoader').length == 0) {
		if (container.find('.footer').length >= 1 && !remove_footer_height) {
			container.append('<div id="AppendedLoader" style="position:absolute; z-index: 5; top:0; left: 0; background: rgba(255, 255, 255, 0.8) url(\'/images/loading-animation-' + (is_grey_page_mode() ? 'grey' : 'white') + '-retina.gif\') no-repeat center center / 100px; width: 100%; height: ' + (container.height() - container.find('.footer').height()) + 'px;"></div>');
		} else {
			container.append('<div id="AppendedLoader" style="position:absolute; z-index: 5; top:0; left: 0; background: rgba(255, 255, 255, 0.8) url(\'/images/loading-animation-' + (is_grey_page_mode() ? 'grey' : 'white') + '-retina.gif\') no-repeat center center / 100px; width: 100%; height: ' + container.height() + 'px;"></div>');
		}
	}
}

function close_ajax_loader() {
	if ($('#AppendedLoader').length >= 1) {
		$('#AppendedLoader').remove();
	}
}

/* type watch */
var typewatch = (function(){
	var time = 0;

	return function(callback, ms){
		clearTimeout (time);
		time = setTimeout(callback, ms);
	};
})();

// Infinite scroll for add existing

var infinite_stop;
var infinite_pause;

function init_add_existing(count, limit, controller, action, id, subject, name, library, classification, lesson_id) {
	if (count > limit) {
		infinite_stop = false;
		infinite_pause = true;

		init_add_existing_infinite_scroll(controller, action, id, subject, name, library, classification, lesson_id);
	}

	add_existing_submit_button();
}

// lesson_id is hack, replace with container_id

function init_add_existing_infinite_scroll(controller, action, id, subject, name, library, classification, lesson_id) {
	$("#facebox .facebox-content").scroll(function() {
		if (infinite_pause) {
			if ($(this).scrollTop() >= ($(this)[0].scrollHeight - $(this).height() - 50)) {
				infinite_pause = false;
				add_existing_more(controller, action, id, subject, name, library, classification, lesson_id);
			}
		}
	});
}

function add_existing_more(controller, action, id, subject, name, library, classification, lesson_id) {
	var wrapper = $('#facebox .facebox-content'),
		more = $('.add-existing-more').last(),
		offset = more.data('offset'),
		limit = more.data('limit'),
		size = more.data('size'),
		count = more.data('count'),
		url = '/' + controller + '/' + action + '/' + id;

	url += '?';
	url += 'offset=' + (offset + limit);
	url += '&limit=' + limit;
	url += '&count=' + count;

	if (lesson_id && lesson_id.length > 0) {
		url += '&lesson_id=' + lesson_id;
	}

	if (subject && subject.length > 0) {
		url += '&subject=' + subject;
	}

	if (name && name.length > 0) {
		url += '&resource_name=' + name;
	}

	if (library && library.length > 0) {
		url += '&library=' + library;
	}

	if (classification && classification.length > 0) {
		url += '&classification=' + classification;
	}

	if (!infinite_stop) {
		$.ajax({
			type: "POST",
			url: url,
			beforeSend: function(){
				more.append('<img src="/images/loading-animation-white-retina.gif" width="100" />');
			},
			success: function(data) {
				more.remove();
				infinite_pause = true;

				wrapper.append(data);

				add_existing_submit_button();

				var results_count = $('.add-existing-more').last().data('size');

				if (results_count == 0) {
					infinite_pause = false;
					infinite_stop = true;

					$('.add-existing-more').text('No more results'); /* translate */
				}
			}
		});
	}
}

function add_existing_submit_button() {
	// support for multi-select
	$("#ResourceLibraryFilterWrapper").find('input[type="checkbox"]').on('change', function(){
		var count = $("#ResourceLibraryFilterWrapper").find('input[type="checkbox"]:checked').length;
        toggle_selector_submit_button(count > 0);
	});

	// support for single-select
    $("#ResourceLibraryFilterWrapper").find('input[type="radio"]').on('change', function(){
        var count = $("#ResourceLibraryFilterWrapper").find('input[type="radio"]:checked').length;
        toggle_selector_submit_button(count > 0);
    });
}

function toggle_selector_submit_button(value) {
    if (value) {
        $('#ResourceLibraryFilterWrapper .footer button').removeAttr('disabled');
        $('#ResourceLibraryFilterWrapper .footer button').removeAttr('style');
    } else {
        $('#ResourceLibraryFilterWrapper .footer button').attr('disabled', 'disabled').css('background-color', '#aeaeae');
    }
}

// game

function game_settings_display() {
	var leaderboard = $('#game_leaderboard');
	var leaderboard_wrapper = $('.leaderboardSettings');

	leaderboard.on('change', function() {
		if (this.checked) {
			leaderboard_wrapper.show();
		} else {
			leaderboard_wrapper.hide();
		}
	});
}

function update_game_display_count(controller, the_id, game_id) {
  $('#game_display_count').on('change', function() {
    ajax_request('/' + controller + '/set_leaderboard_count/' + the_id + '?game=' + game_id + '&value=' + this.value);
  });
}

function popup_player_history(selector, admin_controller, id, the_id) {
  var selector = $(selector);

  selector.css('cursor', 'pointer').on('click', function() {
    $.facebox({'ajax' : '/' + admin_controller + '/player/' + the_id + '?game=' + id + '&player_id=' + $(this).data('id')});
  });
}

function popup_team_history(selector, admin_controller, id, the_id) {
	var selector = $(selector);

	selector.css('cursor', 'pointer').on('click', function() {
		$.facebox({'ajax' : '/' + admin_controller + '/team/' + the_id + '?game=' + id + '&team_id=' + $(this).data('id')});
	});
}

function toggle_select_choice(element) {
	var selector = $(element);
	var parent = selector.parents('p');
	var value = selector.val().toLowerCase().replace(/ /g, '_');

	if (value == 'immediately') {
		parent.find('span').hide();
	} else {
		parent.find('span').hide();
		parent.find('span').find('select').val('');
		parent.find('span').find('input').val('');
		parent.find('.' + value).show();
	}
}

// deselect the action from the commit

function deselect_sync_action(el, sync_id) {
	$.ajax({
		type: 'POST',
		url: '/sis/select_action/',
		data: {action_id: $(el).val(), sync_id: sync_id, value: $(el).is(':checked')},
		success: function(data) {
			console.log(data);
		},
		error: function(data) {
			console.log(data);
		}
	});
}

/* dashboard calendar */

function get_dashboard_calendar(month, year, day) {
	$.get('/my_calendar/month_small/?year=' + year + '&month=' + month + (typeof day != 'undefined' ? '&day=' + day : ''), function(data) {
		$('#small_calendar_container').html(data);
		$('.small-month-name').html($('#new_small_month_name').val());
	});

	$('#previous_small_calendar_link').attr('href', 'javascript:get_dashboard_calendar(' + (month == 1 ? 12 : month - 1) + ', ' + (month == 1 ? year - 1 : year) + ')');
	$('#next_small_calendar_link').attr('href', 'javascript:get_dashboard_calendar(' + (month == 12 ? 1 : month + 1) + ', ' + (month == 12 ? year + 1 : year) + ')');
}

/* x_api_servers */
function set_current_x_api_server(x_api_id) {
	ajax_request('/x_api_servers/set_default/' + x_api_id);
}

function try_connection(x_api_server_id) {
  $.ajax({
    url  : '/x_api_servers/try_connection/' + x_api_server_id,
    type : 'post',
    success : function(data) {
      console.log(data);
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log('Fail');
    }
  });
}

/* sis filter */
function sis_filter_schools(el) {
  var selected_value = $(el).find('option:selected').val();
  var location = window.location.href;

  if (location.match(/\?./)) {
    location = location.split("?")[0];
  }

  if (selected_value) {
    window.location = location + '?school_id=' + selected_value;
  } else {
    window.location = location;
  }
}

function validateZoomUSCredentials(apiKey, apiSecret) {
	$.ajax({
    url  : '/zoomus_account/validate_credentials/',
    type : 'post',
    data : {
    	key    : apiKey,
    	secret : apiSecret
    },
    
    success : function(data) {
      if(data['status'] == true) {
      	$(".zoomus-apikeys-submit-form ").off('submit').submit();
      } else {
      	alert(data['status']);
      }
    },
    
    error: function (xhr, ajaxOptions, thrownError) {
      // Error
    }
  });
}

function validateWebExCredentials(apiKey, apiSecret, site_name) {
	$.ajax({
    url  : '/webex_account/validate_credentials/',
    type : 'post',
    data : {
    	key    : apiKey,
    	secret : apiSecret,
    	site   : site_name
    },
    
    success : function(data) {
      if(data['status'] == true) {
      	$(".webex-apikeys-submit-form").off('submit').submit();
      } else {
      	alert(data['status']);
      }
    },
    
    error: function (xhr, ajaxOptions, thrownError) {
      // Error
    }
  });
}

$(document).ready(function() {
  $(".zoomus-apikeys-submit-form").submit(function(event) {
  	apiKey    = $('#zoomus_account_consumer_key').val();
  	apiSecret = $('#zoomus_account_consumer_secret').val();

	  validateZoomUSCredentials(apiKey, apiSecret);
	  event.preventDefault();
	});

	$(".webex-apikeys-submit-form").submit(function(event) {
  	apiKey    = $('#webex_account_consumer_key').val();
  	apiSecret = $('#webex_account_consumer_secret').val();
  	site_name = $('#webex_account_site_name').val();
	  
	  validateWebExCredentials(apiKey, apiSecret, site_name);
	  event.preventDefault();
	});
});

/*  proficiency picker  */

function set_curriculum_dropdown(curricula, selected){
    $('#filter_by_curriculum option').remove();
	var select = $('#filter_by_curriculum')[0];

	for (var i = 0, len = curricula.length; i < len; i++) {
		select.add(new Option(curricula[i][0], curricula[i][1]));
	}
	
	$('#filter_by_curriculum option[value='+ selected +']').attr('selected','selected');
}

// display "student_access" option if "Personal" library is NOT checked # in application_helper/edit_library

function update_scope_user_student_access(radio_button) {
	if (radio_button.checked) {
		$('.student_access_library').hide();
	}
}

 function update_scopes_student_access(radio_button) {
	 if (radio_button.checked) {
		 $('.student_access_library').show();		
	 }
 }

function select_current_theme(controller, radio_button, id) {
	if (radio_button.checked) {
		if (id == null) {
			window.location.href = '/' + controller + '/select_current_theme?theme_id=' + radio_button.value;
		} else {
			window.location.href = '/' + controller + '/select_current_theme/' + id + '?theme_id=' + radio_button.value;
		}
	}
}

function select_current_accessible_theme(controller, radio_button, id) {
    if (radio_button.checked) {
        if (id == null) {
            window.location.href = '/' + controller + '/select_current_accessible_theme?theme_id=' + radio_button.value;
        } else {
            window.location.href = '/' + controller + '/select_current_accessible_theme/' + id + '?theme_id=' + radio_button.value;
        }
    }
}

function set_accessibility_theme(controller, checkbox, id) {
	if (id == null) {
		window.location.href = '/' + controller + '/set_accessibility_theme?value=' + check_s(checkbox);
	} else {
		window.location.href = '/' + controller + '/set_accessibility_theme/' + id + '?value=' + check_s(checkbox);
	}
}

/* Stripe checkout */

function init_stripe_sca_cart() {
	if( window.Cart && !Cart.original_update_cart) {
		Cart.original_update_cart = Cart.update_cart;

		Cart.update_cart = function(data) {
			if( data.payment_form ) {
				var payment_block = $('#payment_block').attr('id', 'payment_block_original');
				var return_value = Cart.original_update_cart(data);
				payment_block.attr('id', 'payment_block');
				var order_total = $('#order_total').val();

				if (order_total == 0 && data.free_checkout){
					payment_block.replaceWith(data.free_checkout);
				}
				else if (payment_block.find('#card-element').length > 0) {
					var new_block = $('<div>' + data.payment_form + '</div>');

					/*new_block.find('input').each(function () {
						var $elem = $(this);
						payment_block.find('input[name=' + $elem.attr('name') + ']').replaceWith($elem);
					});*/

					payment_block.find('.payment_table').replaceWith(new_block.find('.payment_table'));
				}

				return return_value;
			}
			else
				return Cart.original_update_cart(data);
		};

		return true;
	}
	else
		return !window.Cart;
}

function init_stripe_checkout(publishable_key, form_id, is_popup_form){
	// This identifies your website in the createToken call below
	Stripe.setPublishableKey(publishable_key);

	$('#' + form_id).submit(function() {
		var $form = $(this);

		// Disable the submit button to prevent repeated clicks
		// $form.find('button').prop('disabled', true);

		// validate
		if(validate_stripe_form($form)) {
			try {
				Stripe.card.createToken($form, stripeResponseHandler);
			} catch (err) {
				stripe_show_errors($form, err.message);
			}
		}

		// Prevent the form from submitting with the default action
		return false;
	});

	function stripeResponseHandler(status, response) {
		var $form = $('#' + form_id);
		if (response.error) {
			stripe_show_errors($form, response.error.message);
		} else {
			// response contains id and card, which contains additional card details
			var token = response.id;
			// Insert the token into the form so it gets submitted to the server
			$form.append($('<input type="hidden" name="stripeToken" />').val(token));
			// and submit
			if(is_popup_form){
				popup_form(form_id);
			}
			$form.get(0).submit();
		}
	}
}

/* Stripe sca checkout - elements - create card */

function create_card(stripe) {
	var elements = stripe.elements();
	var card = elements.create("card", {
		iconStyle: "solid",
		hidePostalCode: true,
		style: {
			base: {
				color: "#32325D",
				fontWeight: 500,
				fontFamily: "Inter UI, Open Sans, Segoe UI, sans-serif",
				fontSize: "16px",
				fontSmoothing: "antialiased",

				"::placeholder": {
					color: "#CFD7DF"
				}
			},
			invalid: {
				color: "#E25950"
			}
		}
	});
	card.mount("#card-element");
	return card;
}

/* Stripe sca checkout - used for subscription purchases. */

function init_stripe_sca_checkout2(publishable_key, form_id, is_popup_form){
	if( !init_stripe_sca_cart() )
		return;

	var $form = $('#' + form_id);
	// This identifies your website in the createToken call below
	var stripe = Stripe(publishable_key);
	var card = create_card(stripe);
	// Elements validates user input as it is typed.
	card.addEventListener('change', function(event) {
		if (event.error) {
			stripe_show_errors($form, event.error.message);
			$form.find('button').prop('disabled', true);
		} else {
			$form.find('button').prop('disabled', false);
		}
	});

	$('#' + form_id).submit(function() {
		if (event && !event.isTrusted) { return false; } // if directly hit enter key in srtipe card element.
		var $form = $(this);

        var tokenData = {};
		if ($form.find('#name').length > 0) { tokenData['name'] = document.getElementById('name').value }
		if ($form.find('#street_1').length > 0) { tokenData['address_line1'] = document.getElementById('street_1').value }
		if ($form.find('#city').length > 0) { tokenData['address_city'] = document.getElementById('city').value }
		if (($form.find('#state').length > 0) && ($form.find('#state')[0].value != '')) { tokenData['address_state'] = document.getElementById('state').value }
		if ($form.find('#zip').length > 0) { tokenData['address_zip'] = document.getElementById('zip').value }
		// if ($form.find('#country').length > 0) { tokenData['address_country'] = document.getElementById('country').value } # TODO: need to get 2 letter codes.

		// validate
		if(validate_stripe_form($form)) {
			try {
				stripe.createToken(card, tokenData).then(function(result) {
			    if (result.error) {
			      stripe_show_errors($form, result.error.message);
			    } else {
			      // Send the token to your server.
			      stripeTokenHandler(result.token);
			    }
			});

			} catch (err) {
				stripe_show_errors($form, err.message);
			}
		}

		// Prevent the form from submitting with the default action
		return false;
	});

	// TODO: should be globally available.
	var fullscreen_progress;
	fullscreen_progress = {
		stop: function() {
			$('.fullscreen_progress').remove();
		}
	};

	function stripeTokenHandler(token) {
		var $form = $('#' + form_id);

		// Insert the token into the form so it gets submitted to the server
		$form.append($('<input type="hidden" name="stripeToken" />').val(token.id));
		// and submit
		if(is_popup_form){
			popup_form(form_id);
		}

		var data = $($form[0].elements).not('#number, #cvc, #credit_card_month, #credit_card_year').serialize();

		$.ajax({
			type : 'POST',
			data : data,
			url : $form.attr('action'),
			success : function(data) {
				if (data.require_3d_auth) {
					handle3d_auth(data.client_secret, data.payment_intent_id)
				}
				else if (data.error != null) {
					fullscreen_progress.stop();
					stripe_show_errors($form, data.error);
				} else {
					window.location.href = '/stripe_sca/redirect_completed_purchase?order=' + order_id;
				}
			}
		});

		function handle3d_auth(client_secret, payment_intent_id) {
			var stripe = Stripe(publishable_key);

			stripe.handleCardPayment(client_secret).then(function(result) {
				// debugger
				if (result.error) {
					fullscreen_progress.stop();
					stripe_show_errors($form, result.error.message);
				} else {
					window.location.href = '/stripe_sca/redirect_completed_purchase?order=' + order_id;
				}
			});

		}
	} // stripeTokenHandler
}

/* Stripe sca update card - used for subscription card updates. */

function init_stripe_sca_update_card(publishable_key, client_secret, form_id, is_popup_form){
	var $form = $('#' +  form_id);
	// This identifies your website in the createToken call below
	var stripe = Stripe(publishable_key);
	var card = create_card(stripe);
	// Elements validates user input as it is typed.
	card.addEventListener('change', function(event) {
		if (event.error) {
			stripe_show_errors($form, event.error.message);
			$form.find('button').prop('disabled', true);
		} else {
			$form.find('button').prop('disabled', false);
		}
	});

	$('#' + form_id).submit(function() {
		var $form = $(this);

		// validate
		if(validate_stripe_form($form)) {
			try {

				stripe.handleCardSetup(client_secret, card).then(function(result) {
					if (result.error) {
						stripe_show_errors($form, result.error.message);
					} else {
						$form.append($('<input type="hidden" name="payment_method" />').val(result.setupIntent.payment_method));
						$form.get(0).submit();
					}
				});

			} catch (err) {
				stripe_show_errors($form, err.message);
			}
		}

		// Prevent the form from submitting with the default action
		return false;
	});

}

// Show stripe errors on the form

function stripe_show_errors(form, message){
	$('#facebox div.error').remove();
	$('div.block div.error').remove();
	form.before('<div class="alert_block error" role="alert"><div class="alert_flex"><div class="alert_icon"><i class="error inverted"></i></div><p>'+ message +'</p></div></div>');
	form.find('button').prop('disabled', false);
	window.progress && progress.stop();
}

// validate stripe form

function validate_stripe_form(form){
	errors = [];
	form.find(':input:visible:not(.not_required)').each(function() {
		if($(this).val() == '') {
			if (t = $(this).parent('p').find('label').text()) { errors.push(t); }
		}
	});
	errors = $.unique(errors);
	if (errors.length > 0) {
		if (errors.length == 1) {missing = ' is missing.'} else {missing = ' are missing.'}
		stripe_show_errors(form, errors.join(', ') + missing);
		return false;
	}
	return true;
}

/* Stripe Sca checkout - used for one time payments.*/

function init_stripe_sca_checkout1(publishable_key, form_id, is_popup_form){
	if( !init_stripe_sca_cart() )
		return;

	var $form = $('#' + form_id);
	// This identifies your website in the createToken call below
	var stripe = Stripe(publishable_key);
	var card = create_card(stripe);
	// Elements validates user input as it is typed.
	card.addEventListener('change', function(event) {
		if (event.error) {
			stripe_show_errors($form, event.error.message);
			$form.find('button').prop('disabled', true);
		} else {
			$form.find('button').prop('disabled', false);
		}
	});

	$('#' + form_id).submit(function() {
		if (event && !event.isTrusted) { return false; } // if directly hit enter key in srtipe card element.
		var $form = $(this);

        var payment_method_data = {billing_details: {address: {}}};
		if ($form.find('#name').length > 0) { payment_method_data['billing_details']['name'] = document.getElementById('name').value }
		if ($form.find('#email').length > 0) { payment_method_data['billing_details']['email'] = document.getElementById('email').value }
		if ($form.find('#street_1').length > 0) { payment_method_data['billing_details']['address']['line1'] = document.getElementById('street_1').value }
		if ($form.find('#city').length > 0) { payment_method_data['billing_details']['address']['city'] = document.getElementById('city').value }
		if (($form.find('#state').length > 0) && ($form.find('#state')[0].value != '')) { payment_method_data['billing_details']['address']['state'] = document.getElementById('state').value }
		if ($form.find('#zip').length > 0) { payment_method_data['billing_details']['address']['postal_code'] = document.getElementById('zip').value }

		// validate
		// TODO: validate stripe card element.
		if(validate_stripe_form($form)) {
			try {

				$.ajax({
					url: '/stripe_sca/get_payment_intent/?order=' + order_id,
					dataType: 'json',
					success: function (response) {
						if (response.error) {
							Error('Some error occured during payment!');
						}
						else {
							var clientSecret = response.client_secret;

							stripe.handleCardPayment(
								clientSecret, card, {
									payment_method_data: payment_method_data
								}
							).then(function(result) {
								if (result.error) {
									stripe_show_errors($form, result.error.message);
								} else {
									// console.log('success');
									$form.get(0).submit();
								}
							});

						}
					} // success
				});

			} catch (err) {
				stripe_show_errors($form, err.message);
			}
		}

		// Prevent the form from submitting with the default action
		return false;
	});
}

// disable submit button unless checkbox is checked. used mostly for agree terms and conditions.
var toggle_submit_button = function(el){
	$('form').find(':button[type=submit]').attr('disabled', !el.checked);
};

// disable submit button unless all checkboxes are checked. used mostly for agree terms and conditions.
var toggle_submit_button2 = function(total_policies){
	var checked_number = $('input[name="terms[]"]:checked').length;
	$('form').find(':button[type=submit]:not(.policy-consent-accept)').attr('disabled', (checked_number != total_policies));
};

function switch_test_variable(element) {
  if ($(element).is(':checked')) {
    window.location.href = '/testing_support/list?' + $(element).attr('id') + '=true';
  } else {
    window.location.href = '/testing_support/list?' + $(element).attr('id') + '=false';
  }
}

// Get bankcode based on card type as per payubiz documentation.
function watch_bankcode() {
	$('#ccnum').on('change', function() {
		bankcode = detectCardType($(this).val());
		$('#bankcode').val(bankcode);
	});

	function detectCardType(number) {
		number = $.trim(number);
		var re = {
			CC: /^4[0-9]{12}(?:[0-9]{3})?$|^5[1-5][0-9]{14}$/, // visa or master card
			AMEX: /^3[47][0-9]{13}$/, // american_express
			DINR: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/ // diners
		};

		for (var key in re) {
			if (re[key].test(number)) {
				return key
			}
		}
	}
}

function show_credit_card_block(flag) {
	if (flag) {
    $('#payu_biz_cc_block').show();
	} else {
    $('#payu_biz_cc_block').hide();
	}
}

function payu_biz_sync_cc_names() {
  $('#user_first_name').blur(function() {
    if ($('#firstname').length > 0) {
      $('[id="firstname"]').val(this.value);
    }
  });
  $('#user_last_name').blur(function() {
    if ($('#lastname').length > 0) {
      $('[id="lastname"]').val(this.value);
    }
  });
  $('#user_email').blur(function() {
    if ($('#email').length > 0) {
      $('[id="email"]').val(this.value);
    }
  });
}

// tabs

function init_draggable_tabs(object_id, tabs_controller) {
  $("#tab_list").sortable({
    handle : 'td.draggable_handle',
    update : function(event, ui) {
      var tab_ids = $('#tab_list tr').map( function() { return $(this).attr('data-tab_id'); } ).toArray();
      window.location.href = '/' + tabs_controller + '/update_tabs_order/' + object_id + '?tab_ids=' + tab_ids.join(',');
    }
  });

  $("#tab_list").disableSelection();
}

function set_tab(item_id, tabs_controller, checkbox) {
  window.location.href = '/' + tabs_controller + '/set_tab/' + item_id + '?attribute=' + checkbox.value + '&value=' + (checkbox.checked ? 'true' : 'false');
}

function init_draggable_profile_tabs() {
	$("#tab_list").sortable({
		handle : 'td.draggable_handle',
		update : function(event, ui) {
			var tab_ids = $('#tab_list tr').map( function() { return $(this).attr('data-tab_id'); } ).toArray();
			window.location.href = '/profile_tabs/update_tabs_order?tab_ids=' + tab_ids.join(',');
		}
	});

	$("#tab_list").disableSelection();
}

function nospaces(t){
    if(t.value.match(/\s/g)){
        t.value=t.value.replace(/\s/g,'');
    }
}

// return card type based on credit card (paypal pro).
function watch_card_type() {
    $('#credit_card_number').on('change', function () {
        cardtype = detectCardTypePaypalPro($(this).val());
        $('#credit_card_card_type').val(cardtype);
    });
}

function detectCardTypePaypalPro(number) {
	number = $.trim(number);
	var re = {
		visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
		mastercard: /^5[1-5][0-9]{14}$/,
		amex: /^3[47][0-9]{13}$/,
		discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/
	};

	for (var key in re) {
		if (re[key].test(number)) {
			return key
		}
	}
}

function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function numericOnly() {
    $(".numericOnly").bind('keypress', function (e) {
            if (e.keyCode == '9' || e.keyCode == '16') {
                return;
            }
            var code;
            if (e.keyCode) code = e.keyCode;
            else if (e.which) code = e.which;
            if (e.which == 46)
                return true;
            if (code == 8 || code == 46)
                return true;
            if (code < 48 || code > 57)
                return false;
        }
    );
    $(".numericOnly").bind("paste", function (e) {
        e.preventDefault();
    });
    $(".numericOnly").bind('mouseenter', function (e) {
        var val = $(this).val();
        if (val != '0') {
			val = val.replace(/[^0-9.]+/g, "");
            $(this).val(val);
        }
    });
}

// Toggle switch
function toggle_the_switch(element, toggle_elements){
	$(toggle_elements).toggle();
	$(element).parent().siblings('span').toggleClass('selected');
}

/* Stripe plan purchase checkout */

function start_plan_using_stripe(publishable_key, form_id, secure_protocol, controller, current_host, ssl_host, message){
	var form = $('#' + form_id);
	create_token(publishable_key, form, function(token){
		var data = form.find("input[name='utf8'], input[name='authenticity_token'], input#plan, input#max_students, input#billing, input#discount_code, input#stripeToken").serialize();
		return secure_ajax_pay(secure_protocol, controller, 'create_credit_card', 'payment_plan_activated', current_host, ssl_host, message, data);
	});
	// Prevent the form from submitting with the default action
	return false;
}

function change_plan_using_stripe(publishable_key, form_id, secure_protocol, controller, current_host, ssl_host, message) {
	var form = $('#' + form_id);
	create_token(publishable_key, form, function(token){
		var data = form.find("input[name='utf8'], input[name='authenticity_token'], input#plan, input#max_students, input#billing, input#discount_code, input#stripeToken").serialize();
		return secure_ajax_pay(secure_protocol, controller, 'save_credit_card', 'payment_plan_changed', current_host, ssl_host, message, data);
	});
	// Prevent the form from submitting with the default action
	return false;
}

function change_credit_card_stripe(publishable_key, form_id, secure_protocol, controller, current_host, ssl_host, message) {
	var form = $('#' + form_id);
	create_token(publishable_key, form, function(token){
		var data = form.find("input[name='utf8'], input[name='authenticity_token'], input#stripeToken").serialize();
		return secure_ajax_pay(secure_protocol, controller, 'save_change_credit_card', 'credit_card_changed', current_host, ssl_host, message, data);
	});
	// Prevent the form from submitting with the default action
	return false;
}

function pay_over_plan_charges_stripe(publishable_key, form_id, secure_protocol, current_host, ssl_host, message) {
	var form = $('#' + form_id);
	create_token(publishable_key, form, function(token){
		var data = form.find("input[name='utf8'], input[name='authenticity_token'], input#stripeToken").serialize();
		return secure_ajax_pay(secure_protocol, 'matrix_billing', 'submit_pay_over_plan_charges', 'payment_received', current_host, ssl_host, message, data);
	});	
	// Prevent the form from submitting with the default action
	return false;
}

function create_token(publishable_key, form, on_success) {
	// This identifies your website in the createToken call below
	Stripe.setPublishableKey(publishable_key);
	// Disable the submit button to prevent repeated clicks
	form.find('button').prop('disabled', true);
	// validate
	if(validate_stripe_plan_form(form)) {
		Stripe.card.createToken(form, stripeResponseHandler);
	}

	function stripeResponseHandler(status, response) {
		if (response.error) {
			show_stripe_plan_error(form, response.error.message);
		} else {
			// response contains id and card, which contains additional card details
			var token = response.id;
			form.find('button').prop('disabled', false);
			// Insert the token into the form so it gets submitted to the server
			if($('#stripeToken').length > 0)
				$('#stripeToken').val(token);
			else
				form.append($('<input type="hidden" name="stripeToken" id="stripeToken" />').val(token));
			on_success && on_success(token);
		}
	}
}

// validate stripe plan purchase form

function validate_stripe_plan_form(form){
	errors = [];
	country_us = (form.find('#country').val() == 'United States');
	fields = ((country_us) ? (form.find(':input:visible').not('#street_2')) : (form.find(':input:visible').not('#street_2, #state')));
	fields.each(function() {
		if ($(this).val() == '') {
			if (t = $(this).parent('p').find('label').text()) { errors.push(t); }
		}
	});
	errors = $.unique(errors);
	if (errors.length > 0) {
		if (errors.length == 1) {missing = ' is missing.'} else {missing = ' are missing.'}
		show_stripe_plan_error(form, errors.join(', ') + missing);
		return false;
	}
	return true;
}

function show_stripe_plan_error(form, message) {
	var alerts = $('#alerts');
	alerts.html('');
	alerts.html('<div class="alert_block error close_alert" role="alert"><div class="alert_flex"><div class="alert_icon"><i class="error inverted"></i></div><p>' + message + '</p><a href=""><i class="xCrossSmall"></i><span class="textOffScreen">Close alert</span></a></div></div>');
	alerts.show();
	form.find('button').prop('disabled', false);
	$('html, body').animate({scrollTop: 0}, 300);
}

// grading scale changed

function update_max_score(select) {
	if ($('#assignment_max_score').length > 0) {
		var selected_points = $(select.options[select.selectedIndex]).attr('data-points');
		if (selected_points.length > 0) {
			$('.max-info').show();
			$('#assignment_max_score').hide();
			$('#assignment_max_score').val(parseInt(selected_points));
		} else {
			$('.max-info').hide();
			$('#assignment_max_score').show();
		}
	}
}

// comment thread

function grading_save_thread_comment(id, student_id, peer_id, result_id, origin, gradebook) {
  var textarea = $('.grading-thread-comment-textarea #comment');
  var gradebook_check = gradebook || false;

  if (is_mobile_device() && document.body.clientWidth < 768) {
    var editor = $('.grading-thread-comment-textarea textarea');
    var content = editor.val();
  } else {
    var editor = tinyMCE.editors[textarea.attr('id')];
    var content = editor.getContent();
  }

  if (content.trim() == '') {
    $.alert({content: "The comment can't be empty"});
  } else {
    var data = {student_id: student_id, peer_id: peer_id, content: content, origin: origin, gradebook: gradebook_check};

    if (result_id != false) {
      data.result_id = result_id;
      grading_save_comment(id, data, editor);
    } else {
      $.ajax({
        url: '/teacher_assignment/get_result_id/' + id,
        data: {student: student_id},
        async: false,
        success: function (response) {
          if (response.result_id != false) {
            data.result_id = response.result_id;
          }

          grading_save_comment(id, data, editor);
        }
      });
    }
  }
}

function grading_save_comment(id, data, editor) {
  $.ajax({
    type: 'POST',
    url: '/comment_thread/save/' + id,
    data: data,
    async: false,
    success: function(response) {
      if (response.status == 'bad') {
        $.alert({content: response.message});
      } else {
        $('.grading-thread-comment-list').append(response);

        if (is_mobile_device() && document.body.clientWidth < 768) {
          editor.val('');
        } else {
          editor.setContent('');
          editor.isNotDirty = 1;
        }
      }
    }
  });
}

function grading_comment_thread_events(id, gradebook) {
  var active = false;
  var gradebook_check = gradebook || false;

  $('.grading-thread-comment-list').on('click', function(e) {
    var el = $(e.target);
    var comment_wrapper = el.parents('.comment');
    var comment_id = comment_wrapper.data('id');
    var content_wrapper = comment_wrapper.find('.content');
    var content = content_wrapper.html();

    if (el.hasClass('delete')) {
      if (active == true) {
        return false;
      }

      $.confirm({
        content: "Do you really want to delete this comment?",
        confirm: function() {
          var comment_wrapper = el.parents('.comment');
          var comment_id = comment_wrapper.data('id');

          $.post('/comment_thread/delete/' + id, {comment: comment_id}, function(response) {
            if (response.status == 'ok') {
              comment_wrapper.remove();
            } else {
              $.alert({content: response.message});
            }
          });
        }
      });
    }

    if (el.hasClass('edit')) {
      if (active == true) {
        return false;
      }

      $.ajax({
        type: 'POST',
        url: '/comment_thread/edit/' + id,
        data: {comment: comment_id},
        dataType: 'html',
        success: function(html) {
          content_wrapper.html('').html(html + '<div class="update-options alignR"><a href="javascript:void(0)" class="ml10 inline-update">Update</a><a href="javascript:void(0)" class="ml10 inline-cancel">Cancel</a></div>');
          // workaround FF tinymce editor issue
		  if(typeof reinit_tinymce_editor !== 'undefined' && typeof reinit_tinymce_editor === 'function'){
              reinit_tinymce_editor(comment_id);
		  }
        }
      });

      active = true;
    }

    if (el.hasClass('inline-update')) {
      if (is_mobile_device() && document.body.clientWidth < 768) {
        var editor = $('.grading-thread-comment-list #comment-text-' + comment_id);
        content = editor.val();
      } else {
        var editor = tinyMCE.editors[$('#comment-text-' + comment_id).attr('id')];
        content = editor.getContent();
      }

      if (content.trim() == '') {
        $.alert({content: "The comment can't be empty"});
      } else {
        $.post('/comment_thread/update/' + id, {comment: comment_id, content: content, gradebook: gradebook_check}, function(response) {
          if (response.status == 'bad') {
            $.alert({content: response.message});
            comment_thread_get_original(id, comment_id, editor, comment_wrapper, gradebook_check)
          } else {
            editor.remove();
            comment_wrapper.html(response);
          }

          active = false;
        });
      }
    }

    if (el.hasClass('inline-cancel')) {
      if (is_mobile_device() && document.body.clientWidth < 768) {
        var editor = $('.grading-thread-comment-list #comment-text-' + comment_id);
      } else {
        var editor = tinyMCE.editors[$('#comment-text-' + comment_id).attr('id')];
      }

      comment_thread_get_original(id, comment_id, editor, comment_wrapper, gradebook_check);
      active = false;
    }
  });
}

function comment_thread_get_original(id, comment_id, editor, wrapper, gradebook) {
  var gradebook_check = gradebook || false;

  $.ajax({
    type: 'POST',
    url: '/comment_thread/get_original/' + id,
    data: {comment: comment_id, gradebook: gradebook_check},
    dataType: 'html',
    success: function(response) {
      editor.remove();
      wrapper.html(response);
    }
  });
}

/* rubric points ordering*/
function set_rubric_points_ordering(order) {
	ajax_request('/standard_grading_scales/set_rubric_points_ordering?rubric_points_ordering=' + order );
}

/* validate user email fields */
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validate_and_show_error(el) {
	if (($(el).val() != '') && !validateEmail($(el).val())) {
		if ($('label[for=' + el.id + ']').find('i').length == 0) {
			$('label[for=' + el.id + ']').append("<i class='error icnColor floatR mr0' id='"+ el.id +"_tippy' title='Please enter a valid email'></i>");
			$(el).attr('aria-invalid', 'true');
			tippy('#' + el.id + '_tippy', {
				arrow: true,
				theme: 'error',
				maxWidth: '200px',
				placement: (is_rtl_mode() ? 'top-start' : 'top-end')
			});
		}
	} else {
		$('label[for=' + el.id + ']').find('i').remove();
		$(el).removeAttr('aria-invalid');
	}
}

$(document).ready(function() {
	$(document).on('keyup', '#user_email', function() {
		validate_and_show_error(this);
	});

	$(document).on('keyup', '#user_email_confirmation', function() {
		validate_and_show_error(this);
	});

	$(document).on('keyup', '#user_sms_email', function() {
		validate_and_show_error(this);
	});
});

// Disable submit button until all required fields are filled.

function validate_user_signup_form(fields, form_id, submit_btn) {
	submit_btn.attr('disabled', 'disabled');

	var email_fields = ['email','email_confirmation','sms_email'];
  var inputs = $('#' + form_id + ' :input:visible');

  if( inputs.filter('#user_other_state').length )
  	$.each( fields, function(i, e) { if( e == 'state' ) fields[i] = 'other_state'; } );

	$('form#'+ form_id).find('[id^=user_],input[name="terms[]"]').bind("change keyup", function() {

		var empty = false;

		$.each( fields, function( i, v ) {
			if (inputs.filter('#user_' + v).length && inputs.filter('#user_' + v).val() == '') {
				empty = true;
			}
			// confirmation fields
			if ((inputs.filter('#user_' + v + '_confirmation').length > 0) && (inputs.filter('#user_' + v + '_confirmation').val() == '')) {
				empty = true;
			}
			// date fields
			if ((inputs.filter('#user_' + v + '_1i').length > 0) && ((inputs.filter('#user_' + v + '_1i').val() == '') || (inputs.filter('#user_' + v + '_2i').val() == '') || (inputs.filter('#user_' + v + '_3i').val() == ''))) {
				empty = true;
			}
		}); // fields - each

		$.each( email_fields, function( i, v ) {
			if ((inputs.filter('#user_' + v).length > 0) && (inputs.filter('#user_' + v).val() != '') && !validateEmail(inputs.filter('#user_' + v).val())) {
				empty = true;
			}
		}); // email_fields - each

		var checked_terms = $('input[name="terms[]"]:checked').length;
		var total_terms = $('input[name="terms[]"]').length;

		if( !empty && ((total_terms == 0) || (checked_terms == total_terms)) )
			submit_btn.removeAttr('disabled');
		else
			submit_btn.attr('disabled', 'disabled');
	}); // keyup
}

/* message form */

function show_extra_field_in_message_form(elem, target_input_area) {
	$('.' + target_input_area).show();
	if ($(elem).siblings('a').length == 0) {
		$('.senders-placeholder').css('width', 'calc(100% - 207px)');
	}
	$(elem).remove();
	return false;
}
function start_message_sortable() {
	$(".drag-link ul").sortable({
		connectWith: ".drag-link ul",
		zIndex: 9999,
		update: function (event, ui) {
			var $elem = ui.item;
			var parent = $elem.closest('ul');
			parent.find('.select2-search-field').appendTo(parent);
		},
		start: function (event, ui) {
			var input = ui.item.closest('p').find('> input');
			var id = ui.item.data().select2Data.id;
			input.val(input.val().replace((',' + id), '').replace(id, ''));
			input.val().charAt(0) == "," && input.val(input.val().substring(1));
			ui.item.closest('ul').addClass('allow-overflow');
		},
		stop: function (event, ui) {
			var $elem = ui.item;
			var parent = $elem.closest('ul');
			var id = $elem.data().select2Data.id;
			var input = parent.closest('p').find('> input');
			input.val((input.val() == "" ? id : (input.val() + ',' + id)));
			$(".drag-link ul").removeClass('allow-overflow');
		}
	}).disableSelection();
}
function add_sender_placeholder(){
  if (select2_data.length <= 5) {
    return false;
  }

  var input = $('#s2id_to');
  var placeholder = $('<div class="senders-placeholder active"><span class="more">more</span></div>').insertBefore( input );
  var more_users = select2_data_size;
  var width_alotted = placeholder.width() - 200;
  var width_accumulated = 0;
  for (i=0; i < select2_data.length; i++) {
    var temp = $('<span>' + select2_data[i].text + '</span>').insertBefore(placeholder.find('.more'));
    width_accumulated += temp.width();
    if (width_accumulated > width_alotted && placeholder.find('> *').length > 2) {
      temp.remove();
      break;
    }
    more_users -= 1;
  }
	placeholder.find('.more').text(more_users + ' more');
  placeholder.on('click', function(e){
    if (select2_data.length == select2_data_size) {
      e.preventDefault();
      e.stopPropagation();
      placeholder.closest('form').one('click', function(e){
        add_sender_placeholder();
        e.preventDefault();
        e.stopPropagation();
      });
      placeholder.remove();
  } else {
    $.alert({content: "You can edit this field only if selected users are upto 50."});
  }
  });
  if (more_users == 0) {
    placeholder.remove();
  }
}

/* widgets */

function widget_show_hide(el) {
	$.post($(el).attr('href'), function(response) {
		location.reload();
	});
}

function confirmation_first(el, message) {
  $.confirm({
    content: message,
    confirm: function(){
      window.location.href = $(el).attr('href');
    }
  });
}

/* Wallet: toggle show/hide coupon code */

function set_hide_details(user_id, wallet_entry_id, checkbox) {
	ajax_request('/wallet/set_hide_details/' + user_id + '?wallet_entry_id=' + wallet_entry_id + '&value=' + (checkbox.checked ? 'true' : 'false'));
}

/* show message popup */

function toogle_extra_users_list(id1, id2) {
	$('#' + id1).hide();
	$('#' + id2).show();
}

/* tags select2 */

function init_tags_select(id, tags, suggest_url) {
  $('input#' + id).select2({
    multiple : true,
    allowClear: true,
    maximumSelectionSize : 40, // for limitation of people number in the "to" fields
    minimumInputLength : 2, // minimum chars to start the suggest query
    initSelection : function (element, callback) {
      var data = [];
      $.each(tags, function (i, v) {
        data.push({id: v, text: v});
      });
      callback(data);
    },
    ajax : {
      type : "GET",
      url : suggest_url,
      dataType : 'json',
      quietMillis : 500, // bigger delay before ajax is called
      data : function(term) {
        return {
          tag : term
        };
      },
      results : function(data) {
        var results = {
          results : []
        };

        $.each(data, function() {
          results.results.push({
            id : this.id,
            text : this.value
          });
        });

        return results;
      }
    }
  });
}

/* parse and create a variable object */
function getUrlVars(from) {
  var vars = {}, hash;
  var hashes = from.slice(from.indexOf('?') + 1).split('&');

  for(var i = 0; i < hashes.length; i++)
  {
    hash = hashes[i].split('=');
    vars[hash[0]] = hash[1];
  }

  return vars;
}

// check file processing job status

var only_one_file_check = true;

function check_document_processing_status(id) {
  if (only_one_file_check == false) {
    return false;
  }

  only_one_file_check = false;

  setInterval(function() {
    $.get('/file_processing/check_status/' + id, function(response) {
      if (response.status == 'reload') {
        location.reload();
      }
    });
  }, 3000);
}

// kaltura

function kaltura_resource_create(url, title) {
  var parent_form = window.parent.$("form#kaltura_uploader_form");

  parent_form.append('<input type="hidden" name="attachment_url" id="attachment_url" value="' + url + '">');
  parent_form.append('<input type="hidden" name="attachment_name" id="attachment_name" value="' + title + '">');

  parent_form.submit();
}

function kaltura_attachment_create(url, title) {
  var parent_wrapper = window.parent.$("div#kaltura_uploader_form");
  var main_wrapper = parent_wrapper.find("#kaltura_wrapper").val();
  var objects = {};

  if ((main_wrapper == "post_filecontainer") || (main_wrapper == "announcement_filecontainer")) {
    objects[title] = url;
    window.parent.append_multiple_files(objects);
    window.parent.$.facebox.close();
  }
}

/* change message fields */

function toggleMessageFields(el) {
  changeLinksText(el);
  changeInputsLabelAndId(el);
}

var inputMap = {
  'to': ['Cc', 'Bcc'],
  'cc': ['To', 'Bcc'],
  'bcc': ['To', 'Cc']
};

function changeLinksText(el){
  $('#cc_link').text(inputMap[el.value][0]);
  $('#bcc_link').text(inputMap[el.value][1]);
}

function changeInputsLabelAndId(el){
  $('.cc_label').text(inputMap[el.value][0] + ':');
  $('.bcc_label').text(inputMap[el.value][1] + ':');
  changeFieldsSequence(el.value);
}

function changeFieldsSequence(element){
  for (var i = 0; i <= 2; i++) {
    $('.message-fields.select2-offscreen')[i]['id'] = fieldsList(element)[i];
  }
}

function fieldsList(element) {
  var inputMap = {
    'to': ['to', 'cc', 'bcc'],
    'cc': ['cc', 'to', 'bcc'],
    'bcc': ['bcc', 'to', 'cc']
  };
  return inputMap[element]
}

// app center search

function app_center_search() {
  var storage = [];

  $('.catalog_boxes > div').each(function(i) {
    $(this).data('initial-index', i);
  });

  $("#app_center_search").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    var to_remove = [];

    $(".catalog_boxes > div").filter(function() {
      if ($(this).text().toLowerCase().indexOf(value) < 0) {
        storage.push($(this));
        $(this).detach();
      }
    });

    $.each(storage, function(i, v) {
      if ($(v).text().toLowerCase().indexOf(value) > -1) {
        to_remove.push(i);
        $('.catalog_boxes').append(v);
      }
    });

    $.each(to_remove, function(i,v) {
      storage.splice(v, 1);
    });

    $('.catalog_boxes > div').sort(function(a, b) {
      return $(a).data('initial-index') - $(b).data('initial-index');
    }).appendTo('.catalog_boxes');
  });
}

// required video completion

var video_completion_init = false;

function required_video_completion_postmessage() {
	if (!video_completion_init) {
		video_completion_init = true;
		window.addEventListener("message", function(event) {
			if(/show_video_progress/.test(event.data)){
				var data = JSON.parse(event.data);
				update_video_progress(data.show_video_progress, data.progress, data.duration);
			}
		});
	}
}

function update_video_progress(resource_id, progress, duration) {
	var progress_element = $("#video_status_" + resource_id.toString());

	if ((progress !== -1) && (duration !== -1)) {
		if (!progress_element.data("video-finished")) {
			$("#not_started_" + resource_id.toString()).hide();
			$("#playing_" + resource_id.toString()).hide();
			$("#finished" + resource_id.toString()).hide();
			$("#started_" + resource_id.toString()).show();
		}

		if (progress > progress_element.data("max-video-progress")) {
			progress_element.data("max-video-progress", progress);
			progress_element.attr("data-max-video-progress", progress);
			progress_element.data("video-progress", progress);
			progress_element.attr("data-video-progress", progress);

			$.ajax({
				url: '/student_lesson/update_video_history?id=' + class_id_for_video_completion + '&lesson_id=' + lesson_id_for_video_completion + '&section_id=' + section_id_for_video_completion + '&resource_id=' + resource_id.toString() + '&progress=' + progress.toString() + '&duration=' + duration.toString(),
				type: 'POST',
				xhrFields: {
					withCredentials: true
				},
				success: function (response) {
					if (response.error == null) {
						if (response.data.finished) {
							$("#not_started_" + resource_id.toString()).hide();
							$("#playing_" + resource_id.toString()).hide();
							$("#started_" + resource_id.toString()).hide();
							$("#finished" + resource_id.toString()).show();

							progress_element.data("video-finished", true);
							progress_element.attr("data-video-finished", true);

							// this expression detects if all videos have been finished
							if ($("div[id^='video_status_'][data-video-finished='false']").size() === 0) {
								// enable dynamic buttons
								$.each($('[id="dynamic_button"]'), function (key, button) {
									var next_url = $(button).data('next_url');
									var next_text = $(button).data('next_text');
									$(button).removeClass('locked').attr('href', next_url);
									$(button).text(next_text);
									$(button).find('i').replaceWith('<img src="/images/icons/large-arrow-white.svg" alt="" />');
								});
							}
						}
					}
				}
			});
		}
	}

	$("#video_status_" + resource_id).show();
}

// Google Fonts

var google_fonts_data;
var google_fonts_data_initial;
var google_fonts_offset = 0;
var google_fonts_limit = 50;
var google_fonts_loading;
var google_fonts_scroll_pause = false;
var google_fonts_scroll_stop = false;
var google_fonts_selected = [];

function get_google_fonts() {
  google_fonts_offset = 0;
  google_fonts_limit = 50;
  google_fonts_scroll_pause = false;
  google_fonts_scroll_stop = false;

  $.each(google_fonts_selected, function(i, v) {
    $('#google_fonts_form').append('<input type="hidden" name="google_font[]" value="' + v + '" >');
  });

  $('.google_fonts_top input').on("keyup", delay(function() {
    var term = $(this).val();

    if (term.length > 1) {
      google_fonts_data = google_font_search(term);
    } else {
      google_fonts_data = google_fonts_data_initial;
    }

    google_fonts_scroll_pause = false;
    google_fonts_scroll_stop = false;
    google_fonts_offset = 0;
    list_google_fonts();
  }));

  function delay(fn) {
    var timer = 0;
    return function() {
	  $('.fonts_holder').html(google_fonts_loading);
      clearTimeout(timer);
      timer = setTimeout(fn.bind(this, arguments), 700 || 0);
    }
  }

  $.get('/google_fonts/list', function(json) {
    google_fonts_data = json.items;
    google_fonts_data_initial = json.items;
    google_fonts_loading = $('.fonts_holder').find('.fonts_loading');

    list_google_fonts();

    $("#facebox .facebox-content").scroll(function() {
      if (!google_fonts_scroll_pause) {
        if ($(this).scrollTop() >= ($(this)[0].scrollHeight - $(this).height() - 50)) {
          console.log('bottom');

          google_fonts_scroll_pause = true;

          if (!google_fonts_scroll_stop) {
            list_google_fonts();
          }
        }
      }
    });
  });
}

function list_google_fonts() {
  var fonts = [];
  var embed_link = "https://fonts.googleapis.com/css2?";

  if (google_fonts_data.length == 0) {
    $('.fonts_holder').find('.fonts_loading').remove();
    $('.fonts_holder').append("<li><span class='no-results'>No fonts found</span></li>");
    return false;
  }

  if (google_fonts_offset < google_fonts_data.length) {
    for (var i = google_fonts_offset; i < (google_fonts_offset + google_fonts_limit); i++) {
      if (google_fonts_data[i]) {
        google_fonts_data[i].index = i;

        fonts.push(google_fonts_data[i]);

        if (i == google_fonts_offset) {
          embed_link = embed_link + "family=" + google_fonts_data[i].family;
        } else {
          embed_link = embed_link + "&family=" + google_fonts_data[i].family;
        }
      }
    }

    $('.fonts_holder').append("<link href=\"" + embed_link + "\" rel=\"stylesheet\">");

    setTimeout(function() {
      $('.fonts_holder').find('.fonts_loading').remove();

      $.each(fonts, function(i,font) {
        $('.fonts_holder').append("<li>" +
          "<input id=\"google_font_" + font.index + "\" name=\"google_font_" + font.index + "\" type=\"checkbox\" value=\"" + font.family + "\"" + ((google_fonts_selected && google_fonts_selected.includes(font.family)) ? ' checked' : '') + " onchange=\"check_google_font(this)\">" +
          "<label for=\"google_font_" + font.index + "\"><span>Font family: <b>" + font.family + "</b>, category: <b>" + font.category + "</b></span><span style=\"font-family: '" + font.family + "', " + font.category + ";\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In pellentesque orci ex, eget pellentesque ex efficitur eu.</label>" +
          "</li>");
      });

      google_fonts_offset = google_fonts_offset + fonts.length;
      google_fonts_scroll_pause = false;

      if (google_fonts_offset < google_fonts_data.length) {
        $('.fonts_holder').append(google_fonts_loading);
      }
    }, 1000);
  }

  if (google_fonts_offset >= google_fonts_data.length) {
    google_fonts_scroll_stop = true;
    $('.fonts_holder').find('.fonts_loading').remove();
  }
}

function check_google_font(el) {
  var $this = $(el);

  if ($this.is(':checked')) {
    google_fonts_selected.push($this.val());
    $('#google_fonts_form').append('<input type="hidden" name="google_font[]" value="' + $this.val() + '" >');
  } else {
    var index = google_fonts_selected.indexOf($this.val());

    if (index > -1) {
      google_fonts_selected.splice(index, 1);
      $('#google_fonts_form input:hidden').filter(function(){return this.value == $this.val()}).remove();
    }
  }
}

function google_font_search(term) {
  return $.grep(google_fonts_data_initial, function(font, index) {
    return (font.family.toLowerCase().includes(term.toLowerCase()));
  });
}
