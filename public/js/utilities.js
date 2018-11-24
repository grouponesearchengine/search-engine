/**
 * utility functions for the client
 * 
 * 
 */

function initEnterTrigger() {

    var KEYS = Object.freeze({
        ENTER: 13,
    });

    var input = document.getElementById('responsive-input');
    while (input.id === 'responsive-input') {
        input.addEventListener('keyup', function(evnt) {
            evnt.preventDefault();
            if (evnt.keyCode === KEYS.ENTER) {
                document.getElementById('clickable-button').click();
            }
        });
        input = input.nextElementSibling;
    }

}


function reloadQueries() {
    $(window).on('beforeunload', function() {
        window.localStorage.setItem('query', '');
        window.localStorage.setItem('article', '');
    });
}


function errorMessageClass(tag) {
    $('.'+tag).empty();
    var markup = 
    `<div> 
      Error, information must be entered. 
    </div>`;
    $('.'+tag).append(markup);
    return false;
}


