(function () {
  var _root = this;
  var _truss;
  var _plugins = [];
  var _displayStates = { none: false, block: true, inline: true };

  if (typeof exports !== 'undefined') {
    _truss = exports;
  } else {
    _truss = _root.truss = {};
  }

  _truss.version = '1.0.1';
  _truss.$ = _root.jQuery || _root.$;
  _root.truss = _truss;

  _truss.registerPlugin = function registerPlugin(name, plugin) {
    _plugins[name] = plugin;
  };

  var attr = function (element, name, value) {
    if (arguments.length === 3) {
      element.setAttribute(name, value);
    } else if (element.hasAttribute(name)) {
      value = element.getAttribute(name);
    }
    return value;
  };

  var forEach = function (data, fn) {
    if (!Array.prototype.forEach) {
      var length = data.length >>> 0;
      while (++i < length) {
        if (i in data) {
          fn.apply(data[i], [data[i], i]);
        }
      }
    } else {
      data.forEach(fn);
    }
  };

  var visible = function (element, isVisible) {
    if (arguments.length === 1) {
      return element.style.display ? _displayStates[element.style.display.toLowerCase()] : true;
    }
    element.style.display = isVisible ? 'block' : 'none';
    return isVisible;
  };

  var data = function (element) {
    return $(element).data();
  };

  var text = function (element, value) {
    if (element.childNodes.length) {
      if (element.firstChild.nodeType === 3) {
        element.firstChild.nodeValue = value;
      }
    } else {
      element.appendChild(document.createTextNode(value));
    }
  };

  var fetch = function (container) {
    return $.ajax({ url: container.src });
  };

  var resolve = function (data, reference) {
    var parts = reference.split('.');
    var length = parts.length;

    var index = function (d, name, i) {
      return d[name];
    };
    return reference.split('.').reduce(index, data);
  };

  var Container = function (element, config) {
    this.src = config.src;
    this.element = element;
    return this;
  };

  Container.prototype.getValue = function (element, data, name) {
    var value = resolve(data, name);
    var pluginName = attr(element, 'data-plugin');
    if (pluginName && _plugins[pluginName]) {
      value = _plugins[pluginName].call(this, element, value);
    }
    return value;
  };

  Container.prototype.setValue = function (element, value) {
    var format = attr(element, 'data-format');
    if (format) {
      value = format.replace(/\$s/g, value)
    }
    switch (element.tagName.toLowerCase()) {
      case 'img':
        attr(element, 'src', value);
        break;
      default:
        text(element, value);
    }
  };

  Container.prototype.bindField = function (element, data) {
    var name = attr(element, 'data-name');
    if (name) {
      var value = this.getValue(element, data, name);
      if (value) {
        this.setValue(element, value);
      }
      else {
        $(element).hide();
      }
    }
  };

  Container.prototype.bindRow = function (row, data) {
    var that = this;
    this.bindField(row, data);
    $(row).find('[data-name]').each(function () {
      that.bindField(this, data);
    });
  };

  Container.prototype.addRow = function (data, after) {
    var row = this.element.cloneNode(true);
    // remove src for all new rows
    row.removeAttribute('data-src');
    this.bindRow(row, data);
    this.element.parentNode.insertBefore(row, after.nextSibling);
    return row;
  };

  Container.prototype.bind = function () {
    var that = this;
    fetch(this).done(function (data) {
      // always work with a collection
      data = 'length' in data ? data : [data];
      if (data.length) {
        // get the first record, this is applied to the first template row
        var first = data.shift();
        // loop through remaining records
        var row;
        forEach(data, function (obj, i) {
          row = that.addRow(obj, /* after: previous row or container element */ row || that.element);
        });
        // bind to the template row
        that.bindRow(that.element, first);
      } else {
        // no data, hide the entire container element
        visible(that.element, false);
      }
    }).fail(function () {
      visible(that.element, false);
      console.log(arguments);
    });
  };

  var init = function (container) {
    container.bind();
  };

  var findContainers = function () {
    var containers = [];
    _truss.$('[data-src]').each(function () {
      containers.push(new Container(this, data(this)));
    });
    return containers;
  };

  $(document).ready(function () {
    forEach(findContainers(), init);
  });
}).call(this);