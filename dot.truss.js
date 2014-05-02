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
        return $.ajax({url: url});
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

    var template = function (element) {
        var attr = templateAttr(element);
        if (attr) {
            return fetch(attr);
        }
        var deferred = $.Deferred();
        deferred.resolve(element.childNodes.length ? element.childNodes[0].nodeValue : null);
        return deferred.promise();
    };

    var bind = function (element, data) {
        if (data) {
            template(element).done(function (template) {
                var html = doT.template(template)(data);
                var replaceWith = container(html);
                element.parentNode.replaceChild(replaceWith, element);
            });
        }
    };

    var init = function (element, url) {
        fetch(url).done(function (data) {
            bind(element, data);
        }).fail(function(){
            console.log(arguments);
        })
    };

    var eachTemplate = function (parent, fn) {
        forEach(parent.childNodes, function () {
            if (this.nodeType === 1) {
                var url = this.getAttribute('data-url');
                if (this.childNodes.length) {
                    eachTemplate(this, fn);
                }
                if (url) {
                    fn.call(this, this, url);
                }
            }
        })
    };

    doT.register = function (parent) {
        parent = parent || document.body;
        eachTemplate(parent, init);
    };

    doT.register();

}).call(this);