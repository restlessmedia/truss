$.ajaxSetup({isLocal: true, crossDomain: true});

$.ajax = function () {
    var deferred = $.Deferred();
    var count = 10;
    var data = [];

    while (count--) {
        var obj = {
            title: 'Multiple test',
            body: 'Suspendisse potenti. Fusce feugiat, augue ut varius varius, dolor libero pulvinar nisl, in placerat purus dui vel neque. Vivamus auctor arcu iaculis mattis feugiat. Nunc pharetra auctor dui, ut molestie eros elementum quis. Proin blandit vestibulum volutpat. Nunc sed urna quis metus laoreet rhoncus. Nunc consectetur, ipsum et consequat ornare, ligula velit hendrerit turpis, id blandit urna ipsum at diam.',
            createdOn: new Date()
        };
        obj.createdOn.setDate(obj.createdOn.getDate() + (count * 10.5));
        data.push(obj);
    }

    deferred.resolve(data);
    return deferred.promise();
};