truss
=====

A simple data binding library for elements using javascript.

## Example

Markup:

    <div data-src="/api/getData">
        <h1 data-name="title"></h1>
        <p data-name="body"></p>
        <p data-name="createdOn"></p>
    </div>
	
Data:

    {title: 'something', body: 'something else...', createdOn: new Date()}
	
...becomes

    <div data-src="/api/getData">
        <h1 data-name="title">something</h1>
        <p data-name="body">something else</p>
        <p data-name="createdOn">Fri Apr 25 2014 12:42:12 GMT+0100 (GMT Daylight Time)</p>
    </div>