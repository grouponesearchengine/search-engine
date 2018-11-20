

var KEYS = Object.freeze({
    ENTER: 13,
})




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
        if (!query_text.trim()) return;

        // $('.query-text').val('');
        $('.results-layout').empty();

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

