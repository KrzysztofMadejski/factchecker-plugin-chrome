//$('#artykul').css('background-color', 'red')

// http://demagog.org.pl/politycy/jaroslaw-kaczynski/
var text = "12 maja 1990 roku, czyli datę powstania";
var elem = $('*:contains()').last();
// TODO case sensitive, TODO breaked by <i> etc.

// TODO matches <all_urls>

// Add all the info about statement (TODO extend jmHighlight to perform cusstom function)

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes.length && mutation.addedNodes[0].className == 'tom-truth') {
    	el = $(mutation.addedNodes[0]);

    	img_url = chrome.extension.getURL("images/ico-yes-enabled.png");
    	el.append('<span class="tom-marker">Prawda</span>');
    }
  });    
});

observer.observe(document.body,  { childList: true, subtree: true });

$('body').jmHighlight(text, {className: 'tom-truth'});

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