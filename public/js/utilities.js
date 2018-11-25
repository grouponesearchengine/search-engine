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
    while (input != undefined) {
        if (input.id === 'responsive-input') {
            input.addEventListener('keyup', function(evnt) {
                evnt.preventDefault();
                if (evnt.keyCode === KEYS.ENTER) {
                    document.getElementById('clickable-button').click();
                }
            });
        }
        input = input.nextElementSibling;
    }

}


function reloadQueries() {
    $(window).on('beforeunload', function() {
        window.localStorage.setItem('query', '');
        window.localStorage.setItem('advanced_query', '');
    //    window.localStorage.setItem('article', '');
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


function emptyDirectory() {
    $('.directory-hook').empty();
}


function addDirectory(url) {
    var directory = `<div class="directory-wrapper row">
      <div class="col"></div>
      <div class="directory-bar col-8 d-flex justify-content-around">
        <a class="directory-button" href="${url}"> 1 </a>
        <a class="directory-button" href="${url}"> 2 </a>
        <a class="directory-button" href="${url}"> 3 </a>
        <a class="directory-button" href="${url}"> 4 </a>
        <a class="directory-button" href="${url}"> 5 </a>
        <a class="directory-button" href="${url}"> 6 </a>
        <a class="directory-button" href="${url}"> 7 </a>
        <a class="directory-button" href="${url}"> 8 </a>
        <a class="directory-button" href="${url}"> 9 </a>
        <a class="directory-button" href="${url}"> 10 </a>
      </div>
      <div class="col"></div>
    </div>`;
    emptyDirectory();
    $('.directory-hook').append(directory);
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


