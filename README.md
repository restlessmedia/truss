truss
=====

A simple data templating library for elements using javascript.  There are two ways you can bind data to a template, inline or with external files.

## Inline templating

    <script type="text/x-dot-template" data-url="countries.json">
        <table>
            {{~data :country}}
            <tr>
                <td>{{=country.name}}</td>
                <td>{{=country.code}}</td>
            </tr>
            {{~}}
        </table>
    </script>

## External templating with .html files

    <script type="text/x-dot-template" data-url="countries.json" data-template="template"></script>
    
template.html

    <table>
        {{~data :country}}
        <tr>
            <td>{{=country.name}}</td>
            <td>{{=country.code}}</td>
        </tr>
        {{~}}
    </table>
    
## Dependencies

- doT https://github.com/olado/doT (for templating)
- jQuery (for data retrieval and promises)

## To do

- Unit tests
- Loading states, built in and customisable
