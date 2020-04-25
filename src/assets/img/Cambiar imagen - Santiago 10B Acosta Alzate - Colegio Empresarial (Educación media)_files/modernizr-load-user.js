if(!(is_mobile_app_mode() && window.innerWidth > 768)){
	Modernizr.load([
        {
		// Polyfill placeholder support for browsers without it
		test: Modernizr.placeholder,
		nope: '/javascripts/plugins/jquery.placeholder.js',
		complete : function () {
				if(typeof $('input').placeholder == 'function') {
					$('input').placeholder();
				}
			}
		}
	]);
}

// Responsive Adjustments
var busy_loading_menu = false,
    menu_scripts_loaded = false,
    mobile_menu_on = false,
    ajax_menu_loaded = false;
		page_title_updated = false;

var rightOptions_padding_side = ($('html').attr('dir') != 'RTL') ? 'padding-right' : 'padding-left';
var tabnav_padding_start = parseInt($('#centreColumn ul.tabnav').css(rightOptions_padding_side));

function responsive_update() {
	if(!(is_mobile_app_mode() && globalWindowWidth > 768)){
		if (globalWindowWidth < 768 && !menu_scripts_loaded && !busy_loading_menu) {
			// load scripts once-off
			busy_loading_menu = true;
			Modernizr.load([{
					test: globalWindowWidth < 768,
					yep: ['/javascripts/plugins/mmenu/jquery.mmenu.min.all.js', '/javascripts/plugins/mmenu/jquery.mmenu.css', '/javascripts/plugins/mmenu/extensions/jquery.mmenu.positioning.css'],
					complete : function () {
						if(globalWindowWidth < 768) {
							if (!ajax_menu_loaded) {
								var mobile_nav_content = '';
								if (Modernizr.localstorage) {
									mobile_nav_content = localStorage.getItem("mobile_nav_content");
								}
								if(mobile_nav_content != null && mobile_nav_content.length > 0){
									if(is_mobile_app_mode()){
										console.log('NATIVE APP: loading mobile nav from local storage');
									}
									initMobileMenuContent(mobile_nav_content);
								}else{
									if(is_mobile_app_mode()){
										console.log('NATIVE APP: loading mobile nav via AJAX');
									}
									$.get('/navigation/main_nav_mobile', function(data){
										if(is_mobile_app_mode()){
											console.log('NATIVE APP: received mobile nav via AJAX');
										}
										initMobileMenuContent(data);
									});
								}
								ajax_menu_loaded = true;
							}
							$('.leftMobileBar').click(function(e){
								e.preventDefault();
								$("#user-menu").trigger( "open.mm" );
							});

							menu_scripts_loaded = true;
							mobile_menu_on = true;
						}
					}
				}
			]);
		} else if (globalWindowWidth < 768 && menu_scripts_loaded && !mobile_menu_on) {
			// switched back to smaller screen, fires once after breakpoint change
			mobile_menu_on = true;
		} else if (globalWindowWidth >= 768 && menu_scripts_loaded && mobile_menu_on) {
			// switched to larger screen, fires once after breakpoint change
			mobile_menu_on = false;

			if (/(Chrome|Webkit)/i.test(navigator.userAgent)) {
			    $('.optionsRight').css('display', 'table').height();
			    $('.optionsRight').css('display', 'block');
			}

			if ($("#user-menu").hasClass('mm-opened'))
				$("#user-menu").trigger( "close.mm" );
		}

		// Back to Top link
		if (($('#wrapper').outerHeight() > $(window).height()) && (globalWindowWidth < 768)) {
			$('html:not(.ie8) a.back-to-top').css('display','block');
		} else {
			$('html:not(.ie8) a.back-to-top').css('display','none');
		}

		fix_mobile_title_wrapping();

		//remove large width attributes for table columns in small resolutions
		$('table:not(.notFixed) th, table:not(.notFixed) td').each(function(){
			if(globalWindowWidth < 480){
				if(typeof $(this).attr('width') != 'undefined' && parseInt($(this).attr('width')) > 80){
					$(this).attr('desktop-width', $(this).attr('width'));
					if(parseInt($(this).attr('width')) < 300){
						$(this).attr('width', '25%');
					}else{
						$(this).removeAttr('width');
					}
				}
			}else{
				if(typeof $(this).attr('desktop-width') != 'undefined'){
					$(this).attr('width', $(this).attr('desktop-width'));
					$(this).removeAttr('desktop-width');
				}
			}
		});

	//fix colspan where necesary
		$('table.fixColspan td').each(function(){
			if($(this).siblings('td').length == 0 && typeof $(this).attr('colspan') != 'undefined'){
				if(globalWindowWidth < 768){
					$(this).attr('desktop-colspan', $(this).attr('colspan'));
					$(this).attr('colspan', $(this).parent().next().children('td:visible').length);
				}else{
					if($(this).attr('desktop-colspan') != 'undefined'){
						$(this).attr('colspan', $(this).attr('desktop-colspan'));
						$(this).removeAttr('desktop-colspan');
					}
				}
			}
		});
	}

	//move alerts
  	if(globalWindowWidth < 768){
			//move alerts after subheading
			if($('.pageHeading').prevAll('#alerts').length > 0){
				$('.pageHeading').first().after($('#centreColumn #alerts, #centreColumn div.info, #centreColumn div.warning, #centreColumn div.error'));
				$('#centreColumn div.info, #centreColumn div.warning, #centreColumn div.error').each(function(){
					if(!/display:( |)none/i.test($(this).attr('style'))){
						$(this).show();
					}
				});
			}

			//add clearfix after options ribbon
			$('.optionsRibbon.optionsRight').each(function(){
				if($(this).next('.clearfix.mobile_only, .optionsRibbon.optionsRight').length == 0 && $(this).parent('.inline_tabs_options').length == 0){
					$(this).after('<div class="clearfix mobile_only temp_clearfix"></div>');
				}
			});
			$('.optionsRibbon.optionsRight').siblings('br').addClass('desktop_only');

			//adjust tabnav padding if there are rightOptions
		if($('#centreColumn ul.tabnav').siblings('.optionsRight').length && $('#centreColumn ul.tabnav').parent('.inline_tabs_options').length == 0) {
				$('#centreColumn ul.tabnav').css(rightOptions_padding_side, '7px');
			}

	}else{
			//move alerts before subheading
			if($('.pageHeading').nextAll('#alerts').length > 0){
				$('.pageHeading').first().before($('#centreColumn > #alerts, #centreColumn > div.info, #centreColumn > div.warning, #centreColumn > div.error'));
				$('#centreColumn > div.info, #centreColumn > div.warning, #centreColumn > div.error').each(function(){
					if(!/display:( |)none/i.test($(this).attr('style'))){
						$(this).show();
					}
				});
			}

			if($('.temp_clearfix').length > 0){
				$('.temp_clearfix').remove();
			}

			//add padding to tabnav if there are rightOptions
			if($('#centreColumn ul.tabnav').siblings('.optionsRight').length && $('#centreColumn ul.tabnav').parent('.inline_tabs_options').length == 0) {
				$('#centreColumn ul.tabnav').css(rightOptions_padding_side, $('#centreColumn ul.tabnav').siblings('.optionsRight').outerWidth() + tabnav_padding_start);
			}
  	}

	//remove extra page headings
  if($('.pageHeading').length > 1 && $('#fixedSectionHeader').length == 0){
		$('.pageHeading').each(function(index){
			if(index > 0){
				$(this).children('h2').remove();
				$(this).children('h1').first().before('<div class="clearfix"></div>');
				$(this).children('h1').first().unwrap();
			}
		});
	}

	//adjust tabnav padding based on right options
	$('.tabsRight').each(function(){
		if($(this).siblings('ul.tabnav').length){
			$(this).siblings('ul.tabnav').css(rightOptions_padding_side, $(this).outerWidth());
		}else if($(this).parent().siblings('ul.tabnav').length){
			$(this).parent().siblings('ul.tabnav').css(rightOptions_padding_side, $(this).outerWidth());
		}
	});

	var hasRotated = false;
	//set colspan for the last row
	if($('table.fixColspan tr:last-child td:first-child').length > 0 && typeof $('table.fixColspan tr:last-child td:first-child').attr('colspan') != 'undefined'){
		var $last_row = $('table.fixColspan tr:last-child td:first-child').first();
		var $period_row = $('table.fixColspan tr td:only-child').parent().prev().children('td[colspan]:first-child');
		var mobile_colspan = $('table.fixColspan input').length > 0 ? 3 : 2;
		if(typeof $last_row.attr('desktop-colspan') == 'undefined'){
  			$last_row.attr('desktop-colspan', $last_row.attr('colspan'));
		}
		if($period_row.length){
			$period_row.each(function(){
				if(typeof $(this).attr('desktop-colspan') == 'undefined'){
					$(this).attr('desktop-colspan', $(this).attr('colspan'));
				}
			});
		}
  		if(globalWindowWidth <= 768){
  			$last_row.attr('colspan', mobile_colspan);
  			if($period_row.length){
  				$period_row.attr('colspan', mobile_colspan);
  			}
  			hasRotated = true;
  		}else{
			$last_row.attr('colspan', $last_row.attr('desktop-colspan'));
  			if($period_row.length && hasRotated){
  				$period_row.attr('colspan', $period_row.attr('desktop-colspan'));
  			}
  		}
	}

	//set header title to page header where necessary
	if($('.pageHeading').length && $('.pageHeading').hasClass('mobile_only')){
		if($('.pageHeading').hasClass('switch_heading')){
			$('header .sectionTitle h1').html($('.pageHeading.mobile_only h2').html());
		}else {
			$('header .sectionTitle h1').html($('.pageHeading.mobile_only h1').html());
		}
	}

	if(!page_title_updated){
		if(typeof title_text_override != 'undefined'){
			var title_text = title_text_override;
		}else{
			var title_text = $('header .sectionTitle h1').html();

			if($('#centreColumn .pageHeading:not(.mobile_only) h1').length){
				title_text = $('#centreColumn .pageHeading h1').html() + ' - ' + title_text;
			}

			if($('#centreColumn ul.tabnav li a.selected').length){
				title_text = $('#centreColumn ul.tabnav a.selected').first().html() + ' - ' + title_text;
			}
		}

		$('head title').html(title_text.replace(/<(.*?)>(.*?)<(.*?)>/g, '') + ' - ' + $('head title').html());
		page_title_updated = true;
	}

	Response.create([
		 {
			prop: "device-pixel-ratio",
			prefix: "pixel-density-"
		 },{
			prop: "width",
			breakpoints: [0, 320, 560, 980]
		 }
	]);
}

/* Table options adjustment */
function options_ribbon_adjustment() {
	if ($('.optionsRibbon').length) {
		$('.optionsRibbon').css('overflow', 'visible');
		$('.optionsRibbon').each(function() {
			$(this).find('li:not(.mobile_only)').each(function() {
				if ($(this).offset().top > $(this).parent().find('li:first-child').offset().top) {
					$(this).addClass('overflowOption').clone().appendTo( $(this).siblings('li.mobile_only').find('.dropDown ul') );
				}
			});
			$(this).find('li.mobile_only').each(function() {
				// Hide/Show more link
				if ($(this).find('.dropDown ul').is(':empty') ) {
					$(this).attr('style', 'display: none');
				} else {
					$(this).attr('style', 'display: inline-block !important');
				}

				// Remove previous link if the more link is still on next line
				var i = 0;
				while (i < 3 && $(this).offset().top > $(this).parent().find('li:first-child').offset().top) {
					$(this).parent().find('li.overflowOption:first').prev().addClass('overflowOption').clone().prependTo( $(this).find('.dropDown ul') );
					i++;
				}

				// Dropdown positioning and input width
				var available_left_space = $(this).offset().left + $(this).outerWidth() - parseInt($('#centreColumn').css('paddingLeft')) + 1;
				var available_right_space = globalWindowWidth - parseInt($('#centreColumn').css('paddingRight')) - $(this).offset().left + 1;
				var dropdown_width = $(this).find('.dropDown').outerWidth();
				var surrounding_width = $(this).find('.dropDown input').length ? dropdown_width - $(this).find('.dropDown input').outerWidth() : dropdown_width;
				var min_input_width = $(this).find('.dropDown input').length ? 100 : 0;

				if ($(this).find('.dropDown').outerWidth() > available_left_space && surrounding_width > available_left_space - min_input_width) {
					$(this).find('.dropDown').css({'right':'auto', 'left': '-1px'});
					if ($(this).find('.dropDown input').length) $(this).find('.dropDown input').css({'width': available_right_space - surrounding_width});
				} else {
					$(this).find('.dropDown').attr('style','');
					if ($(this).find('.dropDown input').length) $(this).find('.dropDown input').css({'width': available_left_space - 1 - surrounding_width});
				}
			});
		});
	}
}

function enrollments_table_adjustment(){
	//center course title in enrollments table
	if($('.enrollmentsTable').length > 0){
		$('.enrollmentsTable .newProfileImg').each(function(){
			if(globalWindowWidth < 768){
				if($(this).siblings('span').length > 0){
					$(this).siblings('a').first().css('margin-top', -5);
				}else if($(this).siblings('a').first().height() < 20){
					$(this).siblings('a').first().css('margin-top', 7);
				}
			}else{
				$(this).siblings('a').first().removeAttr('style');
			}
		});
	}
}

function responsive_cell_headers(table) {
  try {
    var THarray = [];
    var ths = table.getElementsByTagName("th");
    for (var i = 0; i < ths.length; i++) {
      var headingText = ths[i].innerHTML;
      THarray.push(headingText);
    }
    var styleElm = document.createElement("style"), styleSheet;
    document.head.appendChild(styleElm);
    styleSheet = styleElm.sheet;
    let randomClass = 'rc' + Math.random().toString(36).substring(7); // when generated if first letter is numeric, insertRule throws error so appending rc.
    $(table).addClass(randomClass);
    for (var i = 0; i < THarray.length; i++) {
      styleSheet.insertRule(
        '.' + randomClass + ' td:nth-child(' + (i + 1) + ')::before {content:"' + THarray[i] + ': ";}', styleSheet.cssRules.length
      );
    }
  } catch (e) {
    console.log("responsive_cell_headers(): " + e);
  }
}

function move_profile_img(imagePath) {
	$(imagePath).each(function() {
		$(this).parent().addClass("oldProfileImg");
		if($(this).parent().next().children('a').length){
			var link = $(this).parent().next().children('a').first().attr('href');
			$(this).clone().prependTo($(this).parent().next()).wrap('<span class="newProfileImg"><a href="'+link+'"></a></span>');
		}else{
			$(this).clone().prependTo($(this).parent().next()).wrap('<span class="newProfileImg"></span>');
		}
	});
}

function move_leftcolumn_img() {
	//move left column image to page heading
	$("#centreColumn .pageHeading").wrapInner("<div></div>");
	$(".flexbox #centreColumn .pageHeading").addClass("flex");

	var leftImg = false;
	if($('body:not(.catalog_class) #leftColumn').find('>:first-child').prop('tagName') == 'IMG'){
		leftImg = $('#leftColumn').find('>:first-child');
	}else if($('body:not(.catalog_class) #leftColumn').find('>:nth-child(2)').prop('tagName') == 'IMG'){
		leftImg = $('#leftColumn').find('>:nth-child(2)');
	}else if($('body:not(.catalog_class) #leftColumn > .user_logo').length > 0){
	leftImg = $('#leftColumn .user_logo');
	}else if($('body:not(.catalog_class) #leftColumn > .img_crop_wrap > img').length > 0){
	leftImg = $('#leftColumn > .img_crop_wrap > img');
	}
	if(leftImg){
		var newImg = leftImg.clone();
		newImg.attr('id', 'fromLeft');
		$('.pageHeading').append(newImg);
	}
}

function mobile_section_list_adjustment(){
	$('td.draggable_section_handle img + a').removeAttr('style');
	$('td.draggable_section_handle img + a').each(function(){
		if($(this).outerHeight() > 25){
			$(this).css('line-height', '16px');
		}
	});
}

function on_resize_actions(){
    responsive_update();
    tabnav_adjustment('#centreColumn');

    $('.optionsRibbon:not(.optionsRibbonTable_separate) li.overflowOption').removeClass('overflowOption');
    $('.optionsRibbon:not(.optionsRibbonTable_separate) .dropDown').html('<ul></ul>');

    options_ribbon_adjustment();
    enrollments_table_adjustment();
    mobile_section_list_adjustment();
}

if(!is_mobile_app_mode()){
    $(window).resize(function(){
        globalWindowWidth = $(window).width();
        on_resize_actions();
	});
}
