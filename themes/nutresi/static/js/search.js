// Search Content from JSON

(function() {
  const form = document.querySelector('.search');
  const note = document.querySelector('.note');
  const find = window.location.href.match(/\?kalori=([^&]+)/);
  
  if (!find) {
    note.innerText = 'Coba kata kunci semisal: \u201Capel\u201D.';
    return;
  }
  
  const query = decodeURIComponent(find[1].replace(/\+/g, ' '));
  
  form.value = query;
  
  note.innerText = 'Mencari "' + query + '"\u2026';
  
  const pat = new RegExp(query.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  
  const keys = ['title', 'key'];
  
  function search(item) {
    for (var i = 0; i < keys.length; i++) {
      const key = keys[i];
      
      if (query.toLowerCase().length < 3) {
        return false;
      } else if (pat.test(item[key].toLowerCase())) {
        return true;
      }
    }
    
    return false;
  }
  
  var httpRequest = new XMLHttpRequest();
  
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState !== 4) { return; }
    
    if (httpRequest.status !== 200) {
      note.innerText = 'Terjadi masalah. Silakan coba lagi.';
      return;
    }
    
    const results = JSON.parse(httpRequest.responseText).filter(search);
    const numResults = results.length;
    
    if (numResults === 0) {
      note.innerText =
        'Tidak ada hasil untuk: \u201C' +
        query +
        '\u201D. Coba cari yang umum semisal: \u201Capel\u201D atau \u201Cstarbucks\u201D.';
      return;
    }
    
    note.innerText = 'Ditemukan ' + numResults + ' hasil untuk \u201C' + query + '\u201D.';
    
    var searchItems = "";
    
    for (var i = 0; i < numResults; i++) {
      searchItems +=
        '<article><div class="product"><h2>' +
        results[i].title +
        '</h2><p>Per ' +
        results[i].serving +
        '</p></div><div class="nutrition"><p>Protein<br><span>' +
        results[i].protein +
        '</span>g</p><p>Lemak<br><span>' +
        results[i].fat +
        '</span>g</p><p>Karbohidrat<br><span>' +
        results[i].carb +
        '</span>g</p></div><div class="calorie"><p><i class="emoji-fire"></i><span>' +
        results[i].calorie +
        '</span>kkal</p><p><i class="emoji-shoe"></i><span>' +
        results[i].jog +
        '</span>km</p></div></article>';
    }
    
    document.querySelector('main').insertAdjacentHTML('beforeend', '<section></section>');
    
    document.querySelector('section').innerHTML = searchItems;
  };
  
  httpRequest.open('GET', '/index.json');
  
  httpRequest.send();
})();