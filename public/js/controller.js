

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
                console.log(data);
                $('.results-layout').append(
                    '<p>' + data + '</p>'
                );
            }
        });

    });

};


$(document).ready(function() {
    initQuery();
});

