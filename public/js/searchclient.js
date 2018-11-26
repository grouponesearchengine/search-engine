/**
 *  client-side query handling
 * 
 */


function generateResult(title, snippet, url) {

    return `<div class="result-wrapper">
      <h5 class="result-title"> ${title} </h5>
      <div class="result-url-wrapper">
        <a class="result-url" href="${url}"> ${url} </a>
      </div>
      <div class="result-snippet"> ${snippet} </div>
      <div class="result-similar-wrapper">
        <a class="result-similar" href="/similarity"> find similar </a>
      </div>
    </div>`;

}


function displayResults(data) {

    if (data.length == 0)
        return noResults('results-layout');

    data.forEach(function(elem, index) {
        
        var snippets = parseSnippets(elem.snippet);
        if (snippets.length == 0)
            snippets = emptySnippet();

        var markup_template = generateResult(
            elem.result.title, snippets, elem.result.url);
        $('.results-layout').append(markup_template);
        $('.results-layout').append('<div>&nbsp;</div>')

    });

    addDirectory('/');
    navigateResults();

}


function clearResults() {
    $('.results-layout').empty();
}


function queryResults(query_text, from, size) {
    $.ajax({
        type: 'POST',
        data: JSON.stringify({
            text: query_text,
            from: from,
            size: size
        }),
        contentType: 'application/json',
        url: '/search',
        success: function(data) {
            clearResults();
            emptyDirectory();
            displayResults(data);
            findAlike(data);
        },
        error: function() {
            noResults('results-layout');
        }
    });
}


function sendQuery() {

    $('.query-search-button').click(function(evnt) {
        evnt.preventDefault();

        var query_text = $('.query-text').val();
        if (!query_text.trim()) 
            return;
        
        window.localStorage.setItem('query', query_text);
        queryResults(query_text, 0, 10);
    });

};


function navigateResults() {

    var len = 10;
    var query_text = window.localStorage.getItem('query');
    $('.directory-button').each(function(index, elem) {
        $(elem).click(function(evnt) {
            evnt.preventDefault();
            if (query_text != undefined) {
                queryResults(query_text, len*index, len);
            }
        });
    });

}


function advancedRedirect() {
    $('.query-advanced-search').click(function(evnt) {
        evnt.preventDefault();
        var query_text = $('.query-text').val();
        if (query_text) {
            window.localStorage.setItem('query', query_text);
        }
        window.location.href = "/advanced";
    });
}


$(window).on('load', function() {
    initEnterTrigger();
    advancedRedirect();
    sendQuery();
});

