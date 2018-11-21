

var KEYS = Object.freeze({
    ENTER: 13,
})


function displayResults(data) {
    data.forEach(function(elem) {
        var markup_template = 
            `<div>
                <h4> ${elem.title} </h4>
                <div> ${elem.abstract} </div>
                <div> ${elem.url} </div>
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

        var query = {
            text: query_text
        };

        $.ajax({
            type: 'POST',
            data: JSON.stringify(query),
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

