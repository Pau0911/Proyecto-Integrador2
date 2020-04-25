if (typeof uploader_multi_upload == 'undefined') {
  var uploader_multi_upload = false;
}

var resources_content_loaded = false;
var resources_infinite_stop = false;
var resources_infinite_pause = true;
var resources_selected_files = [];
var resources_filter_name = 'uploader_filter_name';
var resources_filter_timer = 700;

function load_resources() {
  if (resources_content_loaded == true) {
    return false;
  }

  resources_content_loaded = true;
  load_resources_content('root');
  init_resources_infinite_scroll();

  $('#' + resources_filter_name).keyup(function(e) {
    if ($(this).val() != '') {
      typewatch(function() {
        load_resources_content('root');
      }, resources_filter_timer);
    } else {
      load_resources_content('root');
    }
  });

  $('#uploader_user, #uploader_organization, #uploader_school, #uploader_district, #uploader_all, #uploader_favorites, #uploader_subject').change(function() { load_resources_content('root'); });
}

function init_resources_infinite_scroll() {
  var wrapper = $('#facebox .resources_file_list');

  $("#facebox .facebox-content.resources-scroll").scroll(function() {
    if (resources_infinite_pause && !resources_infinite_stop) {
      if ($(this).scrollTop() >= ($(this)[0].scrollHeight - $(this).height() - 50)) {
        resources_infinite_pause = false;
        load_resources_next_content(wrapper);
      }
    }
  });
}

function load_resources_content(parent) {
  var wrapper = $('#facebox .resources_file_list');
  var data = {};
  var list_url;
  var libraries = [];

  wrapper.html('');
  data.parent = parent;
  wrapper.data('parent', parent);

  if (uploader_file_type == 'file') {
    list_url = "/uploader_resources/list";
  } else if (uploader_file_type == 'image') {
    list_url = "/uploader_resources/list_images";
  }

  if ($('#' + resources_filter_name).val() != '') {
    data.name = $('#' + resources_filter_name).val();
  }

  $.each($('.uploader_library_checkbox'), function() {
    if (this.checked) {
      libraries.push(this.name.replace('uploader_', ''));
    }
  });

  data.library = libraries.join();

  if ($('#uploader_subject').length == 1) {
    data.subject = $('#uploader_subject').val();
  }

  $.ajax({
    type: "POST",
    url: list_url,
    data: data,
    dataType: "json",
    beforeSend: function(){
      ajax_add_loader(wrapper);
    },
    success: function(json) {
      var html = '';
      var files;
      var offset = '';

      if (json.status == 'ok') {
        html += '<ul class="drive-tree-view">';
        files = json.data.results;
        offset = json.data.offset;
        html += resources_draw_children(files);
        html += '</ul>';

        wrapper.removeClass('drive-loading');
        wrapper.append(html);
        close_ajax_loader();

        if (offset != null) {
          resources_infinite_pause = true;
          resources_infinite_stop = false;
        } else {
          resources_infinite_stop = true;
        }

        if (wrapper.length > 0) {
          wrapper.data('offset', offset);
        }

        if (uploader_multi_upload){
          trace_resources_checkbox_change_events();
        }

        if (uploader_frame == true && uploader_file_type == 'image') {
          tinymce_resources_append_event();
        }
      }
    }
  });
}

function load_resources_next_content(wrapper) {
  var ul = wrapper.find('ul');
  var list_url;
  var data = {};

  if (uploader_file_type == 'file') {
    list_url = "/uploader_resources/list";
  } else if (uploader_file_type == 'image') {
    list_url = "/uploader_resources/list_images";
  }

  data.offset = wrapper.data('offset');
  data.limit = 30;
  data.parent = wrapper.data('parent');

  if ($('#' + resources_filter_name).val() != '') {
    data.name = $('#' + resources_filter_name).val();
  }

  $.ajax({
    type: "POST",
    url: list_url,
    data: data,
    dataType: "json",
    beforeSend: function(){
      ajax_add_bottom_loader(ul);
    },
    success: function(json) {
      var html;
      var files;
      var offset = '';

      if (json.status == 'ok') {
        files = json.data.results;
        offset = json.data.offset;
        html = resources_draw_children(files);

        ul.append(html);
        wrapper.data('offset', offset);
        ajax_remove_bottom_loader();

        if (offset == null) {
          resources_infinite_pause = false;
          resources_infinite_stop = true;
        } else {
          resources_infinite_pause = true;
        }

        if (uploader_multi_upload){
          trace_resources_checkbox_change_events();
        }

        if (uploader_frame == true && uploader_file_type == 'image') {
          tinymce_resources_append_event();
        }

      }
    }
  });
}

function resources_draw_children(obj, id, level) {
  if (level && id) {
    var html = '<ul id="' + id + '">';
  } else {
    html = '';
  }

  $.each(obj, function(key, val) {
    var url, klass, check;

    val = val.file_resource || val.web_resource;

    link = val.url;
    if (is_mobile_app_mode()){
      url = 'javascript:window.parent.postMessage(\'{&quot;method&quot;: &quot;loadBrowser&quot;, &quot;href&quot;: &quot;' + link + '&quot;}\', \'*\')';
    } else{
      url = 'javascript:window.open(\'' + link + '\', \'' + val.name + '\', \'location=no, directories=no, scrollbars=yes, resizable=no, copyhistory=no, width=900, height=750\')';
    }
    klass = 'file';
    check = true;

    html += '<li>';

    if (uploader_multi_upload == true) {
      input_type = 'checkbox';
    } else {
      input_type = 'radio';
    }

    if (check) {
      html += '<input type="' + input_type + '" name="resources_file_id" id="' + val.id + '" value="' + val.id + '" data-name="' + val.name + '" data-path="' + link + '"';

      if ((uploader_multi_upload == true) && (resources_selected_files.indexOf(val.id) > -1)) {
        html += " checked";
      }

      html += '><label for="' + val.id + '"></label>';
    }

    html += '<div>';
    html += '<img src="/images/uploader/onedrive-file.png" width="16" height="16" class="drive-element-icon ' + klass + '">';
    html += '<a href="' + url + '" class="' + klass + '">' + val.name + '</a>';
    html += '</div>';
    html += '</li>';
  });

  if (level) {
    html += '</ul>';
  }

  return html;
}

function resources_submit(el) {
  var button = $(el);
  var type = button.data('type');
  var selected = $('input[name="resources_file_id"]:radio:checked');

  if (uploader_single_file) {
    var form = button.parents('.tab-content');
  } else {
    var form = button.parents('form');
    var form_action = form.attr('action');
  }

  if (selected.length == 0) {
    $.alert({content: 'You must select a file'});
    return false;
  }

  if ((uploader_file_type == 'image') && !is_image(selected.data())) {
    $.alert({content: 'You must select an image'});
    return false;
  }

  if (uploader_auto_submit || uploader_auto_1_submit) {
    drive_append_hiddens(form, selected.data());
    form.submit();
  } else if (uploader_single_file) {
    append_single_files(selected.data());
    $.facebox.close();
  }
}

function resources_submit_multiple(el) {
  if (resources_selected_files.length == 0) {
    $.alert({content: 'You must select a file'});
    return false;
  }

  var wrapper = $('#resources_uploader_form');
  var objects = {};

  $.each(resources_selected_files, function(key, value) {
    objects[value] = wrapper.find('input#' + value).data('path');
  });

  append_multiple_files(objects);
  $.facebox.close();
}

function trace_resources_checkbox_change_events() {
  $('#facebox #resources_file input[type="checkbox"]').change(function() {
    var id = $(this).attr('id');

    if ($(this).is(':checked')) {
      save_resources_item(id);
    } else {
      remove_resources_item(id);
    }
  });
}

function save_resources_item(id) {
  if (resources_selected_files.indexOf(id) == -1) {
    resources_selected_files.push(id);
  }
}

function remove_resources_item(id) {
  var index = resources_selected_files.indexOf(id);

  if ( index != -1) {
    resources_selected_files.splice(index, 1);
  }
}

function is_image(file) {
  var ext = file.path.slice((file.path.lastIndexOf(".") - 1 >>> 0) + 2);
  var img_ext = ["jpg", "jpeg", "png", "bmp", "gif", "ico"]
  return (img_ext.indexOf(ext.toLowerCase()) > -1 ? true : false);
}

// used only in tinymce for images plugin

function tinymce_resources_append_event() {
  $('input[name="resources_file_id"]:radio').change(function() {
    var main = $('#Uploader').parent('body#facebox');
    var container = main.find("#resources_uploader_form");
    var data = $(this).data();

    drive_append_image_hiddens(container, data);
    initImages(data, null, '.mce-md-resources-add');
  });
}