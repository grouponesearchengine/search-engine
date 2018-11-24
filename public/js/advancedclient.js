




function fillQuery() {
    var query_text = window.localStorage.getItem('query');
    if (query_text) {
        $('.advanced-text-query').val(query_text);
    }
}



function appendEntry(obj, key, value) {
    if (!value.trim())
        return false;
    obj[key] = value.trim();
    return true;
}


function sendAdvancedQuery() {
    $('.advanced-search-button').click(function(evnt) {
        evnt.preventDefault();

        var query = {};
        appendEntry(query, 'query', $('.advanced-text-query').val());
        appendEntry(query, 'subjects', $('.advanced-text-subjects').val());
        appendEntry(query, 'authors', $('.advanced-text-authors').val());
        appendEntry(query, 'date', $('.advanced-text-date').val());

        if (!(query.query || query.subjects || query.authors || query.date)) {
            // console.log('empty query');
            return;
        }
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(query),
            contentType: 'application/json',
            url: '/advanced',
            success: function(data) {
                console.log(data);
            }
        });

    });
}


$(window).on('load', function() {
    enterTrigger();
    fillQuery();
    reloadQueries();
    sendAdvancedQuery();
});

