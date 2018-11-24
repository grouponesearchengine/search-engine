



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
      <div class="advanced-title"> ${title} </div>
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


function sendAdvancedQuery() {
    $('.advanced-search-button').click(function(evnt) {
        evnt.preventDefault();

        var query = {};
        appendEntry(query, 'query', $('.advanced-text-query').val());
        appendEntry(query, 'subjects', $('.advanced-text-subjects').val());
        appendEntry(query, 'authors', $('.advanced-text-authors').val());
        appendEntry(query, 'date', $('.advanced-text-date').val());

        if (!(query.query || query.subjects || query.authors || query.date))
            return errorMessageClass('advanced-results');
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(query),
            contentType: 'application/json',
            url: '/advanced',
            success: function(data) {
                clearResults();
                displayResults(data);
            }
        });

    });
}


$(window).on('load', function() {
    initEnterTrigger();
    fillQuery();
    reloadQueries();
    sendAdvancedQuery();
});

