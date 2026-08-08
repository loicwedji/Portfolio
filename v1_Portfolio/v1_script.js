const visitorTotal = document.querySelector('#visitor-total');

if (visitorTotal) {
  fetch('https://visitor.6developer.com/visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      domain: window.location.hostname || 'loicwedji-portfolio',
      page_path: '/v1',
      page_title: document.title,
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Visitor counter request failed');
      return response.json();
    })
    .then((result) => {
      const total = result.totalCount;

      if (typeof total !== 'number') throw new Error('Invalid visitor count');

      visitorTotal.textContent = total.toLocaleString();
    })
    .catch(() => {
      visitorTotal.textContent = '—';
      visitorTotal.parentElement.title = 'Visitor count unavailable';
    });
}
