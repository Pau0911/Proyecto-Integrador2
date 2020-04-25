/* Author: Cypher Learning
 Index:
 1. Main Nav Form
 2. RelatedLinks - Active link
 3. Init Modals
 4. Alert Boxes
 5. Fix title wrapping in mobile view, we are also calling this in the mobile app
 6. Select Rubric Radio Button
 7. Dropdowns
 8. Toggle Hidden Content
 9. Add a label after each checkbox / radio button if none and label the ones in the first column of tables
 10. Lesson Nav Show/Hide
 11. iPad Keyboard and Fixed Position Header Fix
 12. Scroll animation
 13. FIx for options in the right on Chrome
 14. Auto-scroll to hide the address bar on iphone safari iOS < 7
 15. Toggle game status detail tables
 16. Mobile Functions
 17. Left Nav Flyouts
 18. Init mobile menu
 // On ready
 19.
 20. Disable fixed position for header and section toolbar on zoom - mobile devices
 21. Resize functions
 22. Add iframe to z-index elements in IE
 23. Load SVG icon sprite
 24. make wider images responsive
 25. add focus trap to facebox
 26. Stop flowplayer when closing facebox
 27. Responsive tables
 28. Show/hide section end links in a lesson
 29. Check portal header scroll
 */

// This is called at 6.
// But we also need to call this in the mobile app.
function dropdownClickEvents() {
    // inbox dropdown
    $('.messagesHolder > a').off('click').on('click', function (e) {
        toggledDownShow(e, this);

        if ($('.messagesHolder > .dropDown').css('left') === '0px') {
            if ($('html').attr('dir') == 'RTL') {
                var left = $('#wrapper').offset().left - $('.messagesHolder > .dropDown').offset().left;
                $('.messagesHolder > .dropDown').css('left', left + 'px');
            } else {
                if (is_mobile_app_mode()) {
                    var left = Math.abs((is_mobile_app_mode() ? globalWindowWidth : $(window).width()) - ($('.messagesHolder > .dropDown').offset().left + $('.messagesHolder > .dropDown').width()));
                } else {
                    var left = Math.abs(($('#wrapper').offset().left + $('#wrapper').width()) - ($('.messagesHolder > .dropDown').offset().left + $('.messagesHolder > .dropDown').width()));
                }
                $('.messagesHolder > .dropDown').css('left', '-' + left + 'px');
            }
        }

        hideDropdown(e, '.linksHolder .dropDown');
        hideDropdown(e, '.searchHolder .dropDown');
        hideDropdown(e, '.notificationsDropDown');
        call_for_messages('.messagesHolder', 'inbox');
        notification_system_status(this);
    });

    $('.notificationsHolder > a').off('click').on('click', function (e) {
        toggledDownShow(e, this);

        if ($('.notificationsHolder > .dropDown').css('left') === '0px') {
            if ($('html').attr('dir') == 'RTL') {
                var left = $('#wrapper').offset().left - $('.notificationsHolder > .dropDown').offset().left;
                $('.notificationsHolder > .dropDown').css('left', left + 'px');
            } else {
                if (is_mobile_app_mode()) {
                    var left = Math.abs((is_mobile_app_mode() ? globalWindowWidth : $(window).width()) - ($('.notificationsHolder > .dropDown').offset().left + $('.notificationsHolder > .dropDown').width()));
                } else {
                    var left = Math.abs(($('#wrapper').offset().left + $('#wrapper').width()) - ($('.notificationsHolder > .dropDown').offset().left + $('.notificationsHolder > .dropDown').width()));
                }
                $('.notificationsHolder > .dropDown').css('left', '-' + left + 'px');
            }
        }

        hideDropdown(e, '.linksHolder .dropDown');
        hideDropdown(e, '.searchHolder .dropDown');
        hideDropdown(e, '.messagesDropDown');
        call_for_messages('.notificationsHolder', 'notifications');
        notification_system_status(this);
    });

    $('.searchHolder > a').off('click').on('click', function (e) {
        toggledDownShow(e, this);
        $('.searchHolder input[type="text"]').focus();
        hideDropdown(e, '.messagesHolder .dropDown');
        hideDropdown(e, '.notificationsHolder .dropDown');
        hideDropdown(e, '.linksHolder .dropDown');
    });

    $('.linksHolder > a').off('click').on('click', function (e) {
        toggledDownShow(e, this);
        hideDropdown(e, '.messagesHolder .dropDown');
        hideDropdown(e, '.notificationsHolder .dropDown');
        hideDropdown(e, '.searchHolder .dropDown');
    });

    $('nav#leftColumn .dropDownHolder > a').off('click').on('click', function (e) {
        hideSiblingDropdowns($(this).parent().siblings('li.dropDownHolder'));
        toggledDownShow(e, this);
    });

    $('#Table .dropDownHolder > a').off('click').on('click', function (e) {
        hideSiblingDropdowns($(this).closest('tr').siblings());
        hideDropdown(e, '#TableA .dropDown');
        hideDropdown(e, '#TableB .dropDown');
        toggledDownShow(e, this);
    });

    $('body').on('click', 'table .tableDropdown > a', function (e) {
        hideSiblingDropdowns($(this).closest('tr').siblings());
        toggledDownShow(e, this);

        $(this).parent().css('z-index', '5');
        // Change the z-index of the next 2 dropdown holders so that the don't show on top of the current dropdown
        $(this).closest('tr').next().find('.tableDropdown').css('z-index', '4');
        $(this).closest('tr').next().next().find('.tableDropdown').css('z-index', '4');

        // If the space between the dropdown and the footer is < the dropdown's height then open it upwards instead of downwards
        if (($('footer').offset().top - $(this).siblings('.dropDown').offset().top) < $(this).siblings('.dropDown').outerHeight()) {
            $(this).siblings('.dropDown').css({
                'top': 'auto', 'bottom': '21px'
            });
        }
    });

    $('.optionsRibbon .dropDownHolder > a').off('click').on('click', function (e) {
        toggledDownShow(e, this);
    });

    $('.calendar-item .dropDownHolder > a').off('click').on('click', function (e) {
        hideSiblingDropdowns($(this).closest('.calendar-item').siblings());
        toggledDownShow(e, this);
    });

    function toggledDownShow(e, target) {
        e.preventDefault();
        e.stopPropagation();
        $(target).siblings('.dropDown').toggleClass('dDownShow');
        $(target).toggleClass('highlight');
        if (is_mobile_app_mode()) {
            if ($(target).siblings('.dropDown').hasClass('dDownShow')) {
                $(target).siblings('.dropDown').show();
            } else {
                $(target).siblings('.dropDown').hide();
            }
        }
    }

    $('body, #wrapper').on('click', function (e) { /* change 'document' to 'body' for wide screen clicks on white space and '#wrapper' for iPad */
        if ($('#facebox').has(e.target).length == 0) {
            // Triggers when pressing Enter too so exclude leftColumn so that it doesn't interfere with the flyouts
            hideDropdown(e, 'header .dropDown');
            hideDropdown(e, '#centreColumn .dropDown');
        }
    });

    // Used when in .quicklinks, table dropdowns, tabnav dropdowns to trigger the function above
    $('.dropDownHolder .dropDown > a:first-child').bind('keydown', function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode == 9 && e.shiftKey) { // tabbed backwards
            $("body").click();
        }
    });
    $('.dropDownHolder .dropDown > a:last-child').bind('keydown', function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode == 9 && !e.shiftKey) { // tabbed forwards
            $("body").click();
        }
    });

    // Skip to content links
    $('.skipToContent').on('click', function (e) {
        if ($('body').hasClass('portal')) {
            // Add class for the focus so that focus on shows when using this quick link
            $('.portal #contentWrap').addClass('focus')
        }
        $("html, body").animate({scrollTop: 0}, 10, 'easeOutExpo');
    });
    /* prevent focus highlight on mousedown in the portal, remove special class */
    $('.portal #contentWrap').mousedown(function (e) {
        if (!$(e.target).is("skipToContent")) {
            $(this).removeClass('focus');
        }
    });

    // Same as click function above, but just for Esc key presses in header and #centreColumn
    $(document).keydown(function (e) {
        if (e.keyCode == 27) {
            // Close dropDown if controlling link has focus
            $('header a.highlight:focus, #centreColumn a.highlight:focus').removeClass('highlight').siblings('.dropDown').removeClass('dDownShow');
            // Close dropDown & reset focus if an element inside the dropDown has focus
            $('header .dropDown :focus, #centreColumn .dropDown :focus').closest('.dropDown').removeClass('dDownShow').siblings('a').removeClass('highlight').focus();
            // Close special remark dropDown
            $('.special_values_dropdown > .dropDown').removeClass('dDownShow');
            $('.special_values_dropdown').siblings('table').find('.highlighted').removeClass('highlighted');
        }
    });

    function hideSiblingDropdowns(dropdownHolder) {
        $(dropdownHolder).find('.dropDown').removeClass('dDownShow');
        $(dropdownHolder).find('a').removeClass('highlight');
    }

    function hideDropdown(e, dropdownHolder) {
        /* Hides dropdowns when clicking outside them */
        if ($(dropdownHolder).has(e.target).length == 0) {
            $(dropdownHolder).removeClass('dDownShow');
            $(dropdownHolder).siblings('a').removeClass('highlight');
        }
    }
}

// This is called at 10.
// But we also need to call this in the mobile app.
function lessonNavEvents() {
    var navMoving = false;
    var leftWhileAnimating = false;
    var navHeight = $('header').outerHeight() + 1;
    var timeoutDelay;
    var animateNavSpeed = 500;

    function hideNav() {
        navMoving = true;
        $('nav.lessonNav').addClass('disableNav');
        $('nav.lessonNav > h2').animate({marginTop: 0}, animateNavSpeed);
        $('nav.lessonNav > ol').animate({top: navHeight}, animateNavSpeed, function () {
            navMoving = false;
        });
    }

    function callNavTimeout() {
        window.clearTimeout(timeoutDelay);
        timeoutDelay = window.setTimeout(hideNav, 2000); // hide nav after 2 seconds
        leftWhileAnimating = false;
    }

    if ($('nav.lessonNav').length == 1) {
        if ($('nav.disableNav').length == 1) {
            // Show Heading First
            $('nav.lessonNav > ol').css({'top': navHeight + 'px'}); // set position based on navHeight
        } else {
            // Show Navigation First
            $('nav.lessonNav > ol').css({'top': 0});
            $('nav.lessonNav > h2').css({'margin-top': "-" + navHeight + 'px'}); // set position based on navHeight
            timeoutDelay = window.setTimeout(hideNav, 700);  // initially hide nav after 0.7 seconds
        }

        $('nav.mainNav > ol').on('mouseenter', function (e) {
            if (navMoving) {
                leftWhileAnimating = false;
            } else {
                window.clearTimeout(timeoutDelay);
            }
        });

        $('nav.mainNav > ol').on('mouseleave', function (e) {
            if (navMoving) {
                leftWhileAnimating = true;
            } else {
                callNavTimeout();
            }
        });

        $('nav.lessonNav > h2').on('mouseenter', function (e) {
            if (!navMoving) {
                //Hide Lesson, Show Nav
                navMoving = true;
                $('nav.lessonNav > h2').animate({marginTop: "-" + navHeight + 'px'}, animateNavSpeed);
                $('nav.lessonNav > ol').animate({top: 0}, animateNavSpeed, function () {
                    $('nav.lessonNav').removeClass('disableNav');
                    navMoving = false;

                    if (leftWhileAnimating) {
                        callNavTimeout();
                    }
                });
            }
        });
    }
}

$(function () {

// 1. Main Nav Form 
    $('form.searchSchoolForm input[type="button"]').on('click', function (e) {
        inputValidation($(this).parent(), e);
    });
    $('body').on('click', 'form.loginForm input[type="button"]', function (e) {
        inputValidation($(this).parent().parent(), e);
    });
    $('body').on('click', 'form.loginFormPopup input[type="button"]', function (e) {
        inputValidation($(this).parent().parent().parent(), e);
    });

    // Press 'return' key to submit login form
    $('body').on('keydown', "form.loginForm", function (e) {
        if (e.which == 13) {
            inputValidation(this, e);
        }
    });
    $('body').on('keydown', "form.loginFormPopup", function (e) {
        if (e.which == 13) {
            inputValidation(this, e);
        }
    });

    function inputValidation(elementName, e) {
        var $textInput = $(elementName).find('input[type="text"]');
        var $textPwd = $(elementName).find('input[type="password"]');

        if ($textInput.val() == '') {
            $textInput.css('border', '1px solid red');
            $textInput.focus();
        } else if ($textPwd.val() == '') {
            $textInput.css('border', '1px solid #C6C5C5');
            $textPwd.css('border', '1px solid red');
            $textPwd.focus();
        } else {
            $(elementName).submit();
            if (typeof e != 'undefined') {
                e.preventDefault();
            }
        }
    }

// 2. Active Link
    var activeData = $('body').data('active');

// 3. Init Modals
    //jQuery('a[rel*=facebox]').facebox();
    jQuery('a[rel*=facebox]').each(function () {
        if (!jQuery(this).hasClass("_processed")) {
            jQuery(this).addClass("_processed").facebox();
        }
    });

// 4. Alert Boxes
    $(document).on('click', '.alert_block.close_alert > div > a', function (e) {
        $(this).parent().parent().nextAll('.optionsRibbon.optionsRight').hide();
        $(this).parent().parent().animate({
            height: '0', opacity: '0'
        }, 500, function () {
            $(this).css('display', 'none');
            $(this).nextAll('.optionsRibbon.optionsRight').css('top', 0).show();
            if ($('#fixedSectionHeader').length) {
                resizeSectionHeader(true);
            }
        });

        e.preventDefault();
    });
});

// 5. Fix title wrapping in mobile view, we are also calling this in the mobile app

function fix_mobile_title_wrapping() {
    //fix wrapping for title in mobile mode
    $mobileTitleSpan = $('header .mobileBar .middleMobileBar > span');
    if ($mobileTitleSpan.height() > 25) {
        $mobileTitleSpan.css({marginTop: -8, fontSize: '14px'});
    } else {
        $mobileTitleSpan.removeAttr('style');
    }
}

// 6. Select Rubric Radio Button
function init_rubric_editor() {
    $('table.rubric td.rubricHover').on('click', function () {
        $(this).find('input[type="radio"]').prop('checked', true);
        $(this).siblings('td.rubricHover').removeClass("selected");
        $(this).addClass("selected");
    });
}

function to_load(){
    // to_load will load on both ajax complete (excalibur ajax loading) and on jquery load
    // 9. Add a label after each checkbox / radio button if none
    if (!is_mobile_app_mode()) {
        $("input[type='checkbox'], input[type='radio']").each(function (index) {
            if (!$(this).next().is('label')) {
                if ($(this).attr('onclick') == 'toggle_all(this)') {
                    $(this).after('<label for="' + $(this).attr('id') + '"><span class="textOffScreen">Select all</span></label>');
                } else {
                    $(this).after('<label for="' + $(this).attr('id') + '"></label>');
                }

                $(this).addClass('emptyLabel');
            }
        });
        // Find checkboxes/radio buttons within tables
        $("table td input[type='checkbox'].emptyLabel, table td input[type='radio'].emptyLabel").each(function (index) {
            // If the input is in the first column, has an ID and no aria label
            if ($(this).closest('td').is($(this).closest('tr').find("td:first")) && $(this).attr('id') != null && $(this).attr('aria-labelledby') == null) {
                var linked_id = 'aria_label_' + $(this).attr('id');

                // Add aria-labelledby to the input
                $(this).attr('aria-labelledby', linked_id);

                if ($(this).closest('td').next().find('img').length > 0) {
                    // If there is an image in the second column add an ID to the first link in the row
                    $(this).closest('tr').find("a").eq(0).attr('id', linked_id);
                } else {
                    // If not then add an ID to the second column
                    $(this).closest('td').next().attr('id', linked_id);
                }
            }
        });
    }
    window.tabnav_adjustment && window.tabnav_adjustment('#centreColumn');

    if(is_mobile_app_mode()){
        console.log('NATIVE APP: responsive_update on document ready, globalWindowWidth: ' + globalWindowWidth);
    }
    window.responsive_update && responsive_update();

    if(is_mobile_app_mode()){
        console.log('NATIVE APP: tabnav_adjustment on document ready, globalWindowWidth: ' + globalWindowWidth);
    }
    options_ribbon_adjustment();
    mobile_section_list_adjustment();

    if(!(is_mobile_app_mode() && globalWindowWidth > 768)){
        move_profile_img('table.moveProfileImg img');
        if(globalWindowWidth < 768){
            $('table.mobileOptimized img').each(function(){
                $(this).parent().css({paddingLeft: 0, paddingRight: 0});
            });
        }
    }
    enrollments_table_adjustment();
    !$('.pageHeading #fromLeft').length && move_leftcolumn_img();

    if(window.location.hash && window.location.hash.substr(1,4) == 'help'){
        $('header .quickLinks i.help').parent().click();
    }
    $(window).trigger('scroll');
    $('.jscolor').length && Excalibur.Location_tools.require_js( '/javascripts/plugins/jscolor/jscolor.min.js?1572868889', function(){
        jscolor.installByClassName("jscolor");
    });
}

/* Toggle accordion content */
function accordion_heading_link() {
    var panel = $(this).nextAll('.tab-content').first();// nextAll for pages with H2 inbetween

    $(this).siblings('button').attr('aria-expanded', false);
    $(this).siblings('.active').next().attr({'style': '','aria-hidden': true}).removeClass('active-tab');
    $(this).siblings('.active').removeClass('active');

    $(this).toggleClass('active');
    if ($(this).hasClass('active')) {
        $(this).attr('aria-expanded', true);
        panel.attr("aria-hidden", false).addClass('active-tab').css('max-height', panel[0].scrollHeight)
    } else {
        $(this).attr('aria-expanded', false);
        panel.attr({'style': '','aria-hidden': true}).removeClass('active-tab');
    }
}

$(function () {
    /* Accordion content */
    if (globalWindowWidth < 769) {
        if ($('.catalog_item .accordion_heading').length > 0) {
            $('.tab-content.active-tab').attr('aria-hidden', true).removeClass('active-tab');
        }
    }

// 7. Dropdowns
    dropdownClickEvents();

    $(window).on('loadcomplete', function(){
        setTimeout( function(){
            to_load();
        }, 05);
    });
    to_load();

// 8. Toggle Hidden Content
    $("body").delegate("a.toggleList", "click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        if ($(this).closest('ol').parent('div').length == 0) {
            if (!$(this).parent().next('div').is(':visible')) {
                $(this).parent().next('div').show(); /* show list */

                if ($(this).find('.arrowDown').length > 0) {
                    $(this).hide(); /* hide link if it's an arrow */
                } else {
                    /* for the To-do list where the list opening link stays visible */
                    $(this).attr('aria-expanded', 'true');
                    if ($(this).parent().is(':last-of-type')) {
                        $(this).parent().addClass('keep_border'); /* show border when open */
                    }
                }
            } else {
                $(this).parent().next('div').hide(); /* hide list */

                $(this).attr('aria-expanded', 'false'); /* for the To-do list */
                if ($(this).parent().is(':last-of-type')) {
                    $(this).parent().removeClass('keep_border'); /* hide border when closed */
                }
            }
        } else {
            var $open_list_link = $(this).closest('div').prev().find('a.toggleList');

            if ($open_list_link.find('.arrowDown').length > 0) {
                $open_list_link.show(); /* show link if it's a dropdown arrow */
            } else {
                $open_list_link.attr('aria-expanded', 'false'); /* for the To-do list */
                if ($open_list_link.parent().is(':last-of-type')) {
                    $open_list_link.parent().removeClass('keep_border'); /* hide border when closed */
                }
            }
            $(this).closest('div').hide(); /* hide list */
        }
    });

    if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
        // FF < 30 doesn't support position relative on table cells - add a class for altering styles in .columnBlock
        var ffversion = Number(RegExp.$1);
        if (ffversion < 30) {
            $('.columnBlock').addClass('firefox-pre-30');
        }
    }

    $('.columnBlock .optionsRibbon.hide-768 a').on('click', function (e) {
        e.preventDefault();
        $(this).closest('.hasButton').find('.toggleAssignment').show();
        $(this).closest('.optionsRibbon').hide();
    });

    $('.columnBlock .toggleAssignment a').on('click', function (e) {
        e.preventDefault();
        $(this).closest('.hasButton').find('.toggleAssignment').hide();
        $(this).closest('.hasButton').find('.optionsRibbon.hide-768').show();
    });

// 9.

// 10. Lesson Nav Show/Hide
    lessonNavEvents();

// 11. iPad Keyboard and Fixed Position Header Fix
    if (navigator.userAgent.match(/iPad/i) != null && globalWindowWidth > 768) {
        var iOSKeyboardFix = {
            targetElem: $('header'),
            init: function () {
                $("body").on("focus", "input, textarea", function () {
                    if ($(this).parents('header').length == 0 && $(this).parents('#facebox').length == 0) {
                        iOSKeyboardFix.targetElem.css({'position': 'absolute', 'top': 0, 'overflow': 'hidden'});
                        $('input, textarea').on('blur', iOSKeyboardFix.undo);
                        $('#ui-datepicker-div').on("click", "td a", iOSKeyboardFix.undo);
                    }
                });
            },
            undo: function () {
                iOSKeyboardFix.targetElem.css({'position': 'fixed', 'top': 0, 'overflow': 'visible'});
            }
        };

        function facebox_ipad_fix() {
            $(document).bind('reveal.facebox', function () {
                iOSKeyboardFix.targetElem.css({
                    'position': 'absolute',
                    'top': 0,
                    'width': (is_mobile_app_mode() ? globalWindowWidth : $(window).width()),
                    'overflow': 'hidden'
                });
            });
            $(document).bind('close.facebox', function () {
                iOSKeyboardFix.targetElem.css({'position': 'fixed', 'top': 0, 'overflow': 'visible'});
            });
        }

        on_ready(iOSKeyboardFix.init);
        on_ready(facebox_ipad_fix);
    }

// 12. Scroll animation
    if (window.location.href.split("#")[1]) {
        custom_scroll(window.location.href.split("#")[1]);
    }

    if ($('a[href^="%23"]').length > 0) {
        $('a[href^="%23"]').each(function () {
            $(this).attr('href', $(this).attr('href').replace('%23', '#'));
        });
    }

    if ($('a[href^="#"]').length > 0) {
        $('a[href^="#"]').each(function () {
            var el = $(this).attr('href').split('#')[1];

            if (el != '') {
                $(this).on('click', function () {
                    custom_scroll(el);
                });
            }
        });
    }

    function custom_scroll(el) {
        if ($('body').find('[name="' + el + '"]').length != '0') {
            var top;

            if ($(document).find('#fixedSectionHeader').length != '0') {
                top = $('[name="' + el + '"]').offset().top - ($('header').outerHeight() + $('#fixedSectionHeader').outerHeight());
            } else {
                top = $('[name="' + el + '"]').offset().top - $('header').outerHeight();

                if ($.browser.mozilla || $.browser.msie) {
                    top = top - 14;
                }
            }

            $('body,html').animate({scrollTop: top}, 'fast');
        }
    }

// 13. Fix for options in the right on Chrome
    if (/(Chrome|Webkit)/i.test(navigator.userAgent)) {
        $('.optionsRight').css('display', 'table').height();
        $('.optionsRight').css('display', 'block');
    }
// 14. Auto-scroll to hide the address bar on iphone safari iOS < 7
    if (/iPhone;.*CPU.*OS 6_\d/i.test(navigator.userAgent)) {
        addEventListener("load", function () {
            setTimeout(hideURLbar, 10);
        }, false);

        function hideURLbar() {
            window.scrollTo(0, 1);
        }
    }

// 15. Toggle game status detail tables
    $('tr.expandTableRow a').on('click', function () {
        var sliceEnd = $(this).closest('tr').siblings().length;
        var $siblings = $(this).closest('tr').siblings().slice(6, sliceEnd);

        if ($siblings.is(':visible') == false) {
            $(this).find('i').addClass('arrowUp').removeClass('arrowDown');
            $siblings.removeClass('hideRow');
        } else {
            $(this).find('i').addClass('arrowDown').removeClass('arrowUp');
            $siblings.addClass('hideRow');
        }
    });

// 16. Mobile Functions

    /* Up/Down Menu */
    function show_local_menu() {
        $('#user-menu > ol > li.subMenu, #user-menu a#btn-root').show();
        $('#user-menu > ol > li:not(.subMenu):not(.userQuicklinks), #user-menu a#btn-left').hide();
    }

    function hide_local_menu() {
        $('#user-menu > ol > li:not(.subMenu), #user-menu a#btn-left').show();
        $('#user-menu > ol > li.subMenu, #user-menu a#btn-root').hide();
    }

    $("body").delegate("#user-menu a#btn-root", "click", function (e) {
        hide_local_menu();
        e.preventDefault();
    });
    $("body").delegate("#user-menu a#btn-left", "click", function (e) {
        show_local_menu();
        e.preventDefault();
    });

    /* Show/Hide Search */
    $("body").delegate("#user-menu a#btn-search", "click", function (e) {
        $("#user-menu .searchInput").slideDown(200);
        e.preventDefault();
    });
    $("body").delegate("#user-menu a#btn-cancel", "click", function (e) {
        $("#user-menu .searchInput").slideUp(200);
        e.preventDefault();
    });

// 17. Left Nav Flyouts
    if (!is_mobile_app_mode()) {
        initLeftNav();
    }
});

var openSubNav = false,
    hasClickThrough = false,
    thinNavLoaded = false,
    mainNavLoaded = false,
    thinMenuHoverTimeout,
    thinMenuPopoutTimeout,
    globalWindowHeight = $(window).height(),
    globalWindowWidth = $(window).width(),
    globalScrollTop = 0;
setFocusThinNav = false;

function openThinNav() {
    if ($('html').hasClass('touch')) {
        setTimeout(function () {
            $('div.navTrigger').addClass('closeNavTrigger');
        }, 300);
    } else {
        $('div.navTrigger').addClass('closeNavTrigger');
    }

    var padding_side = (is_rtl_mode()) ? 'paddingRight' : 'paddingLeft';
    $('nav#leftColumn ol.thinMainNav').removeClass('hide').addClass('hoverMainNav').stop(true, true).css(padding_side, $('body').hasClass('fullscreen') ? 28 : 15).animate({width: 189}, 300, 'easeOutExpo');

    //display:none is being added sometimes - remove it when it's added
    var str = $('nav#leftColumn ol.thinMainNav').attr('style');
    if (str.indexOf("display: none") > 0) {
        var res = str.replace(' display: none;', '');
        $('nav#leftColumn ol.thinMainNav').attr('style', res);
    }

    //quick fix for the Windows app, doesn't affect anything else
    if (is_windows_app_mode()) {
        $('nav#leftColumn ol.thinMainNav').show();
    }

    $(".catalog_class").addClass('hide_nicescroll');
    $(".catalog_class nav#leftColumn").css('overflow', 'visible');

    // For Accessbility
    if (setFocusThinNav) {
        $('nav#leftColumn ol.thinMainNav').focus();
        setFocusThinNav = false;
    }
}

function closeThinNav() {
    $('div.navTrigger').removeClass('closeNavTrigger');
    $('nav#leftColumn ol.thinMainNav li a').removeClass('selected');
    $('html:not([dir=rtl]) nav#leftColumn ol.thinMainNav').removeClass('hoverMainNav').stop(true, true).animate({
        width: 0,
        paddingLeft: "0"
    }, 200, 'easeOutExpo', function () {
        $(this).addClass('hide');
    });
    $('[dir=rtl] nav#leftColumn ol.thinMainNav').removeClass('hoverMainNav').stop(true, true).animate({
        width: 0,
        paddingRight: "0"
    }, 200, 'easeOutExpo', function () {
        $(this).addClass('hide');
    });

    $(".catalog_class").removeClass('hide_nicescroll');
    $(".catalog_class nav#leftColumn").css('overflow', 'hidden');
}

function openFlyOut(row) {
    if ($(row).find(".dropDown").length) {
        $(row).parent().find('li > a').removeClass('highlight');
        $(row).parent().find('li > .dropDown').css('visibility', 'hidden');

        var $thisDropDown = $(row).find(".dropDown");

        $thisDropDown.css('visibility', 'visible');
        $(row).find("> a").addClass("highlight");

        fixFlyOut($thisDropDown);
    }
}

function closeFlyOut(row) {
    if ($(row).find(".dropDown").length) {
        $(row).find(".dropDown").attr('style', ''); // reset repositioning
        $(".moveDropDownBefore").remove(); // reset repositioning
        $(row).find(".dropDown").css('visibility', 'hidden');
        $(row).find("> a").removeClass("highlight");

        if ($(row).parent().hasClass('staticMainNav')) {
            $thisNavContainer = $(row).parent();
            $thisNavContainer.siblings('.largeImgs').first().removeAttr('style');
            $thisNavContainer.removeAttr('style');
        }

        if (is_mobile_app_mode()) {
            console.log('hide');
        }
    }
}

function delayOpenFlyOut(row) {
    if ($(row).parent().hasClass('hoverMainNav')) {
        openFlyOut(row);
    } else {
        thinMenuPopoutTimeout = window.setTimeout(function () {
            if ($(row).parent().hasClass('hoverMainNav')) openFlyOut(row);
        }, 500);
    }
}

function delayCloseFlyOut(row) {
    window.clearTimeout(thinMenuPopoutTimeout);
    if ($(row).parent().hasClass('hoverMainNav')) {
        closeFlyOut(row);
    }
}

function exitMainMenu(menu) {
    window.clearTimeout(thinMenuPopoutTimeout);
    $(menu).find(".highlight + .dropDown").css('visibility', 'hidden');
    $(menu).find(".highlight").removeClass("highlight");
    return true;
}

function fixFlyOut($thisDropDown) {
    var footerTop = is_mobile_app_mode() ? globalWindowHeight - 110 : $('footer').offset().top - $(window).scrollTop(),
        dropDownBot = $thisDropDown.offset().top - $(window).scrollTop() + $thisDropDown.outerHeight(),
        dropDownTopMargin = -parseInt($thisDropDown.css('marginTop'));
    var dropDownSiblingAttr = $thisDropDown.siblings().attr('nav-item-id'),
        parentNavClass = $thisDropDown.closest('ol').attr('class').replace(' ', ''),
        newCoverTopMargin;

    // reposition dropdown if opening link is multiline
    if (dropDownTopMargin != $thisDropDown.siblings().outerHeight()) {
        $thisDropDown.css('margin-top', '-' + $thisDropDown.siblings().outerHeight() + 'px');
    }

    // reposition if running over footer
    if (dropDownBot > footerTop && !$('#contentWrap').hasClass('gradebook')) {
        $thisDropDown.css('margin-top', '-' + (dropDownBot - footerTop + dropDownTopMargin + 8) + 'px');
    }

    // reposition if running over screen
    var safeOffset = $(window).height() - $thisDropDown.outerHeight();
    if ($thisDropDown.offset().top - $(window).scrollTop() > safeOffset) {
        $thisDropDown.attr('style', ''); // reset before readjusting
        var newTopMargin = ($thisDropDown.offset().top - $(window).scrollTop() - safeOffset) + dropDownTopMargin + 4;
        $thisDropDown.css('margin-top', '-' + newTopMargin + 'px');
    }

    //fix down-right diagonal movement issue for last nav items
    if ($thisDropDown.parent().parent().hasClass('staticMainNav') && !$thisDropDown.parent().parent().hasClass('mobileSubMenu')) {
        $thisNavContainer = $thisDropDown.parent().parent();
        var difference = ($thisDropDown.offset().top + $thisDropDown.outerHeight()) - ($thisNavContainer.offset().top + $thisNavContainer.outerHeight());
        if (difference > 0) {
            if ($thisDropDown.parent().width() < 100) {
                $thisNavContainer.siblings('.largeImgs').first().css('margin-top', $thisNavContainer.outerHeight() + 2);
            } else {
                $thisNavContainer.siblings('.largeImgs').first().css('margin-top', $thisNavContainer.outerHeight() + ($thisNavContainer.siblings('img').length ? 12 : 2));
            }
            // Fix new bug only in Chrome in RTL on absolute elements - add top pos
            if (is_rtl_mode()) {
                $thisNavContainer.css('top', $thisNavContainer.position().top + 4 + 'px');
            }
            $thisNavContainer.css({
                'position': 'absolute',
                'z-index': 10,
                'height': ($thisNavContainer.outerHeight() + difference)
            });
        }
    }
}

function hookFlyOutEvents(container) {
    if ($('nav#leftColumn ol.' + container).length == 0) {
        return;
    }

    initFlyoutTabnav(container, 'classes');
    initFlyoutTabnav(container, 'paths');

    //add "switch to class" arrows
    var classes_ids = [];
    $('nav#leftColumn ol.' + container + ' #flyout_classes #flyout_classes_tab_teaching li').each(function (index) {
        classes_ids[index] = $(this).attr('class-id');
    });
    var current_url_segments = document.URL.split('/');
    var current_class_id = current_url_segments[current_url_segments.length - 1];
    if ($.inArray(current_class_id, classes_ids) > -1) {
        $('nav#leftColumn ol.' + container + ' #flyout_classes #flyout_classes_tab_teaching li').each(function (index) {
            if (current_class_id != $(this).attr('class-id')) {
                $(this).append('<a href="/teacher_class/switch_to_class/' + current_class_id + '?class_id=' + $(this).attr('class-id') + '&from=' + encodeURIComponent(document.location.pathname) + '" class="sub_links desktop_only"><i class="return"></i></a>');
            }
        });
    }

    // non-touch screen events
    if ($('.no-touch').length > 0) {
        $(".no-touch nav#leftColumn > ol." + container).menuAim({
            activate: container == 'staticMainNav' ? openFlyOut : delayOpenFlyOut,
            deactivate: 'staticMainNav' ? closeFlyOut : delayCloseFlyOut,
            exitMenu: exitMainMenu,
            submenuDirection: $('html').attr('dir') == 'RTL' ? 'left' : 'right'
        });

        $('.no-touch nav#leftColumn ol.' + container + ' a.mainNavArrow').on('click', function (e) {
            e.preventDefault();
            if ($(this).closest('ol').width() > 50) {
                closeThinNav();
            } else {
                openThinNav();
            }
        });

        // Accessibility for .staticMainNav
        // Close flyout
        $(document).keydown(function (e) {
            var keyCode = e.keyCode || e.which;

            // If pressed Escape and a link is highlighted
            if (keyCode == 27 && $('ol.staticMainNav > li > a').hasClass('highlight')) {
                if ($('ol.staticMainNav > li > a:focus').hasClass('highlight')) {
                    // Close dropDown if controlling link has focus
                    closeFlyOut($('ol.staticMainNav a.highlight:focus').parent());
                } else {
                    // Close dropDown & reset focus if an element inside the dropDown has focus
                    closeFlyOut($('ol.staticMainNav :focus').closest('.dropDown').parent());
                    $('ol.staticMainNav :focus').closest('.dropDown').siblings('a').focus();
                }
            }
        });
        // Close any open flyouts when one of the main nav item links receives focus
        $('.no-touch nav#leftColumn > ol.staticMainNav > li > a').on('focus', function (e) {
            closeFlyOut($('ol.staticMainNav a.highlight').parent());
        });

        // Open flyout - needed after pressing Esc in order to open again
        $('.no-touch nav#leftColumn > ol.staticMainNav > li > a').click(function (e) {
            openFlyOut($(this).closest('li'));
        });
    }

    if (container == 'thinMainNav') {
        // touch screen events
        $('.touch nav#leftColumn ol.thinMainNav li a:not(.mainNavArrow)').on('mouseenter', function (e) {
            if ($(this).siblings().length) {
                e.preventDefault();
                hasClickThrough = false;
                openSubNav = true;
                if (!$(this).closest('ol').hasClass('hoverMainNav')) {
                    openThinNav();
                }
            } else {
                hasClickThrough = true;
            }
        });
        $('.touch nav#leftColumn ol.thinMainNav li:has(.dropDown) a:not(.mainNavArrow)').on('mouseleave', function (e) {
            e.preventDefault();
            openSubNav = false;
        });
        touchDeviceTweaks();
    }

    if (container == 'staticMainNav') {
        $('.' + container).click(function () {
            $('.' + container).siblings('.largeImgs').first().removeAttr('style');
            $('.' + container).removeAttr('style');
        });
    }

    $(' nav#leftColumn ol.thinMainNav a.mainNavArrow').on('click', function (e) {
        e.preventDefault();
        hasClickThrough = false;
    });

    if (!is_mobile_app_mode() && navigator.userAgent.match(/iPad/i) == null) {
        $('nav#leftColumn .dropDown .scroll li').hover(
            function () {
                $(this).find('a i').show();
            },
            function () {
                $(this).find('a i').hide();
            }
        );
    }

    $('.touch nav#leftColumn ol.' + container + ' > li > a').hover(function () {
        if ($(this).siblings('.dropDown').length) {
            fixFlyOut($(this).siblings('.dropDown'));
            $('.touch nav#leftColumn ol.' + container + ' > li > a').removeClass('highlight');
            $(this).addClass('highlight');
        }
    });

    if (!is_mobile_app_mode()) {
        initLeftNavButton();
    }

    isolatedScroll($('nav#leftColumn ol.' + container + ' .dropDown.dropDown .scroll'));
    selectNavItem();
}

function initLeftNavButton() {
    $('.no-touch .navTrigger:not(.closeNavTrigger)').mouseenter(function (e) {
        $('nav#leftColumn ol.thinMainNav').trigger('mouseenter');
    });
    $('.touch .navTrigger').click(function (e) { //remove :not(.closeNavTrigger) because it didn't work in the mobile app
        if (!$(this).hasClass('closeNavTrigger')) {
            if (is_mobile_app_mode()) {
                openThinNav();
            } else {
                $('nav#leftColumn ol.thinMainNav').trigger('click');
            }
        }
    });
    $('.no-touch .navTrigger:not(.closeNavTrigger)').mouseleave(function (e) {
        var nextElement = e.toElement || e.relatedTarget;
        if ($(nextElement).parents('nav#leftColumn').length == 0) {
            $('nav#leftColumn ol.thinMainNav').trigger('mouseleave');
        }
    });
    $('body').on('click', '.closeNavTrigger', function (e) {
        closeThinNav();
    });

    // Accessibility for .thinMainNav
    $('.no-touch .navTrigger').click(function (e) {
        if ($(this).hasClass('closeNavTrigger')) {
            $('nav#leftColumn ol.thinMainNav').trigger('mouseleave');
        } else {
            setFocusThinNav = true;
            $('nav#leftColumn ol.thinMainNav').trigger('mouseenter');
        }
    });
    $(document).keydown(function (e) {
        if (e.keyCode == 27 && $('.navTrigger').hasClass('closeNavTrigger')) {
            if ($('nav#leftColumn ol.thinMainNav > li > a').hasClass('highlight')) {
                // Close the open .dropDown
                if ($('ol.thinMainNav > li > a:focus').hasClass('highlight')) {
                    // Close dropDown if controlling link has focus
                    closeFlyOut($('ol.thinMainNav a.highlight:focus').parent());
                } else {
                    // Close dropDown & reset focus if an element inside the dropDown has focus
                    closeFlyOut($('ol.thinMainNav :focus').closest('.dropDown').parent());
                    $('ol.thinMainNav :focus').closest('.dropDown').siblings('a').focus();
                }
            } else {
                // Close the whole .thinMainNav
                $('nav#leftColumn ol.thinMainNav').trigger('mouseleave');
                $('.navTrigger a').focus();
            }
        }
    });
    // Open flyout - needed after pressing Esc in order to open again
    $('.no-touch nav#leftColumn > ol.thinMainNav > li > a').click(function (e) {
        openFlyOut($(this).closest('li'));
    });
}

function selectFlyOutTab($element, container) {
    $(container + ' ul.tabnav li a').removeClass('selected');
    $(container + ' div.scroll').hide();
    $(container + ' #' + $element.attr('rel')).show();
    $element.addClass('selected');
}

function initFlyoutTabnav(main_container, flyout_container) {
    if ($('nav#leftColumn ol.' + main_container + ' #flyout_' + flyout_container + ' ul.tabnav li').length < 2) {
        $('nav#leftColumn ol.' + main_container + ' #flyout_' + flyout_container + ' ul.tabnav').hide();
    } else {
        $('nav#leftColumn ol.' + main_container + ' #flyout_' + flyout_container + ' ul.tabnav li a').click(function () {
            selectFlyOutTab($(this), 'nav#leftColumn ol.' + main_container + ' #flyout_' + flyout_container);
        });
        selectFlyOutTab($('nav#leftColumn ol.' + main_container + ' #flyout_' + flyout_container + ' ul.tabnav li a').first(), 'nav#leftColumn ol.' + main_container + ' #flyout_' + flyout_container);
    }
}

function selectNavItem() {
    $('nav#leftColumn ol.staticMainNav li a[nav-item-id="' + $('nav#leftColumn ol.staticMainNav').attr('selected-item') + '"]').addClass('selected');
}

function touchDeviceTweaks() {
    $('.touch nav#leftColumn ol.thinMainNav > li > a:not(.mainNavArrow)').each(function () {
        if ($(this).siblings('.dropDown').length == 0) {
            $(this).on('click', function (e) {
                if (!$('.touch nav#leftColumn ol.thinMainNav').hasClass('hoverMainNav')) {
                    openThinNav();
                    $(this).addClass('selected');
                    return false;
                }
            });
        }
    });
}

//we're also calling this in the mobile app
function initLeftNav() {
    if ($('nav#leftColumn > ol.staticMainNav li .dropDown').length) {
        $(".no-touch nav#leftColumn > ol.staticMainNav").menuAim({
            activate: openFlyOut,
            deactivate: closeFlyOut,
            exitMenu: exitMainMenu,
            submenuDirection: $('html').attr('dir') == 'RTL' ? 'left' : 'right'
        });
    }

    //AJAX popouts
    $('nav#leftColumn ol.staticMainNav li a.ajaxDropdown').hover(function () {
        $this = $(this);
        if ($this.siblings('.dropDown').html().length == 0) {
            $.get($this.attr('href') + '?popout=true&from=' + encodeURIComponent(window.location.href), function (data) {
                $this.siblings('.dropDown').html(data);
            });
        }
    });

    // non-touch screen events
    $('.no-touch nav#leftColumn ol.thinMainNav').hover(function () {
        thinMenuHoverTimeout = window.setTimeout(openThinNav, 50);
    }, function (e) {
        var nextElement = e.toElement || e.relatedTarget;
        if ($(nextElement).parents('header').length == 0) {
            window.clearTimeout(thinMenuHoverTimeout);
            if ($(this).hasClass('hoverMainNav'))
                closeThinNav();
        }
    });

    // touch screen events
    $('.touch nav#leftColumn ol.thinMainNav').off('click');
    $('.touch nav#leftColumn ol.thinMainNav').on('click', function (e) {
        if ($(this).hasClass('hoverMainNav') && openSubNav == false && hasClickThrough == false) {
            closeThinNav();
        } else if (!$(this).hasClass('hoverMainNav') && hasClickThrough == false) {
            openThinNav();
        }
    });
    touchDeviceTweaks();

    $('nav#leftColumn ol.staticMainNav + ol.thinMainNav').each(function () {
        var $this = $(this);
        $(window).scroll(function () {
            var heightCondition = $this.siblings('img').length ? $this.siblings('img').outerHeight() + $this.siblings('.staticMainNav').outerHeight() : $this.siblings('.staticMainNav').outerHeight();
            if ((is_mobile_app_mode() ? globalWindowWidth : $(window).width()) > 980 && $(this).scrollTop() > heightCondition) {
                $this.fadeIn(200);
                $('ol.thinMainNav ~ ol').addClass('narrowLists');
            } else {
                $this.fadeOut(100);
                $('ol.thinMainNav ~ ol').removeClass('narrowLists');
            }
        });
    });

    selectNavItem();

    //Load thin and main nav contents from local storage
    if (!is_mobile_app_mode() && !is_visitor_mode()) {
        if (!thinNavLoaded) {
            if (Modernizr.localstorage) {
                var left_nav_content = localStorage.getItem("left_nav_content");
                if (/<li>/.test(left_nav_content)) {
                    $('nav#leftColumn ol.thinMainNav').html(left_nav_content);
                    hookFlyOutEvents('thinMainNav');
                } else {
                    ajaxLoadMainNav('thinMainNav', true);
                }
            } else {
                ajaxLoadMainNav('thinMainNav', false);
            }
            thinNavLoaded = true;
        }

        initStaticMainNav();
    }
}

function initStaticMainNav() {
    if ($('nav#leftColumn ol.staticMainNav li.flyoutContainer').length && !mainNavLoaded) {
        if (is_mobile_app_mode() || Modernizr.localstorage) {
            var left_nav_content = localStorage.getItem("left_nav_content");
            if (/<li>/.test(left_nav_content)) {
                $('nav#leftColumn ol.staticMainNav').html(left_nav_content);
                hookFlyOutEvents('staticMainNav');
            } else {
                ajaxLoadMainNav('staticMainNav', true);
            }
        } else {
            ajaxLoadMainNav('staticMainNav', false);
        }
        mainNavLoaded = true;
    }
}

function ajaxLoadMainNav(container, reset_checksum) {
    $.get('/navigation/main_nav_full', {reset_checksum: reset_checksum}, function (data) {
        $('nav#leftColumn ol.' + container).html(data);
        hookFlyOutEvents(container);
    });
}

//18. Init mobile menu
function initMobileMenuContent(data) {
    if (is_mobile_app_mode()) {
        console.log('NATIVE APP: inside initMobileMenuContent');
    }
    $('body').prepend(data);
    $('nav#user-menu .dropDownHeading').wrapInner('<ul><li class="Label dropDownHeading"></li></ul>').find('ul').unwrap();

    if ($('ol.mobileSubMenu').length) {
        // Grab group/class menu and title
        $('ol.mobileSubMenu').clone().prependTo($('nav#user-menu ol'))
            .find(' > li').removeClass('dropDownHolder').unwrap().addClass('subMenu')
            .find('a.highlight').removeClass('highlight').parent().addClass('selected');
        // TODO: this is a temporary fix, we need to remove all whitespace and bump the CSS in the native apps
        $('nav#user-menu li.subMenu a span + span').prepend(' ');
        $('nav#user-menu a.selected').removeClass('selected').parent().addClass('selected');
        if ($('header .sectionTitle h2').length) {
            $('nav#user-menu ol').prepend('<li class="Label subMenu">' + $('header .sectionTitle h2').html() + '</li>');
        }
        $('nav#user-menu').addClass('local_menu_visible').removeClass('lessonNav');
    }

    if (is_mobile_app_mode()) {
        console.log('NATIVE APP: add "help for this page" link');
    }
    //add "help for this page" link
    if (get_help_for_page()) {
        $('nav#user-menu ul.helpLinks').prepend(get_help_for_page());
    }

    if (is_mobile_app_mode()) {
        console.log('NATIVE APP: Adjust menu structure');
    }
    // Adjust menu structure
    $("nav#user-menu .dropDown .scroll ul").unwrap();
    $("nav#user-menu .dropDown *[class*='column_nav'] ul").unwrap();
    $("nav#user-menu .dropDown > ul").unwrap();
    $("nav#user-menu ol > li").each(function () {
        // Merge lists into one ul
        $(this).find('ul').wrapAll('<ul />').find('li').unwrap();
    });

    if (is_mobile_app_mode()) {
        console.log('NATIVE APP: highlight current section');
    }
    //highlight current section
    $("nav#user-menu ol > li > ul:first > li > a").each(function () {
        var $elem = $(this);
        var link = $elem.attr('href').indexOf('dashboard') > -1 ? 'dashboard' : $elem.attr('href');
        if (location.href.indexOf(link) > -1) {
            $elem.parent().addClass('mm-selected');
            $("nav#user-menu ol > li").removeClass('mm-opened');
            $elem.parent().parent().parent().addClass('mm-opened');
        }
    });

    if (is_mobile_app_mode()) {
        console.log('NATIVE APP: running replace_relative_paths');
        mobile_nav_content = replace_relative_paths($('nav#user-menu').clone().wrap('<div/>').parent().html());
        console.log('NATIVE APP: sending mobileNavContent to app');
        window.parent.postMessage('{"method": "mobileNavContent", "content": ' + JSON.stringify(mobile_nav_content) + '}', '*');
    }
    if (is_mobile_app_mode()) {
        console.log('NATIVE APP: calling initMobileMenuEvents');
    }
    initMobileMenuEvents();
}

function setMobileAppLinks(container) {
    console.log('setMobileAppLinks(' + container + ')');
    $(container + ' a:not([onclick]):not([href=""]):not([href^="#"]):not([target="_blank"]), ' + container + ' button').each(function (index) {
        var href = $(this).attr('href');
        if ((!$.hasData(this) || container == '#user-menu') && typeof $(this).attr('no-loader') == 'undefined' && !$(this).hasClass('no-loader') && (typeof (href) != 'undefined' && href.substring(0, 10) != 'javascript')) {
            if (typeof (href) == 'undefined' || (typeof (href) != 'undefined' && (href.substring(0, 1) == '/' || href.substring(0, 4) == 'http' && href.indexOf(window.location.host) > -1
                )
            )) {
                $(this).click(function () {
                    window.parent.postMessage("{\"method\": \"toggleLoader\", \"action\": \"start\"}", "*");
                });
            } else {
                $(this).click(function () {
                    if (href.indexOf(window.location.origin) < 0) {
                        window.open(href);
                        return false;
                    }
                    //window.parent.postMessage("{\"method\": \"loadBrowser\", \"href\": \"" + href + "\"}", "*");
                });
            }
        }
    });
}

function initMobileMenuEvents() {
    if (is_mobile_app_mode()) {
        console.log('NATIVE APP: Create mobile main menu');
    }
    // Create mobile main menu
    $("#user-menu").mmenu({
        slidingSubmenus: false,
        moveBackground: false,
        zposition: 'next'
    }, {
        selectedClass: "selected"
    });
    if (is_mobile_app_mode()) {
        $('nav#user-menu').on('opening.mm', function () {
            $("#user-menu").show();
        });
    } else {
        $("#user-menu").show();
    }

    if (navigator.userAgent.match(/Android/i)) {
        $("#user-menu").on("opened.mm", function () {
            window.parent.postMessage("{\"method\": \"refreshBodyHeight\", \"value\": \"1\"}", "*");
        });
        $("#user-menu").on("closed.mm", function () {
            window.parent.postMessage("{\"method\": \"refreshBodyHeight\", \"value\": \"1\"}", "*");
        });
    }

    if (is_mobile_app_mode()) {
        console.log('NATIVE APP: Add Search Form and skip to content button');
    }
    // Add Search Form and skip to content button
    $("#user-menu").before('<a href="#centreColumn" class="skipToContent">Skip to content</a>');
    if (is_mobile_app_mode() && typeof schoolProtocol != 'undefined' && typeof schoolDomain != 'undefined') {
        var form_opening_tag = '<form target="contentFrame" action="' + schoolProtocol + '://' + schoolDomain + '/search_simple/summary" onsubmit="app.toggleLoader(true);" method="get">';
    } else {
        var form_opening_tag = '<form action="/search_simple/summary" method="get">';
    }
    $("#user-menu").prepend('\
	<div class="mobileSearch quickLinks">\
		<div class="searchLinks">\
			<a href="" id="btn-root"><i class="home"></i><span class="textOffScreen">Home</span></a>\
			<a href="" id="btn-left"><i class="arrow-left"></i><span class="textOffScreen">Return to sub-menu</span></a>\
			<a href="#" id="btn-search"><i class="search"></i><span class="textOffScreen">Search</span></a>\
		</div>\
		<div class="searchInput">\
			' + form_opening_tag + '\
				<input type="search" id="phrase" name="phrase" placeholder="Search">\
			</form>\
			<a href="#" id="btn-cancel"><i class="xCross inverted"></i><span class="textOffScreen">Close search</span></a>\
		</div>\
	</div>');
    $('nav.mm-menu a').each(function () {
        if ($(this).attr('href') == '#' || $(this).attr('href') == '') {
            $(this).attr('href', 'javascript:void(0)');
        }
    });

    $("header").addClass('mm-fixed-top');

    if (is_mobile_app_mode()) {
        console.log('NATIVE APP: merge links for accessibility');
    }
    // merge links for accessibility
    $("nav#user-menu .mm-list li > a").each(function () {
        if ($(this).siblings('.mm-subopen').length > 0) {
            $(this).siblings('.mm-subopen').addClass('merged').prepend($(this).html());
            $(this).remove();
        }
    });
    $('#user-menu .mm-subopen').click(function (e) {
        $(this).parent().siblings('li').removeClass('mm-opened');
        $(this).parent().hasClass('mm-opened') ? $(this).attr('aria-expanded', 'true') : $(this).attr('aria-expanded', 'false');

        if ($(this).parent().offset().top < 50) {
            $('#user-menu ol').scrollTop($('#user-menu ol').scrollTop() - (Math.abs($(this).parent().offset().top) + 50));
        }
    });

    if (navigator.userAgent.match(/Android/i)) {
        $('#user-menu > ol > li.userQuicklinks:last-child').css('margin-bottom', 30);
    }

    if (is_mobile_app_mode()) {
        console.log('NATIVE APP: close menu when facebox is opened');
    }
    //close menu when facebox is opened
    $(document).bind('reveal.facebox', function () {
        if ($("#user-menu").hasClass('mm-opened'))
            $("#user-menu").trigger("close.mm");
    });

    if (is_mobile_app_mode()) {
        console.log('NATIVE APP: scroll to current selected item');
    }
    //scroll to current selected item
    if ($('nav#user-menu li.mm-selected').length && $('nav#user-menu li.mm-selected').offset().top > $(window).height() - 100) {
        $('nav#user-menu ol').scrollTop($('nav#user-menu li.mm-selected').offset().top - ($(window).height() / 2));
    }

    if (is_mobile_app_mode()) {
        console.log('NATIVE APP: remove arrow from lesson items');
    }
    //remove arrow from lesson items
    $("nav#user-menu .lessonItem").siblings('.mm-subopen').remove();

    if (is_mobile_app_mode()) {
        setMobileAppLinks('#user-menu');
    }
}

$(function () {

// 19.


// 20. Disable fixed position for header and section toolbar on zoom - mobile devices
    if (is_mobile_device() && $(window).width() > 980) {
        $(window).resize(function () {
            var zoom = document.documentElement.clientWidth / window.innerWidth;
            if (zoom > 1) {
                $('header, #fixedSectionHeader:not(.grade)').css('position', 'absolute');
            } else if (zoom == 1) {
                $('header, #fixedSectionHeader:not(.grade)').css('position', 'fixed');
            }
        });
    }

// 21. Resize functions

    // Catalog item show content
    $('.catalog_item .showLessons a, .catalog_item .showReviews a').on('click', function (e) {
        e.preventDefault();

        if ($(this).parent().siblings('.hide').length > 0) {
            $(this).parent().siblings('.hide').each(function (index) {
                $(this).addClass("show").removeClass("hide");
            });
            $(this).parent().addClass('removeLines');
        } else {
            $(this).parent().siblings('.show').each(function (index) {
                $(this).addClass("hide").removeClass("show");
            });
            $(this).parent().removeClass('removeLines');
        }
        $(this).css('display', 'none').siblings().css('display', 'inline-block');

        if ($('.accordion_heading').is(':visible')) {
          $(this).closest('.active-tab').css('max-height', $(this).closest('.active-tab')[0].scrollHeight);
        }
    });

    //Resize user screen
    $(window).resize(function () {
        // Reposition facebox in the middle
        if ($('#facebox[style*="display"]').length == 0) {
            $('#facebox').css('left', ($(window).width() - $('#facebox').width()) / 2);
        }

        show_hide_section_end_links();

        // Lessons and Catalog tiles have sortable settings. Only need width setting if there's a right col
        if ($('.hasRightColumn .catalog_boxes.ui-sortable').length) {
            $('.hasRightColumn .catalog_boxes').css('width', 'auto');
            $('.hasRightColumn .catalog_boxes').css('width', $('.hasRightColumn .catalog_boxes').width());
        }
    });

// 22. Add iframe to z-index elements in IE
    if (/MSIE|Trident/.test(navigator.userAgent)) {
        var iframe_element = '<iframe style="border:none; position:absolute; top:0; left:0; height:100%; width:100%; z-index:-1;" src="about:blank"></iframe>';
        $(document).bind('reveal.facebox', function () {
            $('#facebox').prepend(iframe_element);
        });
        $('header').prepend(iframe_element);
        $('#fixedSectionHeader').prepend(iframe_element);
    }

    // 23. Load SVG icon sprite
    $.get("/images/icons/main-icons-lrg.svg", function (data) {
        var div = document.createElement("div");
        div.style.display = 'none';
        div.innerHTML = new XMLSerializer().serializeToString(data.documentElement);
        document.body.insertBefore(div, document.body.childNodes[0]);
    });

    // 24. make wider images responsive
    $('.materialStyle img[width]').each(function () {
        var visible_width = 0;
        if (parseInt($(this).css('width')) > 0) {
            visible_width = parseInt($(this).css('width'));
        } else {
            visible_width = parseInt($(this).attr('width'));
        }
        var parent_width = $(this).parents('.materialStyle').width();
        if (parent_width > 0 && visible_width > parent_width) {
            $(this).removeAttr('width');
            $(this).removeAttr('height');
            $(this).css({'width': '100%', 'height': 'auto'});
        }
    });

    // 25. add focus trap to facebox
    if (!is_mobile_app_mode() && $('html').hasClass('no-touch') && !$('body').hasClass('portal')) {
        $(document).bind('reveal.facebox', function () {
            focusTrap.activate('#facebox', {
                initialFocus: '#facebox'
            });
            $('body').on('mousedown', '#facebox input, #facebox select', deactivate_focus_trap);
        });
        $(document).bind('close.facebox', function () {
            focusTrap.deactivate({returnFocus: false});
        });

        function deactivate_focus_trap(e) {
            focusTrap.deactivate({returnFocus: false});
            $(e.target).focus();
        }
    }

    // 26. Stop flowplayer when closing facebox
    $(document).bind('close.facebox', function () {
        $("#facebox div[id^='flowpv'], #facebox div[id^='flowpa']").each(function (index, element) {
            flowplayer($(element)).stop();
        });
    });

    $('body, #wrapper').on('click', function (e) { /* 'body' - wide screen clicks on white space. '#wrapper' - iPad */
        if (!$(e.target).is('.quick_edit_icon > *, .quick_edit_box, .quick_edit_box *') && !$('input.jscolor').is(':focus') && $('#facebox').has(e.target).length == 0) {
            if ($('.quick_edit_icon.show').length) {
                quick_edit_visibility($('.quick_edit_icon.show'), true);
            }
        }
    });

    // 27. Responsive tables
    $('table[class*=inline_table_below_]').each(function () {
        responsive_cell_headers(this);
    });

    // 28. Show/hide section end links in a lesson
    function show_hide_section_end_links() {
        if ($('.section_end_links').length && $('.sectionLink').length) {
            // Check gap between top and bottom links
            var gap_btwn_links = ($('.section_end_links').offset().top - $('.sectionLink').first().offset().top) + ($('.sectionLink').first().outerHeight() * 3);

            if (gap_btwn_links > globalWindowHeight && globalWindowWidth < 980) {
                $('.section_end_links .sectionLink').css('display', 'inline-flex');
            } else {
                $('.section_end_links .sectionLink').css('display', 'none');
            }
        }
    }

    show_hide_section_end_links();

    /* 29. Check portal header scroll */
    function check_portal_scroll() {
        if ($(window).scrollTop() > 20) {
            $('.transparent_header header').addClass('scrolled');
        } else {
            $('.transparent_header header').removeClass('scrolled');
        }
    }
    if ($(window).width() >= 980 && $('.portal header').length > 0) {
        $(window).on("scroll",function() {
            check_portal_scroll();
        });
        $(window).on('touchmove',function(e){
            check_portal_scroll();
        });
        check_portal_scroll();
    }

}); // END - Document ready

function hexc(colorval) {
    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    delete (parts[0]);
    for (var i = 1; i <= 3; ++i) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length == 1) parts[i] = '0' + parts[i];
    }
    return "#" + parts.join('');
}

function quick_edit_visibility(target) {
    target = target || this;
    var quick_edit_box = target.siblings('.quick_edit_box');
    var box_index = quick_edit_box.attr('id').replace('quick_edit_box_', '');

    if (quick_edit_box.css('display') == "block") {
        target.removeClass('show').attr("aria-expanded", false);
        quick_edit_box.attr('style', 'display:none');

        //re-enable drag and drop (firefox windows bug)
        if ($('ui-sortable-disabled').length > 0) {
            $('.ui-sortable-disabled').sortable('enable');
        }
    } else {
        // show editor box
        target.addClass('show').attr("aria-expanded", true);
        quick_edit_box.attr('style', '').animate({opacity: "1", marginTop: '2px'}, 90, 'easeOutExpo');

        if (quick_edit_box.html().length == 0 || quick_edit_box.parents('.default_image_editor').length > 0) {
            $.get(target.data('url'), function (data) {
                quick_edit_box.html(data);

                // bind save and cancel buttons
                quick_edit_box.find('#cancel_btn').on('click', function () {
                    quick_edit_visibility($(this).closest('.quick_edit_box').siblings('.quick_edit_icon'), false);
                });
                quick_edit_box.find('#save_btn').on('click', function () {
                    quick_edit_visibility($(this).closest('.quick_edit_box').siblings('.quick_edit_icon'), true);
                });

                // set input color dynamically
                if (quick_edit_box.find('.jscolor').length > 0) {
                    var picker = new jscolor(quick_edit_box.find('.jscolor')[0]);
                    if ($('body').hasClass('catalog_class')) {
                        picker.fromString(hexc($('#leftColumn').css('background-color')));
                    } else if (quick_edit_box.find('.jscolor').length > 0) {
                        if ($(quick_edit_box).closest('tr').hasClass('modern_module_row')) {
                            picker.fromString(hexc(quick_edit_box.parent().parent().css('background-color')));
                        } else {
                            picker.fromString(hexc(quick_edit_box.parent().css('background-color')));
                        }
                    }
                }

                //reset picture button and field
                quick_edit_box.find('.options_btn').show();
                quick_edit_box.find('.uploader-list').hide().html('');

                //disable drag and drop (firefox windows bug)
                if ($('ui-sortable').length > 0) {
                    $(".ui-sortable").sortable('disable');
                }
            });
        }

        if (quick_edit_box.closest('aside').hasClass('rightColumn')) {
            // Right column widgets
            var quick_edit_box_bottom = quick_edit_box.siblings('.quick_edit_icon').offset().top + quick_edit_box.siblings('.quick_edit_icon').height() + quick_edit_box.outerHeight();
            var widget_bottom = quick_edit_box.closest('.widget').offset().top + quick_edit_box.closest('.widget').outerHeight();
            // Reset
            quick_edit_box.removeClass('open_upwards');

            if (quick_edit_box_bottom > widget_bottom && quick_edit_box.closest('.widget').is(':last-child') && !quick_edit_box.closest('.widget').is(':first-child')) {
                // Overflows container, open upwards
                quick_edit_box.addClass('open_upwards').animate({opacity: "1", bottom: '36px'}, 90, 'easeOutExpo');
            }
        }
    }
}

function update_tile_color(jscolor) {
    var holder = '#' + jscolor.styleElement.id.split('input').pop();
    $(holder).closest('.quick_edit_box').parent().css('background-color', '#' + jscolor);
}

function update_catalog_item_color(jscolor) {
    var holder = '#' + jscolor.styleElement.id.split('input').pop(),
        catalog_item_styles = '<style id="catalog_item_color" type="text/css">html:not([dir=rtl]) .catalog_class #contentWrap:before, [dir=rtl] .catalog_class #contentWrap:after, .catalog_class #leftColumn {background-color: #' + jscolor + ' !important}</style>';

    $('head #catalog_item_color').remove();
    $(catalog_item_styles).appendTo($('head'));
}

function accordion_link() {
    var $siblings = this.closest('tr').siblings();

    if ($siblings.length) {
        if ($siblings.is(':visible') == false) {
            show_section_adjustments(this.closest('table'));
        } else {
            hide_section_adjustments(this.closest('table'));
        }
    }
}