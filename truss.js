(function () {
    var root = this;

    var truss;
    if (typeof exports !== 'undefined') {
        truss = exports;
    } else {
        truss = root.truss = {};
    }

    truss.version = '1.0.0';
    truss.$ = root.jQuery || root.$;

    // a field is a model of a field for a container
    var Field = function (element, config) {
        this.element = element;
        this.name = config.name;
        return this;
    };

    Field.prototype.set = function (value) {
        // TODO: different binding techniques for different node types
        $(this.element).text(value);
    };

    Field.prototype.bind = function (data) {
        if (data.hasOwnProperty(this.name)) {
            this.set(data[this.name]);
        }
    };

    // a container is a truss container which encapsulates the binding fields for an endpoint
    var Container = function (element, config, fields) {
        this.src = config.src;
        this.fields = fields;
        return this;
    };

    Container.prototype.bind = function (data) {
        forEach(this.fields, function () {
            this.bind(data);
        });
    };

    // helper for iterating over collections
    var forEach = function (a, fn) {
        var i = a.length || 0;
        var results = new Array(i);
        if (i) {
            while (i--) {
                results[i] = fn.call(a[i]);
            }
        }
        return results;
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
        return forEach(truss.$('[data-src]'), function () {
            return new Container(this, dataAttr(this), findFields(this));
        });
    };

    // global register
    forEach(findContainers(), function () {
        init(this);
    });
}).call(this);