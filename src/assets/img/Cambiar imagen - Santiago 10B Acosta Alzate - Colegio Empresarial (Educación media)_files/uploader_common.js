function append_multiple_files(json) {
  $.each(json, function(key, value) {
    var id = key.replace(/[^a-z0-9]/gi,'');
    var name = value.split(/[\/]+/).pop();

    var element = '<div id="' + id + '" class="progress-bar-container done"><div class="progress-bar" style="width: 100%"></div><div class="text">' + name + '<a class="uploader_close_image_link" href="javascript:void(0);"><img class="close_image" title="close" src="/images/close_tip_gray.gif" /></a><b><span>100%</span></b></div></div>';

    $('#' + uploader_main_wrapper).css("display", "block");
    $('#' + uploader_main_wrapper).append(element);
    $('#' + id).append('<input type="hidden" name="attachments[]" value="' + value + '" data-id="' + id + '">');
  });
}

function append_single_files(json) {
  var element = '<div id="SingleFileUpload" class="progress-bar-container done"><div class="progress-bar" style="width: 100%"></div><div class="text">' + json.name + '<a class="uploader_close_image_link" href="javascript:void(0);"><img class="close_image" title="close" src="/images/close_tip_gray.gif" /></a><b><span>100%</span></b></div></div>';

  $('#' + uploader_main_wrapper).css("display", "block");
  $('#' + uploader_main_wrapper).append(element);
  $('#SingleFileUpload').append('<input type="hidden" name="' + uplodare_custom_name + '" id="' + uplodare_custom_name + '" value="' + json.path + '">');
  $('.' + uploader_button_class).parents('.optionsRibbon').hide();
}

function drive_append_hiddens(form, data) {
  if (form.find('#attachment_url').length > 0) {
    form.find('#attachment_url').remove();
  }

  form.find('.facebox-content').append('<input type="hidden" name="attachment_url" id="attachment_url" value="' + data.path + '">');
  form.find('.facebox-content').append('<input type="hidden" name="attachment_name" id="attachment_name" value="' + data.name + '">');
}

function ajax_add_bottom_loader(container) {
  container.append('<li class="drive-infinte-loader" style="text-align:center;"><img src="/images/loading-animation-white-retina.gif" alt="" width="100" /></li>');
}

function ajax_remove_bottom_loader() {
  $('#facebox .drive-infinte-loader').remove();
}

function display_settings_tab() {
  var options = $('#facebox ul.modules');
  var settings_tab = $('.file_upload_settings');

  if (options.find('li.show').length > 0) {
    if (!settings_tab.hasClass('show_settings_tab')) {
      settings_tab.removeClass('hide_settings_tab').addClass('show_settings_tab');
    }
  } else {
    if (settings_tab.hasClass('show_settings_tab')) {
      settings_tab.addClass('hide_settings_tab').removeClass('show_settings_tab');
    }
  }
}

function is_video(element) {
  return ((element.type.indexOf('video') > -1) ? true : false)
}

/* type watch */
var typewatch = (function(){
  var time = 0;

  return function(callback, ms){
    clearTimeout (time);
    time = setTimeout(callback, ms);
  };
})();
