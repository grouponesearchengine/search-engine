

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


function reloadQueries() {
    $(window).on('beforeunload', function() {
        window.localStorage.setItem('query', '');
        window.localStorage.setItem('article', '');
    });
}


