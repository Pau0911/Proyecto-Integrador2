/*
 * Facebox (for jQuery)
 * version: 1.2 (05/05/2008)
 * @requires jQuery v1.2 or later
 *
 * Examples at http://famspam.com/facebox/
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2007, 2008 Chris Wanstrath [ chris@ozmm.org ]
 *
 * Usage:
 *  
 *  jQuery(document).ready(function() {
 *    jQuery('a[rel*=facebox]').facebox() 
 *  })
 *
 *  <a href="#terms" rel="facebox">Terms</a>
 *    Loads the #terms div in the box
 *
 *  <a href="terms.html" rel="facebox">Terms</a>
 *    Loads the terms.html page in the box
 *
 *  <a href="terms.png" rel="facebox">Terms</a>
 *    Loads the terms.png image in the box
 *
 *
 *  You can also use it programmatically:
 * 
 *    jQuery.facebox('some html')
 *
 *  The above will open a facebox with "some html" as the content.
 *    
 *    jQuery.facebox(function($) { 
 *      $.get('blah.html', function(data) { $.facebox(data) })
 *    })
 *
 *  The above will show a loading screen before the passed function is called,
 *  allowing for a better ajaxy experience.
 *
 *  The facebox function can also display an ajax page or image:
 *  
 *    jQuery.facebox({ ajax: 'remote.html' })
 *    jQuery.facebox({ image: 'dude.jpg' })
 *
 *  Want to close the facebox?  Trigger the 'close.facebox' document event:
 *
 *    jQuery(document).trigger('close.facebox')
 *
 *  Facebox also has a bunch of other hooks:
 *
 *    loading.facebox
 *    beforeReveal.facebox
 *    reveal.facebox (aliased as 'afterReveal.facebox')
 *    init.facebox
 *
 *  Simply bind a function to any of these hooks:
 *
 *   $(document).bind('reveal.facebox', function() { ...stuff to do after the facebox and contents are revealed... })
 *
 */
(function($) {
  $.facebox = function(data, klass) {
    $.facebox.loading()

    if (data.ajax) fillFaceboxFromAjax(data.ajax, klass)
    else if (data.image) fillFaceboxFromImage(data.image)
    else if (data.div) fillFaceboxFromHref(data.div)
    else if ($.isFunction(data)) data.call($)
    else $.facebox.reveal(data, klass)
  }

  /*
   * Public, $.facebox methods
   */

  $.extend($.facebox, {
    settings: {
      opacity      : '0.4',
      overlay      : true,
      loadingImage : '/images/loading-animation-white-retina.gif',
      imageTypes   : [ 'png', 'jpg', 'jpeg', 'gif' ],
      faceboxHtml  : '\
                                        <div id="facebox" tabindex="-1" style="display:none;" role="dialog"> \
                                          <div class="popup"> \
                                                        <a href="#" class="close"><span class="textOffScreen">Close</span></a> \
                                                        <div id="faceboxContent" class="content"> \
                                                        </div> \
                                          </div> \
                                        </div>'
    },

    loading: function() {
      init()
      if ($('#facebox .loading').length == 1) return true
      showOverlay();
          
      //$('body').css('overflow', 'hidden'); // prevent body scroll while popup is open

      $('#facebox .content').empty()
      $('#facebox .popup').children().hide().end().
        append('<div class="loading"><img src="'+$.facebox.settings.loadingImage+'" width="100" /></div>')

      $('#facebox').css({
        top:    ( is_mobile_device() ? getPageScroll()[1] + (getPageHeight() / 30) : getPageScroll()[1] + (getPageHeight() / 16)),
        /* ***MODIFICATION*** */
        //left: 385.5
        left:   ($(window).width() - $('#facebox').width()) / 2
        /* ***MODIFICATION ENDS*** */
      }).show()

      $(document).bind('keydown.facebox', function(e) {
        if (e.keyCode == 27) $.facebox.close()
        return true
      })
      $(document).trigger('loading.facebox')
    },

    reveal: function(data, klass) {
      $(document).trigger('beforeReveal.facebox');
      if (klass) $('#facebox').addClass(klass);
      $('#facebox .content').append(data);
      $('#facebox .loading').remove();
      $('#facebox .popup').children().fadeIn('normal');
      Response.create({prop: "device-pixel-ratio", prefix: "pixel-density-"}); // load pixel density check
      $('#facebox form, #facebox .facebox-content').attr('style',''); //clear any inline styles during the responsive transition
      adjustFaceboxWidthHeightTop();
      if (!is_portal_mode()) {
        tabnav_adjustment('#facebox');
      }
    if(!Modernizr.svg) {
      $('img[src*="svg"]').attr('src', function() {
        return $(this).attr('src').replace('.svg', '.png');
      });
    }
    if(!Modernizr.placeholder && !is_mobile_app_mode() && !/(scorm\/|scorm_|lesson\/show)/i.test(document.URL)) {
      $('#facebox input').placeholder();
    }
    if (typeof isolatedScroll == 'function') {
      isolatedScroll($('#facebox .facebox-content:not(.help_centre):not(.report-popup):not(.question-selector-popup)'));
    }
    if(klass == 'hide_close'){
      $('#facebox .close').hide();
    }
      $(document).trigger('reveal.facebox').trigger('afterReveal.facebox')
      window.init_popop_editor_function && init_popop_editor_function();
    },

    close: function() {
      $(document).trigger('close.facebox')
      return false
    }
  })

  /*
   * Public, $.fn methods
   */

  $.fn.facebox = function(settings) {
    init(settings)

    function clickHandler() {
      $.facebox.loading(true)

      // support for rel="facebox.inline_popup" syntax, to add a class
      // also supports deprecated "facebox[.inline_popup]" syntax
      var klass = this.rel.match(/facebox\[?\.(\w+)\]?/)
      if (klass) klass = klass[1]

      fillFaceboxFromHref(this.href, klass)
      return false
    }

    return this.click(clickHandler)
  }

  /*
   * Private methods
   */

  // called one time to setup facebox on this page
  function init(settings) {
    if ($.facebox.settings.inited) return true
    else $.facebox.settings.inited = true

    $(document).trigger('init.facebox')
    makeCompatible()

    var imageTypes = $.facebox.settings.imageTypes.join('|')
    $.facebox.settings.imageTypesRegexp = new RegExp('\.' + imageTypes + '$', 'i')

    if (settings) $.extend($.facebox.settings, settings)
    $('body').append($.facebox.settings.faceboxHtml)

    var preload = [ new Image(), new Image() ]
    preload[0].src = $.facebox.settings.loadingImage

    $('#facebox').find('.b:first, .bl, .br, .tl, .tr').each(function() {
      preload.push(new Image())
      preload.slice(-1).src = $(this).css('background-image').replace(/url\((.+)\)/, '$1')
    })

    $('#facebox .close').css({ 'z-index': 100 }).click($.facebox.close);
    $('#faceboxContent').css({ 'position': 'relative', 'z-index': 1 });
  }

  // Backwards compatibility
  function makeCompatible() {
    var $s = $.facebox.settings

    $s.loadingImage = $s.loading_image || $s.loadingImage
    $s.imageTypes = $s.image_types || $s.imageTypes
    $s.faceboxHtml = $s.facebox_html || $s.faceboxHtml
  }

  // Figures out what you want to display and displays it
  // formats are:
  // div: #id
  // image: blah.extension
  // ajax: anything else
  function fillFaceboxFromHref(href, klass) {
    // div
    if (href.match(/#/)) {
      var url    = window.location.href.split('#')[0]
      var target = href.replace(url,'')
      $.facebox.reveal($(target).clone().show(), klass)

    // image
    } else if (href.match($.facebox.settings.imageTypesRegexp)) {
      fillFaceboxFromImage(href, klass)
    // ajax
    } else {
      fillFaceboxFromAjax(href, klass)
    }
  }

  function fillFaceboxFromImage(href, klass) {
    var image = new Image()
    image.onload = function() {
      $.facebox.reveal('<div class="image"><div class="header"></div><img src="' + image.src + '" /></div>', klass)
    }
    image.src = href
  }

  function fillFaceboxFromAjax(href, klass) {
    $.get(href, function(data) { $.facebox.reveal(data, klass) })
  }

  function skipOverlay() {
    return $.facebox.settings.overlay == false || $.facebox.settings.opacity === null 
  }

  function showOverlay() {
    if (skipOverlay()) return

    if ($('facebox_overlay').length == 0) 
      $("body").append('<div id="facebox_overlay" class="facebox_hide"></div>')

    $('#facebox_overlay').hide().addClass("facebox_overlayBG")
      .css('opacity', $.facebox.settings.opacity)
      //.click(function() { $(document).trigger('close.facebox') })
      .fadeIn(200)
    return false
  }

  function hideOverlay() {
    if (skipOverlay()) return

    $('#facebox_overlay').fadeOut(200, function(){
      $("#facebox_overlay").removeClass("facebox_overlayBG")
      $("#facebox_overlay").addClass("facebox_hide") 
      $("#facebox_overlay").remove()
    })
    
    return false
  }

  /*
   * Bindings
   */

  $(document).bind('close.facebox', function() {
    $(document).unbind('keydown.facebox');
    var hasFacebox = false;
    if( $('#facebox').find(".mce-tinymce").size() > 0 ) {
      hasFacebox = true;
    }
    
    if( !hasFacebox ) {
      closeTheFacebox();
    } else {
      var editor = tinymce.activeEditor;
      if( editor.isDirty() && tinyPop ) {
        editor.windowManager.open({
          title:"Close the editor?",
          file:"/tinymce/close.htm" + ($('html').attr('dir') == 'RTL' ? '?rtl=true' : ''),
          width:600,
          height:60,
          buttons:[{
            text:"Do not close",
            onclick:"close",
            classes:"widget btn primary first abs-layout-item not-close-btn"
          }, {
            text:"Close",
            onclick: function() {
              editor.windowManager.close();
              editor.destroy();
              editor.remove();
              closeTheFacebox();
            },
            classes:"widget btn primary first abs-layout-item close-btn"
          }]
        });
        if($('html').attr('dir') == 'RTL'){
          $('.mce-close-btn').css('left', 0);
          $('.mce-not-close-btn').css('left', $('.mce-close-btn').outerWidth() + 5);
        }
      } else {
        closeTheFacebox();
      }
    }
  })
  
  function closeTheFacebox() {
    $('#facebox').fadeOut(function() {
      $('#facebox .content').removeClass().addClass('content');
      hideOverlay();
      $('#facebox .loading').remove();

      if ($(window).width() < 980 && !/(iPad);.*CPU.*OS 7_\d/i.test(navigator.userAgent)) {
        $('#wrapper').css({'position': 'static', 'width': 'auto'});
      }

      if (typeof(tinyMCE) != "undefined") {
        tinymce.remove("#faceboxContent textarea.hasEditor");
      }

      /* Stop video on close */
      var vid = $('#facebox iframe[src*="youtube"]');
      if (vid.length > 0){
          vid.attr('src', '');
      }
      $(document).trigger('afterClose.facebox');
    });
  }

})(jQuery);

  // getPageScroll() by quirksmode.com
  function getPageScroll() {
    var xScroll, yScroll;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
      xScroll = self.pageXOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) {// Explorer 6 Strict
      yScroll = document.documentElement.scrollTop;
      xScroll = document.documentElement.scrollLeft;
    } else if (document.body) {// all other Explorers
      yScroll = document.body.scrollTop;
      xScroll = document.body.scrollLeft;
    }
    return new Array(xScroll,yScroll)
  }

  // Adapted from getPageSize() by quirksmode.com
  function getPageHeight() {
    var windowHeight
    if (self.innerHeight) {// all except Explorer
      windowHeight = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) {// Explorer 6 Strict Mode
      windowHeight = document.documentElement.clientHeight;
    } else if (document.body) {// other Explorers
      windowHeight = document.body.clientHeight;
    }   
    return windowHeight
  }

  function adjustFaceboxWidthHeightTop() {
    /* Facebox Left Position */
    if($(window).width() >= 460) {
      var facebox_width_halved = $('#facebox .popup').outerWidth() / 2;
      $('#facebox').css({'left': $(window).width() / 2 - facebox_width_halved});
    }

    /* Facebox Top Position & Max-Height for Desktop */
    var top_offset = ( $(window).height() - outerHeight($('#facebox')) ) / 5;
    var page_header_height = outerHeight($('#wrapper header')) - parseInt($('#wrapper header').css('borderBottomWidth'));
    var fb_padding_top = parseInt($('#facebox .facebox-content').css('padding-top'));
    var fb_padding_bottom = parseInt($('#facebox .facebox-content').css('padding-bottom'));
    var content_max_height = $(window).height() - (page_header_height*2) - outerHeight($('#facebox .header')) - outerHeight($('#facebox .error')) - outerHeight($('#facebox #alerts')) - outerHeight($('#facebox .facebox-resources-filter')) - outerHeight($('#facebox .footer')) - fb_padding_top - fb_padding_bottom - (parseInt($('#facebox').css('top')) - $(window).scrollTop());

    /* Position main site loginPopup vertically centre */
    if ($('.newSite #facebox .facebox-content').hasClass('loginPopup') && ($(window).width() >= 768)) {
      $('#facebox').css({'top': "50%", 'position': 'fixed'}).addClass('valignModal');
    } else {
      $('.newSite #facebox').css('position', 'absolute');
    }

    /* Sync list max height */
    if ($(window).width() >= 980) {
      $('#facebox .facebox-content.sync-list').css({'max-height': content_max_height});
    }

    /* People picker content height calc */
    function checkPaginationVisibility(element, minHeightElement, maxHeightElement) {
      $(minHeightElement).css({'min-height': maxHeightElement});

      if ($(element + ' .search-navigation').length >= 1) {
        $(element + ' .people_scroller').css({'max-height': maxHeightElement - outerHeight($('#PeoplePicker .search-navigation'))});
      } else {
        $(element + ' .people_scroller').css({'max-height': maxHeightElement});
      }
    }

    function peoplepickerHeight() {
      if ($(window).width() > 1024) {
        var person_height = outerHeight($('#PeoplePicker .people_scroller tr'));
        var peoplepicker_content_height = content_max_height - outerHeight($('#PeoplePicker .tabs-extra-class'));
        var peoplepicker_height_even = Math.ceil(peoplepicker_content_height / person_height) * person_height;
        var section_intro_height = outerHeight($('#PeoplePicker .section-intro')) + parseInt($('#PeoplePicker .section-intro').css('marginTop'));
        var section_intro_height_even = Math.ceil(section_intro_height / person_height) * person_height;

        // Left helf height if .section-intro visible
        if (peoplepicker_height_even < outerHeight($('#PeoplePicker #people_matched')) && $('#PeoplePicker .section-intro').length >= 1) {
          checkPaginationVisibility('#PeoplePicker #people_matched', '#PeoplePicker .half', section_intro_height_even);
        }
        // Left half height if .section-intro invisible
        if (peoplepicker_height_even < outerHeight($('#PeoplePicker #people_matched')) && $('#PeoplePicker .section-intro').length == 0) {
          checkPaginationVisibility('#PeoplePicker #people_matched', '#PeoplePicker #people_matched', peoplepicker_height_even);
        }
        // Right half height if .section-intro invisible
        if (peoplepicker_height_even < outerHeight($('#PeoplePicker #people_selected')) && $('#PeoplePicker .section-intro').length == 0) {
          checkPaginationVisibility('#PeoplePicker #people_selected','#PeoplePicker #people_selected', peoplepicker_height_even);
        }
      }
    }

    peoplepickerHeight();

    /* Proficiency picker content height calc */
    function checkPaginationVisibility2(element, minHeightElement, maxHeightElement) {
      $(minHeightElement).css({'min-height': maxHeightElement});

      if ($(element + ' .search-navigation').length >= 1) {
        $(element + ' .proficiency_scroller').css({'max-height': maxHeightElement - outerHeight($('#ProficiencyPicker .search-navigation'))});
      } else {
        $(element + ' .proficiency_scroller').css({'max-height': maxHeightElement});
      }
    }

    function outerHeight( $elem ){
      return $elem.outerHeight() || null;
    }

    function proficiencypickerHeight() {
      if ($(window).width() > 1024) {
        var proficiency_height = outerHeight($('#ProficiencyPicker .proficiency_scroller tr'));
        var proficiencypicker_content_height = content_max_height - outerHeight($('#ProficiencyPicker .tabs-extra-class'));
        var proficiencypicker_height_even = Math.ceil(proficiencypicker_content_height / proficiency_height) * proficiency_height - 7; // hack for 775 height
        var section_intro_height = outerHeight($('#ProficiencyPicker .section-intro')) + parseInt($('#ProficiencyPicker .section-intro').css('marginTop'));
        var section_intro_height_even = Math.ceil(section_intro_height / proficiency_height) * proficiency_height;

        // Left helf height if .section-intro visible
        if (proficiencypicker_height_even < outerHeight($('#ProficiencyPicker #proficiency_matched')) && $('#ProficiencyPicker .section-intro').length >= 1) {
          checkPaginationVisibility2('#ProficiencyPicker #proficiency_matched', '#ProficiencyPicker .half', section_intro_height_even);
        }
        // Left half height if .section-intro invisible
        if (proficiencypicker_height_even < outerHeight($('#ProficiencyPicker #proficiency_matched')) && $('#ProficiencyPicker .section-intro').length == 0) {
          checkPaginationVisibility2('#ProficiencyPicker #proficiency_matched', '#ProficiencyPicker #proficiency_matched', proficiencypicker_height_even);
        }
        // Right half height if .section-intro invisible
        if (proficiencypicker_height_even < outerHeight($('#ProficiencyPicker #proficiency_selected')) && $('#ProficiencyPicker .section-intro').length == 0) {
          checkPaginationVisibility2('#ProficiencyPicker #proficiency_selected','#ProficiencyPicker #proficiency_selected', proficiencypicker_height_even);
        }
      }
    }

    proficiencypickerHeight();
    
    /* Help centre content height calc */
    var help_content_height = content_max_height - fb_padding_top - fb_padding_bottom - outerHeight($('#facebox .help_centre_heading')) - outerHeight($('#facebox .tabnav')) - parseInt($('#facebox .tabnav').css('margin-bottom'));
    if($(window).width() >= 460 && $(window).width() < 980) {
      $('#facebox .facebox-content.help_centre').css({'height': content_max_height, 'max-height': content_max_height});
      $('#facebox .facebox-content.help_centre .help_centre_content').css({'height': help_content_height - outerHeight($('#facebox .help_centre form'))});
    } else if ($(window).width() >= 980) {
      $('#facebox #ResourceLibraryFilterWrapper .facebox-content').css({'height': content_max_height, 'max-height': content_max_height});
      $('#facebox .facebox-content.help_centre').css({'height': content_max_height, 'max-height': content_max_height});
      $('#facebox .facebox-content.help_centre .help_centre_content').css({'height': help_content_height});
    }
    
    if (is_mobile_app_mode()) {
      $('#facebox').css({'top': top_offset < 40 ? 40 : top_offset});
    } else if ($(window).width() < 980 && !/(iPad);.*CPU.*OS 7_\d/i.test(navigator.userAgent)) {
      if ($('#facebox').is(':visible')) {
        $('#wrapper').css({'position': 'fixed', 'width': '100%'});
        $(window).scrollTop(0);
      }
      $('#facebox').css({'top': page_header_height + 'px'});
    }
    
    if($('.messagePopup').length > 0 && $(window).width() > 980){
      $('#facebox .facebox-content').css('height', 400);
    }

    if($('#facebox .image img').length > 0){
      $('#facebox .image img').load(function(){
        var img = new Image();
        img.onload = function() {
          if(this.width > $(window).width() - 20){
            $('#facebox').css('left', 0);
          } else {
            $('#facebox').css('left', ($(window).width() - 20 - this.width) / 2);
          }
        }
        img.src = $(this).attr('src');
      });
    }
  }