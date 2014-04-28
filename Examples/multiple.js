$.ajaxSetup({isLocal: true, crossDomain: true});

$.ajax = function () {
    var deferred = $.Deferred();
    var data = [
        {
            title: 'Row 1',
            body: 'Suspendisse potenti. Fusce feugiat, augue ut varius varius, dolor libero pulvinar nisl, in placerat purus dui vel neque. Vivamus auctor arcu iaculis mattis feugiat. Nunc pharetra auctor dui, ut molestie eros elementum quis. Proin blandit vestibulum volutpat. Nunc sed urna quis metus laoreet rhoncus. Nunc consectetur, ipsum et consequat ornare, ligula velit hendrerit turpis, id blandit urna ipsum at diam.',
            createdOn: new Date()
        },
        {
            title: 'Row 2',
            body: 'Suspendisse potenti. Fusce feugiat, augue ut varius varius, dolor libero pulvinar nisl, in placerat purus dui vel neque. Vivamus auctor arcu iaculis mattis feugiat. Nunc pharetra auctor dui, ut molestie eros elementum quis. Proin blandit vestibulum volutpat. Nunc sed urna quis metus laoreet rhoncus. Nunc consectetur, ipsum et consequat ornare, ligula velit hendrerit turpis, id blandit urna ipsum at diam.',
            createdOn: new Date()
        },
        {
            title: 'Row 3',
            body: 'Suspendisse potenti. Fusce feugiat, augue ut varius varius, dolor libero pulvinar nisl, in placerat purus dui vel neque. Vivamus auctor arcu iaculis mattis feugiat. Nunc pharetra auctor dui, ut molestie eros elementum quis. Proin blandit vestibulum volutpat. Nunc sed urna quis metus laoreet rhoncus. Nunc consectetur, ipsum et consequat ornare, ligula velit hendrerit turpis, id blandit urna ipsum at diam.',
            createdOn: new Date()
        },
        {
            title: 'Row 4',
            body: 'Suspendisse potenti. Fusce feugiat, augue ut varius varius, dolor libero pulvinar nisl, in placerat purus dui vel neque. Vivamus auctor arcu iaculis mattis feugiat. Nunc pharetra auctor dui, ut molestie eros elementum quis. Proin blandit vestibulum volutpat. Nunc sed urna quis metus laoreet rhoncus. Nunc consectetur, ipsum et consequat ornare, ligula velit hendrerit turpis, id blandit urna ipsum at diam.',
            createdOn: new Date()
        }
    ];

    deferred.resolve(data);
    return deferred.promise();
};