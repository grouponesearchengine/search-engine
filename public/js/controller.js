

var KEYS = Object.freeze({
    ENTER: 13,
});


function parseSnippets(snippets) {

    var snippet = {
        str: '', len: 0,
        MAX_LEN: 3, MAX_CAT: 5
    };

    for (var i = 0; i < snippet.MAX_CAT && snippet.len < snippet.MAX_LEN; ++i) {
        for (var key in snippets) {
            var snip = snippets[key][i];
            if (snip != undefined) {
                snippet.str += (snip + '... ');
                if (++snippet.len >= snippet.MAX_LEN)
                    break;
            }
        }
    }

    return snippet.str;

}


function displayResults(data) {
    data.forEach(function(elem) {
        var snippets = parseSnippets(elem.snippet);
        var markup_template = 
            `<div>
                <h4> ${elem.result.title} </h4>
                <span> ${snippets} </span>
                <p> ${elem.result.url} </p>
            </div>`;
        $('.results-layout').append(markup_template);

    });
}


function clearResults() {
    $('.results-layout').empty();
}


function initQuery() {

    $('.query-search-button').click(function(evnt) {
        evnt.preventDefault();
        
        var query_text = $('.query-text').val();
        if (!query_text.trim()) 
            return;

        $.ajax({
            type: 'POST',
            data: JSON.stringify({ text: query_text }),
            contentType: 'application/json',
            url: '/search',
            success: function(data) {
                clearResults();
                displayResults(data);
            }
        });

    });

};


function enterTrigger() {
    var input = document.getElementById('responsive-input');
    input.addEventListener('keyup', function(evnt) {
        evnt.preventDefault();
        if (evnt.keyCode == KEYS.ENTER) {
            document.getElementById('clickable-button').click();
        }
    });
}


$(document).ready(function() {
    enterTrigger();
    initQuery();
});

