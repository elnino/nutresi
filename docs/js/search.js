// Search Content from JSON

(function() {
  const form = document.querySelector('.search');
  const note = document.querySelector('.note');
  
  // Match the url.
  const find = window.location.href.match(/\?kalori=([^&]+)/);
  
  if (!find) {
    note.innerText = 'Coba kata kunci semisal: \u201Capel\u201D.';
    return;
  }
  
  // Get the search query.
  const query = decodeURIComponent(find[1].replace(/\+/g, ' '));
  
  form.value = query;
  
  note.innerText = 'Tunggu! Mencari: \u201C' + query + '\u201D.';
  
  const pat = new RegExp(query.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  
  // Search the keywords.
  const keys = ['t', 'k'];
  
  const withKeys = keys.length;
  
  function search(item) {
    for (var i = 0; i < withKeys; i++) {
      const key = keys[i];
      
      if (query.length < 3) {
        return false;
      } else if (pat.test(item[key].toLowerCase())) {
        return true;
      }
    }
    
    return false;
  }
  
  // Request JSON.
  var httpRequest = new XMLHttpRequest();
  
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState !== 4) { return; }
    
    // Print connection error.
    if (httpRequest.status !== 200) {
      note.innerText = 'Terjadi masalah. Silakan coba lagi.';
      return;
    }
    
    const results = JSON.parse(httpRequest.responseText).filter(search);
    
    const numResults = results.length;
    
    // Print not found.
    if (numResults === 0) {
      note.innerText =
        'Tidak ada hasil untuk: \u201C' +
        query +
        '\u201D. Coba cari yang umum semisal: \u201Capel\u201D atau \u201Cstarbucks\u201D.';
      return;
    }
    
    // Print search results.    
    note.innerText = 'Ditemukan ' + numResults + ' hasil untuk: \u201C' + query + '\u201D.';
    
    var searchItems = "";
    
    for (var i = 0; i < numResults; i++) {
      searchItems +=
        '<article><div class="product"><h2>' +
        results[i].t +
        '</h2><p>Per ' +
        results[i].s +
        '</p></div><div class="nutrition"><p>Protein<br><span>' +
        results[i].p +
        '</span>g</p><p>Lemak<br><span>' +
        results[i].f +
        '</span>g</p><p>Karbohidrat<br><span>' +
        results[i].o +
        '</span>g</p></div><div class="calorie"><p><i class="emoji-fire"></i><span>' +
        results[i].c +
        '</span>kkal</p><p><i class="emoji-shoe"></i><span>' +
        results[i].j +
        '</span>km</p></div></article>';
    }
    
    document.querySelector('main').insertAdjacentHTML('beforeend', '<section></section>');
    
    document.querySelector('section').innerHTML = searchItems;
  };
  
  httpRequest.open('GET', '/index.json');
  
  httpRequest.send();
})();