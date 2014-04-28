(function () {
    truss.registerPlugin('dateFormat', function (element, value) {
        var values = [];
        var d = new Date(value);
        values.push(d.getDate(), d.getMonth() + 1, d.getFullYear());
        return values.join('-');
    });
}).call(this);