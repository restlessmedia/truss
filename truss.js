(function () {
    var _root = this;
    var _truss;

    if (typeof exports !== 'undefined') {
        _truss = exports;
    } else {
        _truss = _root.truss = {};
    }

    _truss.version = '1.0.0';
    _truss.$ = _root.jQuery || _root.$;

    // add to the global namespace
    _root.truss = _truss;

    // helper for iterating over collections
    var forEach = function (a, fn) {
        var len = a.length || 0;
        var results = new Array(len);
        if (len) {
            var i = len - 1;
            while (i > -1) {
                var result = fn.apply(a[i], [i]);
                results[i] = result;
                if (result === false) {
                    break;
                }
                i--;
            }
        }
        return results;
    };

    var Container = function (element, config) {
        this.src = config.src;
        this.element = element;
        return this;
    };

    Container.prototype.clone = function () {
        var element = this.element.cloneNode(true);
        element.removeAttribute('data-src');
        return element;
    };

    Container.prototype.bindRow = function (row, data) {
        var that = this;
        forEach($(row).find('[data-name]'), function () {
            var name = this.getAttribute('data-name');
            if (data.hasOwnProperty(name)) {
                $(this).text(data[name]);
            }
        });
    };

    Container.prototype.bind = function (data) {
        var that = this;
        var row = that.element;
        if ('length' in data) {
            forEach(data, function (i) {
                that.bindRow(row, this);
                // only create a new row if last data item
                if (i > 0) {
                    row = that.clone();
                    that.element.parentNode.appendChild(row);
                }
            });
        } else {
            that.bindRow(row, data);
        }
    };

    var dataAttr = function (element) {
        return $(element).data();
    };

    var fetch = function (container) {
        return $.ajax({url: container.src});
    };

    // initialises a container
    var init = function (container) {
        fetch(container).done(function (data) {
            container.bind(data);
        }).fail(function () {
            console.log('Failed to return data for src = "' + container.src + '"');
        });
    };

    // finds containers in the dom to register
    var findContainers = function () {
        return forEach(_truss.$('[data-src]'), function () {
            return new Container(this, dataAttr(this));
        });
    };

    $(document).ready(function () {
        // global register
        forEach(findContainers(), function () {
            init(this);
        });
    });
}).call(this);
