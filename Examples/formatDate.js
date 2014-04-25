(function () {
    var plugin = function (container, field, value) {
        console.log(arguments);
        $(field.element).text(value.getFullYear() + '.' + value.getMonth());
    };
    truss.registerFieldPlugin('formatDate', plugin);
}).call(this);