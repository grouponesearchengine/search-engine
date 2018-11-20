


function iterateResults(data) {
    var len = data.length;
    for (var i = 0; i < len; ++i) {
        $('.results-layout').append(
            '<p>' + data[i].abstract + '</p>'
        );
    }
}


function initQuery() {

    $('.query-search-button').click(function(evnt) {
        evnt.preventDefault();
        var query_text = $('.query-text').val();
        // TODO put in query checking/empty input
        var query = {
            text: query_text
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(query),
            contentType: 'application/json',
            url: '/search',
            success: function(data) {
                iterateResults(data);
            }
        });

    });

};


$(document).ready(function() {
    initQuery();
});

