

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


function generateNetworkTrivial(data) {

    var nodes = [
        {id: 0, label:"Myriel", group: 1},
        {id: 1, label:"Napoleon", group: 1},
        {id: 2, label:"Baptistine", group: 1},
    ];

    var edges = [
        {from: 0, to: 1},
        {from: 0, to: 2},
        {from: 1, to: 2}
    ];

    var container = document.getElementById('network');
    data = {
        nodes: nodes,
        edges: edges
    };

    var options = {
        nodes: {
            shape: 'dot',
            size: 16
        },
        physics: {
            forceAtlas2Based: {
                gravitationalConstant: -26,
                centralGravity: 0.005,
                springLength: 230,
                springConstant: 0.18
            },
            maxVelocity: 146,
            solver: 'forceAtlas2Based',
            timestep: 0.35,
            stabilization: {iterations: 150}
        }
    };

    var network = new vis.Network(container, data, options);
    return network;

}


function generateNetwork(data) {

    var nodes = [{
        id: 0,
        label: data[0].title,
        group: 1
    }];
    var edges = [];

    var c = 10;
    for (var i = 0; i < c; ++i) {
        var subnode = nodes[i];
        for (var j = 0; j < c; ++j) {
            var k = c*i+j+1;
            nodes.push({
                id: k,
                label: data[k].title,
                group: i
            });
            edges.push({
                from: subnode.id,
                to: k
            });
            
        }
    }

    var container = document.getElementById('network');
    var network = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        nodes: {
            shape: 'dot',
            size: 16
        },
        physics: {
            forceAtlas2Based: {
                gravitationalConstant: -26,
                centralGravity: 0.005,
                springLength: 230,
                springConstant: 0.18
            },
            maxVelocity: 146,
            solver: 'forceAtlas2Based',
            timestep: 0.35,
            stabilization: {iterations: 150}
        }
    };

    return new vis.Network(container, network, options);

}


function loadSimilar() {

    var article = window.localStorage.getItem('article');
    // console.log('loadsimilar',article);
    // return;
    if (article != null) {
        article = JSON.parse(article);
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify({ data: article }),
            contentType: 'application/json',
            url: '/similarity',
            success: function(data) {
                // displayArticles(data);
                generateNetwork(data);
            }
        });

    }

}


$(window).on('load', function() {
    loadSimilar();
    // generateNetwork();
});

