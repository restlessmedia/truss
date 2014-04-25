(function () {

    var plugin = function (container, field, value) {
        console.log(arguments);
        $(field.element).text('a date');
    };

    truss.registerFieldPlugin('formatDate', plugin);
}).call(this);