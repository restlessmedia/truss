(function () {
    truss.registerPlugin('dateFormat', function (element, value) {
        var values = [];
        values.push(value.getDate(), value.getMonth() + 1, value.getFullYear());
        return values.join('-');
    });
}).call(this);