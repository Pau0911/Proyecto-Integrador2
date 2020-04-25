var focusTrap = {
  trap: '',
  tabbableNodes: '',
  previouslyFocused: '',
  activeFocusTrap: false,
  config: {},

  activate: function(element, options) {
    // There can be only one focus trap at a time
    if (focusTrap.activeFocusTrap) focusTrap.deactivate({ returnFocus: false });
    focusTrap.activeFocusTrap = true;

    focusTrap.trap = (typeof element === 'string')
      ? document.querySelector(element)
      : element;

    focusTrap.config = options || {};

    focusTrap.previouslyFocused = document.activeElement;

    focusTrap.updateTabbableNodes();

    focusTrap.tryFocus(focusTrap.firstFocusNode());

    document.addEventListener('focus', focusTrap.checkFocus, true);
    document.addEventListener('click', focusTrap.checkClick, true);
    document.addEventListener('mousedown', focusTrap.checkClickInit, true);
    document.addEventListener('touchstart', focusTrap.checkClickInit, true);
    document.addEventListener('keydown', focusTrap.checkKey, true);
  },

  firstFocusNode: function() {
    var node;

    if (!focusTrap.config.initialFocus) {
      node = focusTrap.tabbableNodes[0];
      if (!node) {
        throw new Error('You can\'t have a focus-trap without at least one focusable element');
      }
      return node;
    }

    if (typeof focusTrap.config.initialFocus === 'string') {
      node = document.querySelector(focusTrap.config.initialFocus);
    } else {
      node = focusTrap.config.initialFocus;
    }
    if (!node) {
      throw new Error('The `initialFocus` selector you passed refers to no known node');
    }
    return node;
  },

  deactivate: function(deactivationOptions) {
    deactivationOptions = deactivationOptions || {};
    if (!focusTrap.activeFocusTrap) return;
    focusTrap.activeFocusTrap = false;

    document.removeEventListener('focus', focusTrap.checkFocus, true);
    document.removeEventListener('click', focusTrap.checkClick, true);
    document.addEventListener('mousedown', focusTrap.checkClickInit, true);
    document.addEventListener('touchstart', focusTrap.checkClickInit, true);
    document.removeEventListener('keydown', focusTrap.checkKey, true);

    if (focusTrap.config.onDeactivate) focusTrap.config.onDeactivate();

    if (deactivationOptions.returnFocus !== false) {
      setTimeout(function() {
        focusTrap.tryFocus(focusTrap.previouslyFocused);
      }, 0);
    }
  },

// This needs to be done on mousedown and touchstart instead of click
// so that it precedes the focus event
  checkClickInit: function(e) {
    if (focusTrap.config.clickOutsideDeactivates) {
      focusTrap.deactivate({ returnFocus: false });
    }
  },

  checkClick: function(e) {
    if (focusTrap.config.clickOutsideDeactivates) return;
    if (focusTrap.trap.contains(e.target)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  },

  checkFocus: function(e) {
    if (focusTrap.trap.contains(e.target)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    e.target.blur();
  },

  checkKey: function(e) {
    if (e.key === 'Tab' || e.keyCode === 9) {
      focusTrap.handleTab(e);
    }

    if (focusTrap.config.escapeDeactivates !== false && focusTrap.isEscapeEvent(e)) {
      focusTrap.deactivate();
    }
  },

  handleTab: function(e) {
    e.preventDefault();
    focusTrap.updateTabbableNodes();
    var currentFocusIndex = focusTrap.tabbableNodes.indexOf(e.target);
    var lastTabbableNode = focusTrap.tabbableNodes[focusTrap.tabbableNodes.length - 1];
    var firstTabbableNode = focusTrap.tabbableNodes[0];
    if (e.shiftKey) {
      if (e.target === firstTabbableNode) {
        focusTrap.tryFocus(lastTabbableNode);
        return;
      }
      focusTrap.tryFocus(focusTrap.tabbableNodes[currentFocusIndex - 1]);
      return;
    }
    if (e.target === lastTabbableNode) {
      focusTrap.tryFocus(firstTabbableNode);
      return;
    }
    focusTrap.tryFocus(focusTrap.tabbableNodes[currentFocusIndex + 1]);
  },

  updateTabbableNodes: function() {
    var temp = [];
    $(focusTrap.trap).find(':tabbable, #content_ifr').each(function(){
      temp.push($(this)[0]);
    });
    focusTrap.tabbableNodes = temp;
  },

  tryFocus: function(node) {
    if (!node || !node.focus) return;
    node.focus();
    if (node.tagName.toLowerCase() === 'input') {
      node.select();
    }
  },

  isEscapeEvent: function(e) {
    return e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27;
  }

}
