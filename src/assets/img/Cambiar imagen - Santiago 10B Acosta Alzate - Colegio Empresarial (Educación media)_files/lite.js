// ready
var on_ready_functions = [];
var run_on_ready_functions = false;

// test mode
var test_mode = false;

// flowplayer debug mode
var flowplayer_debug_mode = false;

// highcharts mode
var highcharts_mode = false;

// new editor
var new_editor = false;

// visitor mode
var visitor_mode = false;

// portal mode
var portal_mode = false;

// rtl mode
var rtl_mode = false;

// mobile app mode
var mobile_app_mode = false;

//mobile app login messages
var sent_mobile_login_messages = false;

// video recording
var video_recording_mode = false;
var video_test_mode = false;

// audio recording
var audio_recording_mode = false;

// grey page background
var grey_page_mode = false;

// translations
var no_messages_text;
var no_notifications_text;
var chat_request_text;
var accept_text;
var ignore_text;
var you_have_selected_all_text;
var select_all_items_text;
var all_items_selected_text;
var clear_selection_text;
var are_you_sure_text;
var chat_request_canceled_text;
var no_events_this_month_text;
var no_events_this_week_text;
var access_code_text;
var email_address_text;
var sticky_question_text;
var file_text;
var save_text;
var cancel_text;
var comment_text;
var send_text;
var send_message_text;
var send_to_text;
var students_text;
var teachers_text;
var managers_text;
var parents_text;
var administrators_text;
var close_text;
var picker_empty_text;
var picker_limit_text;
var select_all_text;
var deselect_all_text;
var mark_as_read_text;
var mark_as_unread_text;
var expand_all_text;
var contract_all_text;
var alert_box_title;
var confirmation_box_title;

var help_for_page;

// mobile
var stylesheet_mobile;
var portal_stylesheet_url;
var mobile_menu_highlight_override;

function set_mobile_vars(stylesheet, menu_highlight) {
    stylesheet_mobile = stylesheet.replace('href="/', 'href="' + window.location.protocol + '//' + window.location.host + '/');
    portal_stylesheet_url = stylesheet_mobile.replace('" media="screen" rel="stylesheet" title="theme" type="text/css" />', '').replace('<link href="', '');
    mobile_menu_highlight_override = menu_highlight;
}

function is_mobile_device() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// functions

function on_ready(the_function) {
    if (run_on_ready_functions) {
        the_function();
    } else {
        on_ready_functions.push(the_function);
    }
}

function run_on_ready() {
    run_on_ready_functions = true;

    for (var i = 0; i < on_ready_functions.length; i++) {
        on_ready_functions[i]();
    }
}

// tables

function add_table_data(name, data) {
    on_ready(function () {
        $('#' + name).data('table', data);
    });
}

function add_option_bar(name) {
    on_ready(function () {
        init_options_bar(name);
    });
}

// focus

function set_focus(name) {
    on_ready(function () {
        focus_element(name);
    });
}

// signup

var signup_shown = false;

function set_signup(url) {
    on_ready(function () {
        if (!signup_shown) {
            $.facebox({'ajax': url}, 'hide_close');
            signup_shown = true;
        }
    });
}

// welcome

var welcome_shown = false;

function set_welcome(url) {
    on_ready(function () {
        if (!welcome_shown) {
            $.facebox({'ajax': url}, 'hide_close');
            welcome_shown = true;
        }
    });
}

// policy documents
var policy_popover = {
    init: function () {
        var body = $(document.body);
        this.get(body);
    },

    init_events: function (popover) {
        var form = popover.find('form');
        form.submit(function (e) {
            e.preventDefault();
            $.ajax({
                url: form.attr('action'),
                type: 'post',
                data: form.serialize()
            });
            policy_popover.remove_popover(popover);
        });
    },

    init_block_mode: function (popover_stack) {
        popover_stack.addClass('with-blocker');
        $('<div class="blocker"></div>').insertAfter(popover_stack);
    },

    get: function (body) {
        $.get('/accept_policy_documents?from=' + encodeURIComponent(window.location.href.toString()), function (html) {
            policy_popover.add_popovers(body, html).find('.popover').each(function () {
                policy_popover.init_events($(this));
                policy_popover.popover_calc($(this));
            });
        });
    },

    update_popovers: function (popover) {
        popover.parent().find('.popover').each(function () {
            policy_popover.popover_calc($(this));
        });
    },

    popover_calc: function (popover) {
        var multiplier = popover.nextAll().length * 50;
        popover.css('transform', 'translate3d(0px, -' + multiplier + 'px, -' + multiplier + 'px)');
    },

    add_popovers: function (container, content) {
        content = $(content).appendTo(container);
        container.find('header .username').length && this.init_block_mode(content);
        return content;
    },

    remove_popover: function (popover) {
        popover.addClass('popover-closing');
        var new_popover = popover.prev();
        setTimeout(function () {
            if (popover.parent().find('.popover').length < 2) {
                var container = popover.closest('.popover-stack');
                container.next('.blocker');
                container.remove();
            } else
                popover.remove();
            policy_popover.update_popovers(new_popover);
        }, 300);
    }
};

function accept_policy_documents() {
    on_ready(function () {
        policy_popover.init();
    });
}

// toggles

function add_checked_toggle(id) {
    on_ready(function () {
        checked_toggle(id);
    });
}

// translations

function set_translations(options) {
    no_messages_text = options.no_messages_text;
    no_notifications_text = options.no_notifications_text;
    chat_request_text = options.chat_request_text;
    accept_text = options.accept_text;
    ignore_text = options.ignore_text;
    you_have_selected_all_text = options.you_have_selected_all_text;
    select_all_items_text = options.select_all_items_text;
    all_items_selected_text = options.all_items_selected_text;
    clear_selection_text = options.clear_selection_text;
    are_you_sure_text = options.are_you_sure_text;
    chat_request_canceled_text = options.chat_request_canceled_text;
    no_events_this_month_text = options.no_events_this_month_text;
    no_events_this_week_text = options.no_events_this_week_text;
    access_code_text = options.access_code_text;
    email_address_text = options.email_address_text;
    sticky_question_text = options.sticky_question_text;
    file_text = options.file_text;
    save_text = options.save_text;
    cancel_text = options.cancel_text;
    comment_text = options.comment_text;
    send_text = options.send_text;
    send_message_text = options.send_message_text;
    send_to_text = options.send_to_text;
    students_text = options.students_text;
    teachers_text = options.teachers_text;
    managers_text = options.managers_text;
    parents_text = options.parents_text;
    administrators_text = options.administrators_text;
    close_text = options.close_text;
    picker_empty_text = options.picker_empty_text;
    picker_limit_text = options.picker_limit_text;
    alert_box_title = options.alert_box_title;
    confirmation_box_title = options.confirmation_box_title;
    select_all_text = options.select_all_text;
    deselect_all_text = options.deselect_all_text;
    mark_as_read_text = options.mark_as_read_text;
    mark_as_unread_text = options.mark_as_unread_text;
    processing = options.processing;
    do_not_press_refresh_or_back_button = options.do_not_press_refresh_or_back_button;
    this_might_take_a_while_to_complete = options.this_might_take_a_while_to_complete;
    expand_all_text = options.expand_all;
    contract_all_text = options.contract_all;
}

// test mode

function set_test_mode() {
    test_mode = true;
}

function is_test_mode() {
    return test_mode;
}

// new editor

function set_new_editor() {
    new_editor = true;
}

function is_new_editor() {
    return new_editor;
}

// test mode

function set_video_recording_mode() {
    video_recording_mode = true;
}

function is_video_recording_mode() {
    return video_recording_mode;
}

function set_video_test_mode() {
    video_test_mode = true;
}

function is_video_test_mode() {
    return video_test_mode;
}

function set_audio_recording_mode() {
    audio_recording_mode = true;
}

function is_audio_recording_mode() {
    return audio_recording_mode;
}

function set_grey_page_mode() {
    grey_page_mode = true;
}

function is_grey_page_mode() {
    return grey_page_mode;
}

function is_webm_supported() {
    var testEl = document.createElement("video"), mpeg4, h264, ogg, webm;

    if (testEl.canPlayType && testEl.canPlayType('video/webm; codecs="vp8, vorbis"')) {
        return true;
    }

    return false;
}

// flowplayer debug mode

function set_flowplayer_debug_mode() {
    flowplayer_debug_mode = true;
}

function is_flowplayer_debug_mode() {
    return flowplayer_debug_mode;
}

// visitor mode

function set_visitor_mode() {
    visitor_mode = true;
}

function is_visitor_mode() {
    return visitor_mode;
}

// portal mode

function set_portal_mode() {
    portal_mode = true;
}

function is_portal_mode() {
    return portal_mode;
}

// rtl mode

function set_rtl_mode() {
    rtl_mode = true;
}

function is_rtl_mode() {
    return rtl_mode;
}

// mobile mode

function set_mobile_app_mode() {
    mobile_app_mode = true;
}

//Most of the natitve app specific JS is only for iOS
function is_mobile_app_mode() {
    if (/iPhone|iPad/i.test(navigator.userAgent) && location.href.indexOf('stage_one') < 0) {
        return mobile_app_mode;
    } else {
        return false;
    }
}

//Using this in the few cases where we need natitve app specific JS for both iOS and Android
function is_mobile_app_mode_raw() {
    return mobile_app_mode;
}

function is_windows_app_mode() {
    return mobile_app_mode && /Windows/i.test(navigator.userAgent)
}

// help for this page

function set_help_for_page(string) {
    help_for_page = string;
}

function get_help_for_page() {
    if (typeof help_for_page != 'undefined') {
        return help_for_page;
    } else {
        return false;
    }
}

function update_left_nav_storage(content) {
    if (is_mobile_app_mode() || Modernizr.localstorage) {
        localStorage.setItem("left_nav_content", content);
    }
}

function update_mobile_nav_storage(content) {
    if (is_mobile_app_mode() || Modernizr.localstorage) {
        localStorage.setItem("mobile_nav_content", content);
    }
}

function tile_click(element_id) {
    window.location = document.getElementById(element_id).querySelector('.header a').href;
}

function row_click(element_id) {
    window.location = document.getElementById(element_id).querySelector('a.modern_module_overview').href;
}

function scorm_init_message_api() {
    window.addEventListener("message", function (event) {
        if (/openExternal/.test(event.data))
            if (window.is_new_app) {
                var data = JSON.parse(event.data);
                window.open(data['url'], true);
            }
        if (/window_height/.test(event.data)) {
            var data = JSON.parse(event.data);

            if (typeof data.window_height != 'undefined' && document.getElementsByClassName('has_preview_image').length > 0) {
                document.getElementsByClassName('has_preview_image')[0].height = data.window_height;
                document.getElementsByClassName('has_preview_image')[0].style.height = data.window_height + 'px';
            }
        }
        if (event.data == 'activate_next_button') {
            var $next_button = $('#dynamic_button');

            if ($next_button.length > 0) {
                var next_url = $next_button.data('next_url');
                $next_button.removeClass('locked').attr('href', next_url);
                $next_button.find('i').replaceWith('<img src="/images/icons/large-arrow-white.svg" alt="" />');
            }
        }
    });
}

function scorm_cookie_redirect(cloudfront_cookie_url) {
    if (!mobile_app_mode && !document.cookie.match(/^(.*;)?\s*fixed\s*=\s*[^;]+(.*)?$/)) {
        document.cookie = 'fixed=fixed; expires=Tue, 19 Jan 2038 03:14:07 UTC; path=/';
        window.location.replace(cloudfront_cookie_url);
    }
}