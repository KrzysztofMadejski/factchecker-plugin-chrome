//$('#artykul').css('background-color', 'red')

// http://demagog.org.pl/politycy/jaroslaw-kaczynski/
var text = "12 maja 1990 roku, czyli datę powstania";
var elem = $('*:contains()').last();
// TODO case sensitive, TODO breaked by <i> etc.

// TODO matches <all_urls>

// Add all the info about statement (TODO extend jmHighlight to perform cusstom function)

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes.length && mutation.addedNodes[0].className && mutation.addedNodes[0].className.startsWith('tom-')) {
    	var el = $(mutation.addedNodes[0]);
        var className = mutation.addedNodes[0].className

        if (className == 'tom-true') {
            img_url = chrome.extension.getURL("images/ico-yes-enabled.png");
            verdict = "Prawda"
            el.after('<span class="tom-marker ' + className + '-marker"><img class="tom-img" src="' + img_url + '">' + verdict + '</span>');

    	} else if (className == 'tom-false') {
            img_url = chrome.extension.getURL("images/ico-no-enabled.png");
            verdict = "Fałsz"

            el.after('<span class="tom-marker ' + className + '-marker"><img class="tom-img" src="' + img_url + '">' + verdict + '</span>');

    	} else if (className == 'tom-lie') {
            img_url = chrome.extension.getURL("images/ico-exclamation-enabled.png");
            verdict = "Manipulacja"

            el.after('<span class="tom-marker ' + className + '-marker"><img class="tom-img" src="' + img_url + '">' + verdict + '</span>');

    	} else if (className == 'tom-unverifiable') {
            img_url = chrome.extension.getURL("images/ico-question-enabled.png");
            verdict = "Nieweryfikowalne"

            el.after('<span class="tom-marker ' + className + '-marker"><img class="tom-img" src="' + img_url + '">' + verdict + '</span>');
    	}
    }
  });    
});

observer.observe(document.body,  { childList: true, subtree: true });

var api_endpoint = 'http://127.0.0.1:8001/';

function get_act(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == xhr.DONE) {
        callback(xhr);
      }
    }
    xhr.send();
}

function on_article(article_url) {
    get_act(article_url + "statements/", function(xhr) {
        var statements = JSON.parse(xhr.responseText);

        for(i=0;i<statements.length; i++) {
//            try {
            $('body').jmHighlight(statements[i].text, {className: 'tom-' + statements[i].value});
            // TODO add callback to jmHighlight and put there what's now in MutationObserver, allow multiple texts search if possible
//            } catch (ex) {
//            }
        }
    });
}

function on_domain(domain_url) {
    get_act(domain_url + "articles/", function(xhr) {
        var articles = JSON.parse(xhr.responseText);

        for(i=0;i<articles.length; i++) {
           if (articles[i].src == document.location.href) {
             on_article(articles[i].url)
             break;
           }
        }
    });
}

get_act(api_endpoint + "domains/", function(xhr) {
    var domains = JSON.parse(xhr.responseText);

    var host = document.location.hostname;
    if (host.startsWith('www.')) {
        host = host.substr(4);
    }
    // TODO store domains (and articles maybe) on local storage, update them regularly

    for(i=0;i<domains.length; i++) {
        if (domains[i].src == host) {
            on_domain(domains[i].url);
            break;
        }
    }
});


// resolve Uncaught DOMException: Failed to read the 'contentDocument' property from 'HTMLIFrameElement': Blocked a frame with origin "http://wpolityce.pl" from accessing a cross-origin frame.(…)
// on http://wpolityce.pl/polityka/200443-jaroslaw-kaczynski-dla-wpolitycepl-przed-wyborami-w-2015-roku-musimy-zjednoczyc-prawice-nasz-wywiad

/* 
Na każdej stronie:
1. Sprawdzić, czy na stronie występuje nazwisko polityka
2. Gdy tak to pobiera liste wszystkich wypowiedzi ze statusem i linkiem (opcjonalnie może także wysłać stronę, na której jest w takim wypadku gdy mamy ją w bazie od razu można stwierdzienia podpowiedzieć (albo ze ich nie ma))
3. Gdy nie ma konkretnego stwierdzenia to wyszukuje wszystkie na stronie - gdy znalazł to wysyla podpowiedz do serwera


// API
1. lista politykow do local storage
2. lista wypowiedzi polityka (id polityka + aktualna strona (opcjonalnie))
   -> lista wszysstkich wypowiedzi
   lub
   -> info o tych, ktore wystepuja na danej stronie (lub info ze nie ma)
3. raportowanie z występowania na stronie tekstow
*/