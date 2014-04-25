(function () {
    var _root = this;
    var _truss;
    var _fieldPlugins = []; // contains all the fields plugins

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
        var i = a.length || 0;
        var results = new Array(i);
        if (i) {
            while (i--) {
                var result = fn.call(a[i]);
                results[i] = result;

                if (result === false) {
                    break;
                }
            }
        }
        return results;
    };

    // a field is a model of a field for a container
    var Field = function (element, config) {
        var name = config.name.split(':');
        this.element = element;
        this.name = name[0];
        this.plugin = name.length == 2 ? name[1] : null;
        return this;
    };


    Field.prototype.set = function (value) {
        $(this.element).text(value);
    };

    Field.prototype.bind = function (container, data) {
        var value;

        if (data.hasOwnProperty(this.name)) {
            value = data[this.name];
        }

        if (this.plugin && _fieldPlugins[this.plugin]) {
            _fieldPlugins[this.plugin](container, this, value);
        }
        else {
            this.set(value);
        }
    };

    // field plugin registration
    _truss.registerFieldPlugin = function (name, fn) {
        _fieldPlugins[name] = fn;
    };

    // a container is a truss container which encapsulates the binding fields for an endpoint
    var Container = function (element, config, fields) {
        this.src = config.src;
        this.fields = fields;
        return this;
    };

    Container.prototype.bind = function (data) {
        var that = this;
        forEach(this.fields, function () {
            this.bind(that, data);
        });
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

    // finds bindable fields in an elements children
    var findFields = function (element) {
        return forEach($(element).find('[data-name]'), function () {
            return new Field(this, dataAttr(this));
        });
    };

    // finds containers in the dom to register
    var findContainers = function () {
        return forEach(_truss.$('[data-src]'), function () {
            return new Container(this, dataAttr(this), findFields(this));
        });
    };

    $(document).ready(function () {
        // global register
        forEach(findContainers(), function () {
            init(this);
        });
    });
}).call(this);