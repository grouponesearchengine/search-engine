



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


function appendDescriptionList(criteria, elems) {
    var description = criteria+': ';
    for (var i = 0; i < elems.length; ++i) {
        description += elems[i] +', '
    }
    return description.slice(0, -2);

}


function generateResult(title, text, url, subject, author, date) {

    var subjects = appendDescriptionList('Subject', subject);
    var authors = appendDescriptionList('Authors', author);

    return `<div class="advanced-result-wrapper">
        <h5 class="advanced-title"> ${title} </h5>
        <div class="advanced-url-wrapper">
        <a class="advanced-url" href="${url}"> ${url} </a>
        </div>
        <p class="advanced-snippet"> ${text} </p>        
        <div class="advanced-criteria"> ${subjects} </div>
        <div class="advanced-author"> ${authors} </div>
        <div class="advanced-date"> ${date} </div>
        <div class="result-similar-wrapper">
          <a class="result-similar" href="/similarity"> find similar </a>
        </div>
      </div>`;

}


function displayResults(data) {

    if (data.length == 0)
        return noResults('advanced-results');

    data.forEach(function(elem, index) {

        var snippets = generateSnippet(elem);
        var markup_template = generateResult(
            elem.result.title,
            snippets,
            elem.result.url, 
            elem.result.subjects,
            elem.result.authors, 
            elem.result.date);
        $('.advanced-results').append(markup_template);
        $('.advanced-results').append('<div>&nbsp;</div>');

    });

    addDirectory('/advanced');
    navigateResults();

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
            emptyDirectory();
            displayResults(data);
            findAlike(data);
        },
        error: function() {
            noResults('advanced-query');
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
    reloadQueries();
    initEnterTrigger();
    fillQuery();
    sendAdvancedQuery();
});

