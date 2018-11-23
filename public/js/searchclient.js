/**
 *  client-side query handling
 * 
 */


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
      <div class="result-title"> ${title} </div>
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
    data.forEach(function(elem, index) {
        var snippets = parseSnippets(elem.snippet);
        var markup_template = generateResult(
            elem.result.title, snippets, elem.result.url);
        $('.results-layout').append(markup_template);
        $('.results-layout').append('<div>&nbsp;</div>')
    });
}


// this doesn't work well
function generateNavigation() {
    
    clearNavigation();
    var query_text = window.localStorage.getItem('query');
    var len = 10;
    for (var i = 0; i < 10; ++i) {
        var index = i+1;
        var navigation_markup = 
          `<span id="${index}" class="directory-num-wrapper">
            <a class="directory-num" href="/"> ${index} </a>
          </span>`;
        $('.directory-bar').append(navigation_markup);
        $('.directory-num').click(function(evnt) {
            evnt.preventDefault();
            queryResults(query_text, len*i, len);
        });
    }

}


function clearResults() {
    $('.results-layout').empty();
}


function clearNavigation() {
    $('.directory-bar').empty();
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
            displayResults(data);
            
            // TODO find a better way to do this
            generateNavigation();
            // navigateResults();
            
            findAlike(data);
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
    $('.directory-num').forEach(function(elem, index) {
        if (query_text != undefined) {
            $(elem).click(function(evnt) {
                evnt.preventDefault();
                queryResults(query_text, len*index, len);
            });
        }
    });

}


function findAlike(data) {

    $('.result-similar').each(function(index, elem) {
        $(elem).click(function(evnt) {
            evnt.preventDefault();
            window.localStorage.setItem('article', JSON.stringify(data[index].result));
            window.location.href = '/similarity';
        });
    });

}


function enterTrigger() {

    var KEYS = Object.freeze({
        ENTER: 13,
    });

    var input = document.getElementById('responsive-input');
    if (input) {
        input.addEventListener('keyup', function(evnt) {
            evnt.preventDefault();
            if (evnt.keyCode == KEYS.ENTER) {
                document.getElementById('clickable-button').click();
            }
        });
    }
}


$(window).on('load', function() {
    enterTrigger();
    sendQuery();
    // navigateResults();
    findAlike();
});

