



function fillQuery() {
    var query_text = window.localStorage.getItem('query');
    if (query_text) {
        $('.advanced-text-query').val(query_text);
    }
}


function clearResults() {
    $('.advanced-results').empty();
}


function appendEntry(obj, key, value) {
    if (!value.trim())
        return false;
    obj[key] = value.trim();
    return true;
}


function generateResult(title, text, url, subject, author, date) {
    return `<div class="advanced-result-wrapper">
      <h5 class="advanced-title"> ${title} </h5>
      <div class="advanced-url-wrapper">
        <a class="advanced-url" href="${url}"> ${url} </a>
      </div>
      <div class="advanced-snippet"> ${text} </div>
      <div class="advanced-criteria"> ${subject} </div>
      <div class="advanced-author"> ${author} </div>
      <div class="advanced-date"> ${date} </div>
    </div>`;
}


function displayResults(data) {
    data.forEach(function(elem, index) {
        var markup_template = generateResult(
            elem.result.title, elem.result.abstract,
            elem.result.url, elem.result.subjects,
            elem.result.authors, elem.result.date);
        $('.advanced-results').append(markup_template);
        $('.advanced-results').append('<div>&nbsp;</div>');
    });
}


function navigateResults() {

    var req = {
        body: JSON.parse(window.localStorage.getItem('advanced_query'))
    };
    var len = 10;
    $('.directory-button').each(function(index, elem) {
        $(elem).click(function(evnt) {
            evnt.preventDefault();
            if (req != undefined) {
                advancedQueryResult(req, len*index, len);
            }
        });
    });

}


function advancedQueryResult(req, from, size) {
    $.ajax({
        type: 'POST',
        data: JSON.stringify({
            query: req,
            from: from,
            size: size
        }),
        contentType: 'application/json',
        url: '/advanced',
        success: function(data) {
            clearResults();
            displayResults(data);
            addDirectory('/advanced');
            navigateResults();
        }
    });
}




function sendAdvancedQuery() {
    $('.advanced-search-button').click(function(evnt) {
        evnt.preventDefault();

        var query = {
            body: {}
        };
        appendEntry(query.body, 'query', $('.advanced-text-query').val());
        appendEntry(query.body, 'subjects', $('.advanced-text-subjects').val());
        appendEntry(query.body, 'authors', $('.advanced-text-authors').val());
        appendEntry(query.body, 'date', $('.advanced-text-date').val());

        if (!(query.body.query || 
            query.body.subjects || 
            query.body.authors || 
            query.body.date)) 
                return;

        window.localStorage.setItem('advanced_query', JSON.stringify(query.body));
        advancedQueryResult(query, 0, 10);

    });
}


$(window).on('load', function() {
    initEnterTrigger();
    fillQuery();
    reloadQueries();
    sendAdvancedQuery();
});

