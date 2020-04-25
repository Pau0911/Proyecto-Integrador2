var Excalibur = {
	init: function () {
		Excalibur.set_view();
		Excalibur.init_events();
	},

	set_view: function(){
		Excalibur.$view = $(document.body);
	},

	init_events: function(){
		Excalibur.$view.on('click', '[excalibur-click]', function(e) {
			var $elem = $(this);
			e.stopPropagation();
			e.preventDefault();
			var to_call = $elem.attr('excalibur-click').replace(/\(.*?\)/, '');
			Excalibur.method_caller(to_call, $elem);
		});
		Excalibur.$view.on('change', '[excalibur-change]', function(e) {
			var $elem = $(this);
			e.stopPropagation();
			var to_call = $elem.attr('excalibur-change').replace(/\(.*?\)/, '');
			Excalibur.method_caller(to_call, $elem);
		});
		Excalibur.$view.on('scroll', '[excalibur-scroll]', function(e) {
			var $elem = $(this);
			e.stopPropagation();
			var to_call = $elem.attr('excalibur-scroll').replace(/\(.*?\)/, '');
			Excalibur.method_caller(to_call, $elem);
		});
		Excalibur.$view.on('contextmenu', '[excalibur-rclick]', function(e) {
			var $elem = $(this);
			e.stopPropagation();
			e.preventDefault();
			var to_call = $elem.attr('excalibur-rclick').replace(/\(.*?\)/, '');
			Excalibur.method_caller(to_call, $elem, e);
		});
		$(window).on('loadcomplete load', function() {
			Excalibur.$view.find('[excalibur-load]').each( function(){
				var $elem = $(this);
				var to_call = $elem.attr('excalibur-load').replace(/\(.*?\)/, '');
				Excalibur.method_caller(to_call, $elem);
			});
		});
		$(window).on('popstate', function(e) {
			var state = JSON.parse( e.originalEvent.state );
			if(!Excalibur.Router.router_mode && state && state.url){
				location.reload();
			}
		});
	},

	get_obj: function(obj_string, itter, obj) {
		var objs = obj_string.split('.');
		var obj = obj ? obj[objs[itter]] : window[objs[itter]];
		itter++;
		if (typeof obj == 'function')
			return obj;
		else if (typeof obj == 'object')
			return Excalibur.get_obj(obj_string, itter, obj);
		else
			return Excalibur.method_exception;
	},

	method_caller: function(to_call, $elem, prevElem) {
		var func = Excalibur.get_obj(to_call, 0);
		if (func == Excalibur.method_exception)
			prevElem = to_call;
		func.call($elem, prevElem);
	},

	method_exception: function(func_name) {
		console.log('Exception un-handled method', $(this), func_name);
	},

	Router: {
		router_mode: false,
		non_routed: '',
		resources: [],

		init: function(){
			Excalibur.Router.router_mode = true;
			Excalibur.Router.non_routed = location.href;
			Excalibur.Router.init_events();
		},

		init_events: function(){
			$(window).on('popstate', function(e) {
				var state = JSON.parse( e.originalEvent.state );
				if( state && state.url ){
					state.callback_func && Excalibur.method_caller(state.callback_func, state.url);
					Excalibur.Router.load( state.url, state.target_div, true );
				}
				else
					location.href = Excalibur.Router.non_routed;
			});
			$(window).on('preload', function( e, data ){
				Excalibur.Router.pre_load( data.html, data.url, data.obj );
			});
		},

		load: function( url, target_div, is_back, callback_func ){
			target_div = target_div || (window.visitor_mode ? '#contentBody' : '#centreColumn');
			url = url || this.attr('href');
			!Excalibur.Router.router_mode && Excalibur.Router.init();
			var loading_div = Excalibur.$view.find( target_div ).length ? Excalibur.$view.find( target_div ) : Excalibur.$view.find( '#centreColumn' );
			var loading = Excalibur.Location_tools.add_load_indicator( loading_div, 900 );
			$.get( url + Excalibur.Location_tools.url_extender ( url ) + 'router=true', function( html ){
				clearTimeout( loading );
				Excalibur.Router.clean_resources();
				target_div = Excalibur.Router.replace_html( html, target_div, url );
				!is_back && window.history.pushState( JSON.stringify({ url: url, target_div: target_div, callback_func: callback_func}), null, url );
				$(window).trigger('loadcomplete');
			});
		},

		replace_html: function( html, target_div, url ){
			target_div = target_div ? target_div : '#centreColumn';
			var temp = $('<div></div>').append( html );
			$(window).trigger('preload', {'html' : html, 'url' : url, 'obj': temp});
			target_div = temp.find( target_div ).length && Excalibur.$view.find( target_div ).length ? target_div : '#centreColumn';
			var container = Excalibur.$view.find( target_div );
			html = temp.find( target_div )[0].outerHTML;
			container.replaceWith( html );
			Excalibur.$view.find('.rightColumn:not(.resizable)').length ? Excalibur.$view.find('#contentWrap').addClass('hasRightColumn') :  Excalibur.$view.find('#contentWrap').removeClass('hasRightColumn');
			//^ dont like this line .hasRightColumn shouldnt be nessesary refactor later....
			return target_div;
		},

		load_left_column: function(){
			var tabs = this.closest('ul.tabnav');
			if( tabs.length ){
				tabs.find('.selected').removeClass('selected');
				this.addClass('selected');
			}
			var parent_container = window.visitor_mode ? '#contentBody' : '#centreColumn';
			var target_div = Excalibur.$view.find( parent_container + ' .rightColumn' ).length ? parent_container + ' .leftColumn' : parent_container;
			Excalibur.Router.load.call( this, null, target_div );
		},

		load_toc: function(){
			//load table of content page
			this.closest('.section_nav').find('ul .selected').removeClass('selected');
			this.addClass('selected');
			$(window).one('preload', function( e, data ){
				Excalibur.Router.toc_update( data.obj );
			});
			Excalibur.Router.load.call(this, null, null, null, 'Excalibur.Router.toc_back');
		},

		toc_back: function(){
			Excalibur.$view.find('.section_nav ul .selected').removeClass('selected');
			var target = Excalibur.$view.find('.section_nav ul [href="' + this + '"]');
			target.addClass('selected');
			$(window).one('preload', function( e, data ){
				Excalibur.Router.toc_update( data.obj );
			});
		},

		toc_update: function( $html ){
			setTimeout( function(){
				var current_modules = Excalibur.$view.find('.section_nav .module_sections');
				var incoming_modules = $html.find('.section_nav .module_sections');
				var parent_div = current_modules.first().parent().closest('ul');
				incoming_modules.each( function( i ){
					var $elem = $(this);
					if(i > current_modules.length)
						parent_div.append($elem.closest('li'));
					else
						$(current_modules[i]).replaceWith($elem);
				});
				Excalibur.$view.find('header > .section_progress').replaceWith( $html.find('header > .section_progress') );
				Excalibur.$view.find('.section_nav .section_progress').replaceWith( $html.find('.section_nav .section_progress') );
			}, 5);
		},

		load_page: function( url ){
			$(window).trigger('pageloadstart');
			url = url || this.attr('href');
			Excalibur.Router.load( url, '#wrapper' );
		},

		pre_load: function( html, url, obj ){
			// debug why pdf loading is not working then remove flowpaper bypass
			if( html.indexOf('FlowPaperViewer') > -1 )
				location.href = url;
			window.tinyMCE && tinyMCE.remove();
			// ^ kills tinyMCE instance before page loads or error will acoure
			var $currentHtml = $('html');
			var body_classes = html.match(/body class\='(.*?)'/);
			body_classes && body_classes[1] && $currentHtml.find('body').attr('class', body_classes[1] + ' page-loaded');
			// ^ Replace classes with incoming classes if avalible
			obj.find('script[src]').each(function(){
				var temp_url = $(this).attr('src');
				if( !$currentHtml.find( 'script[src*="' + temp_url + '"]' ).length ){
					Excalibur.Location_tools.js_load(temp_url);
					Excalibur.Router.resources.push(temp_url);
				}
			});
			obj.find('link[href][rel="stylesheet"]').each(function(){
				var temp_url = $(this).attr('href');
				if( !$currentHtml.find( 'link[href*="' + temp_url + '"]' ).length ){
					$('<link href="' + temp_url + '" media="screen" rel="stylesheet" type="text/css">').prependTo('body');
					Excalibur.Router.resources.push(temp_url);
				}
			});
		},

		clean_resources: function(){
			$.each( Excalibur.Router.resources, function( i, url ){
				$('script[src*="' + url + '"], link[href*="' + url + '"]').remove();
			});
			Excalibur.Router.resources = [];
		}

	},

	Location_tools: {
		url_extender: function(url){
			return (url.indexOf('?') > -1 ? '&' : '?');
		},

		get_rel_path: function( url ){
			return url.replace(/^(?:\/\/|[^\/]+)*\//, "");
		},

		js_reload: function( src ){
			setTimeout( function(){
				$('script[src*="' + src + '"]').remove();
				Excalibur.Location_tools.js_load( src );
			}, 05);
		},

		js_load: function( src ){
			$('<script src="' + src + '">').appendTo('body');
		},

		add_load_indicator: function( container, to_start ){
			return setTimeout( function(){
				container.addClass('load-indicator');
			}, to_start);
		},

		require_js: function( url, callback ){
			try{
				callback();
			}
			catch(error){
				$.getScript( url, function() {
					callback();
				});
			}
		},

		pass_url: function( url, to_url ){
			url = url ? url : location.href;
			to_url = to_url ? to_url : this.attr('href');
			location.href = to_url + Excalibur.Location_tools.url_extender( to_url ) + 'back_url=' + url;
		}
	}
};

// initialize Excalibur
$(function () {
	Excalibur.init();
});