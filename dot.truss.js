(function () {
  var _templateExt = '.html';

  doT.templateSettings.varname = 'data';

  var forEach = function (items, fn) {
    var len = items.length >>> 0;
    if (len) {
      var i = -1;
      while (++i < len) {
        fn.apply(items[i], [items[i], i]);
      }
    }
  };

  var fetch = function (url) {
    return $.ajax({ url: url });
  };

  var templateAttr = function (element) {
    var value = element.getAttribute('data-template');
    return value ? value + _templateExt : value;
  };

  var container = function (html, name) {
    name = name || 'div';
    var container = document.createElement(name);
    container.innerHTML = html;
    return container;
  };

  var text = function (element) {
    var value;
    if (element.childNodes.length) {
      value = element.childNodes[0].nodeValue;
    }
    return value;
  };

  var template = function (element) {
    var attr = templateAttr(element);
    if (attr) {
      return fetch(attr);
    }
    var deferred = $.Deferred();
    deferred.resolve(text(element));
    return deferred.promise();
  };

  var bind = function (element, options, data) {
    if (data) {
      template(element).done(function (template) {
        var html = doT.template(template)(data);
        var cnt = container(html);
        cnt.setAttribute('class', element.getAttribute('class'));

        if (element.nextSibling) {
          element.parentNode.insertBefore(cnt, element.nextSibling);
        } else {
          element.parentNode.appendChild(cnt, element);
        }

        $(element).trigger('truss.done');
        if (options.inclass) {
          setTimeout(function () {
            cnt.className = cnt.className + ' ' + options.inclass;
          }, 1);
        }
      });
    }
  };

  var init = function (element, options) {
    fetch(options.url).done(function (data) {
      bind(element, options, data);
    }).fail(function () {
      console.log(arguments);
    })
  };

  var eachTemplate = function (parent, fn) {
    forEach(parent.childNodes, function () {
      if (this.nodeType === 1) {
        if (this.childNodes.length) {
          eachTemplate(this, fn);
        }
        if (this.hasAttribute('data-url')) {
          fn.call(this, this, $(this).data());
        }
      }
    })
  };

  doT.truss = function (parent) {
    parent = parent || document.body;
    eachTemplate(parent, init);
  };

  doT.byId = function (id) {
    var element = document.getElementById(id);
    var template = text(element) || '';
    if (template) {
      return doT.template(template);
    }
  };

  doT.truss();

}).call(this);