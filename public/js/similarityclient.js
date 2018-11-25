

function generateArticle(title, url, abstract) {

    return `<div class="similar-wrapper">
      <div class="similar-title"> ${title} </div>
      <div class="similar-url-wrapper">
        <a class="similar-url" href="${url}"> ${url} </a>
      </div>
      <div class="similar-abstract"> ${abstract} </div>
    </div>`;

}



function displayArticles(data) {

    data.forEach(function(elem, index) {

        var article_markup = generateArticle(
                elem.title, elem.url, elem.abstract);
        $('.similarity-layout').append(article_markup);
        $('.similarity-layout').append('<div>&nbsp;</div>')

    });

}


function loadSimilar() {

    var article = window.localStorage.getItem('article');
    console.log('loadsimilar',article);
    // return;
    if (article != null) {
        article = JSON.parse(article);
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify({ data: article }),
            contentType: 'application/json',
            url: '/similarity',
            success: function(data) {
                displayArticles(data);
            }
        });

    }

}


$(window).on('load', function() {
    loadSimilar();
});

