// Loads posts from _data/posts.json and renders them into .news-grid elements
async function loadNews(options = {}) {
  const { limit = null, container = '.news-grid', showAll = false } = options;
  const el = document.querySelector(container);
  if (!el) return;

  try {
    const res = await fetch('/data/posts.json');
    let posts = await res.json();
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (limit) posts = posts.slice(0, limit);

    if (posts.length === 0) {
      el.innerHTML = '<p style="color:#64748b">No updates yet.</p>';
      return;
    }

    el.innerHTML = posts.map(post => `
      <article class="news-card">
        ${post.image ? `<img class="news-card-img" src="${post.image}" alt="${post.title}" loading="lazy">` : `<div class="news-card-img" style="display:flex;align-items:center;justify-content:center;"><svg width="48" height="48" viewBox="0 0 24 24" fill="#A8B8C4"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg></div>`}
        <div class="news-card-body">
          <p class="news-card-date">${formatDate(post.date)}</p>
          <h3 class="news-card-title">${post.title}</h3>
          <p class="news-card-excerpt">${post.excerpt || ''}</p>
          ${post.slug ? `<a href="/news/${post.slug}.html">Read more →</a>` : ''}
        </div>
      </article>
    `).join('');
  } catch (e) {
    el.innerHTML = '<p style="color:#64748b">Unable to load updates.</p>';
  }
}

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.news-grid[data-limit]')) {
    const limit = parseInt(document.querySelector('.news-grid[data-limit]').dataset.limit);
    loadNews({ limit });
  } else if (document.querySelector('.news-grid')) {
    loadNews();
  }
});
