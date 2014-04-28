(function () {
    var _root = this;
    var _truss;
    var _plugins = [];

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
        var index = function (o, i) {
            return o[i]
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

    Container.prototype.visible = function (isVisible) {
        var $element = $(this.element);
        if (isVisible) {
            $element.show();
        }
        else {
            $element.hide();
        }
    };

    Container.prototype.addRow = function (data) {
        var row = this.element.cloneNode(true);
        row.removeAttribute('data-src');
        this.bindRow(row, data);
        this.element.parentNode.appendChild(row);
        return row;
    };

    Container.prototype.bind = function (data) {
        // always work with a collection
        data = 'length' in data ? data : [data];
        if (data.length) {
            var that = this;
            // get the first record, this is applied to the first template row
            var first = data.shift();
            // loop through remaining records
            forEach(data, function (obj, i) {
                that.addRow(obj);
            });
            // bind to the template row
            this.bindRow(this.element, first);
        } else {
            this.visible(false);
        }
    };

    var init = function (container) {
        fetch(container).done(function (data) {
            container.bind(data);
        }).fail(function () {
            console.log('Failed to return data for src = "' + container.src + '"');
        });
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