

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
                snippet.str += (snip + '...');
                if (++snippet.len >= snippet.MAX_LEN)
                    break;
            }
        }
    }

    var str = snippet.str;
    var repl = {
        '<snip>': '<b>',
        '</snip>': '</b>'
    };
    for (var r in repl) {
        str = str.replace(new RegExp(r, 'g'), repl[r]);
    }

    return str;

}


function generateResult(title, snippet, url) {

    return `<div class="result-wrapper">
      <div class="result-title-wrapper">
        <a class="result-title" href="${url}"> ${title} </a>
      </div>
      <div class="result-url"> ${url} </div>
      <div class="result-snippet"> ${snippet} </div>
      <div class="result-similar-wrapper">
        <a class="result-similar" href="/similar"> find similar </a>
      </div>
    </div>`;

}


function displayResults(data) {
    data.forEach(function(elem, index) {
        var snippets = parseSnippets(elem.snippet);
        var markup_template = generateResult(
            elem.result.title, snippets, elem.result.url);
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
                findAlike();
            }
        });

    });

};


function findAlike() {

    $('.result-similar').each(function(index, elem) {
        $(elem).click(function(evnt) {
            evnt.preventDefault();
            console.log(this);
        });
    });

}


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
    findAlike();
});

