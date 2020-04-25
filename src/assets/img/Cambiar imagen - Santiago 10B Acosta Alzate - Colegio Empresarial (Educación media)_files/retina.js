on_ready(function() {

  var root = (typeof exports == 'undefined' ? window : exports);

  var config = {
    // Ensure Content-Type is an image before trying to load @2x image
    // https://github.com/imulus/retinajs/pull/45)
    check_mime_type: true
  };

  var retina_files = ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png', '11.png', '12.png', '13.png', '14.png', '15.png', '16.png', '17.png', '18.png', '19.png', '20.png', '21.png', '22.png', '23.png', '24.png', '25.png', '26.png', '27.png', '28.png', '29.png', '30.png', 'assignments.png', 'attendance.png', 'bell.png', 'book.png', 'book2.png', 'calendar.png', 'cog.png', 'comments.png', 'debate.png', 'existing.png', 'folderBlue.png', 'folderDown.png', 'folderGreen.png', 'folderUp.png', 'group.png', 'group3.png', 'learningPath.png', 'notes.png', 'offline.png', 'outline.png', 'package.png', 'page_edit.png', 'pageText.png', 'pencil.png', 'phone.png', 'pieChart.png', 'question-bank', 'quiz.png', 'resources.png', 'rss.png', 'scorm.png', 'signal2.png', 'survey.png', 'team.png', 'thumbsUp.png', 'turnitin.png', 'unicheck.png'];

  root.Retina = Retina;

  function Retina() {}

  Retina.configure = function(options) {
    if (options == null) options = {};
    for (var prop in options) config[prop] = options[prop];
  };

  Retina.init = function(context) {
    if (context == null) context = root;

    var existing_onload = context.onload || new Function;

    context.onload = function() {
      var images = document.getElementsByTagName("img"), retinaImages = [], i, image;
      for (i = 0; i < images.length; i++) {
        if(!/lessonSectionImg/.test(images[i].className)){
          image = images[i];
          retinaImages.push(new RetinaImage(image));
        }
      }
      existing_onload();
    };
  };

  Retina.isRetina = function(){
    var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
                      (min--moz-device-pixel-ratio: 1.5),\
                      (-o-min-device-pixel-ratio: 3/2),\
                      (min-resolution: 1.5dppx)";

    if (root.devicePixelRatio > 1)
      return true;

    if (root.matchMedia && root.matchMedia(mediaQuery).matches)
      return true;

    return false;
  };

  root.RetinaImagePath = RetinaImagePath;

  function RetinaImagePath(path, at_2x_path) {
    this.path = path;
    if (typeof at_2x_path !== "undefined" && at_2x_path !== null) {
      this.at_2x_path = at_2x_path;
      this.perform_check = false;
    } else {
      //this.at_2x_path = path.replace(/\.\w+$/, function(match) { return "@2x" + match; });
      // if(/chosen_by/.test(path)){
      //   this.at_2x_path = '/images/chosen_by/retina/' + path.replace(/^.*[\\\/]/, '');
      // }else{
      this.at_2x_path = '/images/icons/retina/' + path.replace(/^.*[\\\/]/, '');
      //}
      this.perform_check = true;
    }
  }

  RetinaImagePath.confirmed_paths = [];

  RetinaImagePath.prototype.is_external = function() {
    return !!(this.path.match(/^https?\:/i) && !this.path.match('//' + document.domain) );
  };

  RetinaImagePath.prototype.check_2x_variant = function(callback) {
    var http, that = this;
    if (this.is_external()) {
      return callback(false);
    } else if (!this.perform_check && typeof this.at_2x_path !== "undefined" && this.at_2x_path !== null) {
      return callback(true);
    } else if (this.at_2x_path in RetinaImagePath.confirmed_paths) {
      return callback(true);
    } else {
      var filename = this.at_2x_path.replace(/^.*[\\\/]/, '');
      var has_retina = false;
      for(var i=0;i<retina_files.length;i++){
        if(retina_files[i] == filename) has_retina = true;
      }
      if(has_retina){
        RetinaImagePath.confirmed_paths.push(that.at_2x_path);
        return callback(true);
      }else{
        return callback(false);
      }
    }
  };

  function RetinaImage(el) {
    this.el = el;
    this.path = new RetinaImagePath(this.el.getAttribute('src'), this.el.getAttribute('data-at2x'));
    var that = this;
    this.path.check_2x_variant(function(hasVariant) {
      if (hasVariant) that.swap();
    });
  }

  root.RetinaImage = RetinaImage;

  RetinaImage.prototype.swap = function(path) {
    if (typeof path == 'undefined') path = this.path.at_2x_path;

    var that = this;
    function load() {
      if (! that.el.complete) {
        setTimeout(load, 5);
      } else {
        that.el.setAttribute('width', that.el.offsetWidth);
        that.el.setAttribute('height', that.el.offsetHeight);
        that.el.setAttribute('src', path);
      }
    }
    load();
  };

  if (Retina.isRetina()) {
    Retina.init(root);
  }

});
