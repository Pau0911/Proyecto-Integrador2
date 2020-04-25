var default_runtimes = 'html5,flash,silverlight,html4';
var default_main_wrapper = 'UploaderContainer';
var default_browse_button = 'dropzone';
var default_drop_element = 'dropzone';
var default_launch_filters = [];

var changed = false;

var default_lib_path = '/libraries/plupload/2.2.1';
var default_file_data_name = 'file';
var default_upload_url = aws_url;

if (uploader_file_type == 'image') {
  default_launch_filters = [{
    title : "Image files",
    extensions : "jpg,jpeg,gif,png,bmp,ico"
  }];
}

if (typeof aws_keys == 'undefined') {
  var aws_keys = {};
}

if (typeof uploader_file_paths == 'undefined') {
  var uploader_file_paths = {};
}

if (typeof uploader_file_upload_error == 'undefined') {
  var uploader_file_upload_error = 0;
}

var multipart_params_for_v2_signature = {
  "policy": aws_policy,
  "acl": aws_acl,
  "utf8": true,
  "Filename": '',
  "Content-Type": ''
};

if(!use_v4_signature) {
  plupload.extend(multipart_params_for_v2_signature, {
    "AWSAccessKeyId": aws_key,
    "signature": aws_signature
  })
}

var multipart_params_for_v4_signature = {};
if(use_v4_signature) {
  multipart_params_for_v4_signature = {
    "x-amz-algorithm":  "AWS4-HMAC-SHA256",
    "x-amz-credential": aws_credential,
    "x-amz-date":       aws_date,
    "x-amz-signature":  aws_signature
  };
}

var multipart_params = plupload.extend(
  {},
  multipart_params_for_v2_signature,
  multipart_params_for_v4_signature
);

var uploader = new plupload.Uploader({
  runtimes:               default_runtimes,
  container:              default_main_wrapper,
  browse_button:          default_browse_button,
  drop_element:           default_drop_element,
  max_file_size:          uploader_max_file_size + 'mb',
  url:                    default_upload_url,
  multi_selection:        uploader_multi_upload,
  file_data_name:         default_file_data_name,
  flash_swf_url:          default_lib_path + '/Moxie.swf',
  silverlight_xap_url:    default_lib_path + '/Moxie.xap',
  filters:                default_launch_filters,
  file_name_name:         false,
  multipart:              true,
  multipart_params:       multipart_params,
  resize:                 {preserve_headers: false}                
});

uploader.init();

uploader.bind('Init', function(up, params) {
  if (uploader.features.dragdrop) {
    var target = $("#dropzone");

    target.ondragover = function(event) {
      event.dataTransfer.dropEffect = "copy";
    };

    target.ondragenter = function() {
      this.className = "dragover";
    };

    target.ondragleave = function() {
      this.className = "";
    };

    target.ondrop = function() {
      this.className = "";
    };
  }
});

uploader.bind('FilesAdded', function(up, files) {
  var wrapper = $('#' + uploader_main_wrapper);
  var filelist = wrapper.find('#filelist');
  var dropzone = wrapper.find('#dropzone');

  for (var i in files) {
    var blob_info = get_blob_info(files[i]);

    uploader_file_paths[files[i].id] = blob_info.path;
    uploader.files[i].name = blob_info.name;
    uploader.files[i].type = blob_info.type;
    aws_keys[files[i].id] = aws_location + "/" + blob_info.name;
  }

  if (uploader_multi_upload) {
    for (var i in files) {
      var size = plupload.formatSize(files[i].size);
      var name = (check_if_video_and_transcoding(files[i], files[i].name) ? files[i].name.replace(/\.[^\.]+$/, '.mp4').replace('_transcode_tmp_', '') : files[i].name);
      var id = files[i].id;

      wrapper.append('<div id="' + id + '" class="progress-bar-container"><div class="progress-bar"></div><div class="text">' + name + ' (' + size + ') <a class="uploader_close_image_link" href="javascript:void(0);"><img class="close_image" title="close" src="/images/close_tip_gray.gif" /></a><b></b></div></div>');
    }
  } else {
    var size = plupload.formatSize(files[0].size);
    var name = (check_if_video_and_transcoding(files[0], files[0].name) ? files[0].name.replace(/\.[^\.]+$/, '.mp4').replace('_transcode_tmp_', '') : files[0].name);
    var id = files[0].id;

    if (uploader_auto_submit) {
      filelist.html('<div id="' + id + '" class="progress-bar-container"><div class="progress-bar"></div><div class="text">' + name + ' (' + size + ')<b></b></div></div>');
    } else if (uploader_single_file) {
      wrapper.append('<div id="' + id + '" class="progress-bar-container"><div class="progress-bar"></div><div class="text">' + name + ' (' + size + ') <a class="uploader_close_image_link" href="javascript:void(0);"><img class="close_image" title="close" src="/images/close_tip_gray.gif" /></a><b></b></div></div>');
      $('.' + uploader_button_class).parents('.optionsRibbon').hide();
      $('.' + uploader_button_class).parents('.uploader-attachment-links').hide();
    } else {
      if (uploader_frame) {
        filelist.html('<div id="' + id + '" class="progress-bar-container"><div class="progress-bar"></div><div class="text">' + name + ' (' + size + ') <b></b></div></div>');
        filelist.css("display", "block");
        dropzone.css({height: "auto", padding: "24px 0"});
      } else {
        filelist.html('<div id="' + id + '" class="progress-bar-container"><div class="progress-bar"></div><div class="text">' + name + ' (' + size + ') <a class="uploader_close_image_link" href="javascript:void(0);" onclick="click_remove(this)"><img class="close_image" title="close" src="/images/close_tip_gray.gif" /></a><b></b></div></div>');
      }
    }

    dropzone.not('.frame').hide();
  }

  if (uploader_multi_upload || uploader_single_file) {
    wrapper.css("display", "block");
    $.facebox.close();
  }

  for (var i in files) {
    if ((typeof files[i].name == 'undefined') || (files[i].name == 'undefined')) {
      $('#' + files[i].id).remove();
      uploader_file_upload_error += 1;
    }
  }

  uploader.start();
});

uploader.bind("BeforeUpload", function (up, file) {
  if ((typeof file.name == 'undefined') || (file.name == 'undefined')) {
    uploader.stop();
    uploader.removeFile(file);
    uploader.start();
  }

  uploader.settings.multipart_params.key = aws_keys[file.id];
  uploader.settings.multipart_params["Content-Type"] = file.type;
});

uploader.bind('UploadProgress', function(up, file) {
  var wrapper = $('#' + uploader_main_wrapper);
  var width = wrapper.width();

  $("#" + file.id).find("b").first().html("<span>" + file.percent + "%</span>");
  $("#" + file.id).find('.progress-bar').first().width(width * file.percent/100);

  if( file.percent >= 100 ) {
    $("#" + file.id).find('.progress-bar').first().addClass("_processing");
  }
});

uploader.bind('FileUploaded', function(up, file, info) {
  var path = (check_if_video_and_transcoding(file, uploader_file_paths[file.id]) ? uploader_file_paths[file.id].replace(/\.[^\.]+$/, '.mp4').replace('_transcode_tmp_', '') : uploader_file_paths[file.id]);
  var name = (check_if_video_and_transcoding(file, file.name) ? file.name.replace(/\.[^\.]+$/, '.mp4').replace('_transcode_tmp_', '') : file.name);
  var id = file.id;

  if (check_if_video_and_transcoding(file, uploader_file_paths[file.id])) {
    $.post('/upload/trigger_video_transcoding', {file_path: uploader_file_paths[file.id], file_type: file.type}); // this starts the video transcoding
  }

  if (uploader_frame && (uploader_file_type == 'image')) {
    initImages({path: path}, file, '.mce-md-local');
  }

  if (uploader_multi_upload) {
    $("#" + id).append('<input type="hidden" name="attachments[]" value="' + path + '" data-id="' + id + '">');
  } else {
    if (uploader_auto_submit) {
      $('#facebox .facebox-content').append('<input type="hidden" name="attachment_url" id="attachment_url" value="' + path + '">');
      $('#facebox .facebox-content').append('<input type="hidden" name="attachment_name" id="attachment_name" value="' + name + '">');
      $('form#file_uploader_form').submit();
    } else {
      $("#" + id).append('<input type="hidden" name="' + uplodare_custom_name + '" id="' + uplodare_custom_name + '" value="' + path + '">');

      if (!uploader_frame) {
        $('#facebox #upload_file .footer button').removeClass('disabled');
      } else {
        $("#" + id).append('<input type="hidden" name="attachment_name" id="attachment_name" value="' + path + '">');
      }
    }
  }

  $("#" + id).addClass('done').find('.progress-bar').first().removeClass("_processing");
});

uploader.bind('UploadComplete', function(up, files) {
  if (uploader_file_upload_error >= 1) {
    $.alert({content: uploader_file_upload_error +" file(s) couldn't be uploaded. Please retry with the missing ones!"})
    uploader_file_upload_error = 0;
  }
});

uploader.bind('Error', function(up, params) {
  if ( params.code == '-600' ) {
    $.alert({content: 'Max file size of ' + uploader_max_file_size + 'mb exceeded.'});
  } else if ( params.code == '-601' ) {
    if (typeof upload_limitation_image != 'undefined' && upload_limitation_image == true) {
      $.alert({content: 'Incorrect file format. Must be an image with .jpg, .jpeg, .gif, .png or .bmp extensions.'});
    } else {
      $.alert({content: 'Incorrect file format.'});
    }
  } else {
    $.alert({content: params.message});
  }
});

function check_if_video_and_transcoding(file, string) {
  return ((is_video(file) && (string.indexOf('_transcode_tmp_') != -1)) ? true : false)
}

//////////////
// functions:
//////////////
function get_blob_info(file) {
  var result;
  var data = {file_type: file.type, file_size: file.size, file_name: file.name};

  if (uploader_place == 'tinymce') {
    data.from_tinymce = true;
  }

  $.ajax({
    type: "POST",
    url: "/upload/file",
    async: false,
    data: data,
    dataType: "json",
    success: function(json) {
      result = json;
    },
    error: function(error) {
      result = {};
    }
  });

  return result;
}

// TODO: AT: refactor this

$("body").on("click", ".progress-bar-container .uploader_close_image_link", function() {
  main_wrapper = $(this).parents(".uploader-list").attr('id');
  button_class = $(this).parents(".uploader-list").next().children().children().children().attr('class');

  if ((uploader_button_class != button_class) && (uploader_main_wrapper != main_wrapper)){
    uploader_main_wrapper = main_wrapper;
    uploader_button_class = button_class;
  }

  if (!changed) {
    click_remove(this);
    changed = true;
  }
});

$(document).bind('close.facebox', function() {
  if ((uploader.state == plupload.STARTED) && (uploader.files.length == 1)) {
    delete_blob(uploader.files[0]);
    uploader.stop();
  }
});

function delete_blob(file) {
  $.post('/upload/delete', {file_path: uploader_file_paths[file.id]});
}

function click_remove(el) {
  var parent = $(el).parents(".progress-bar-container");
  var id = parent.attr('id');

  $.confirm({
    content : 'Are you sure you want to remove this attachment?',
    confirm : function() {
      parent.first().remove();
      $('#' + uploader_main_wrapper).find('input[data-id="' + id + '"]').remove();

      changed = false;

      if (!uploader_auto_submit) {
        $('#' + uploader_main_wrapper).find('#dropzone').not('.frame').show();
        $('#facebox #upload_file .footer button').addClass('disabled');
      }

      if (uploader_single_file) {
        $('.' + uploader_button_class).parents('.optionsRibbon').show();
        $('.' + uploader_button_class).parents('.uploader-attachment-links').show();
      }
    },
    cancel: function() {
      changed = false;
    }
  });
}

function uploader_file_submit_form(el) {
  if (!$(el).hasClass('disabled')) {
    $(el).parents('form').submit();
  }
}
