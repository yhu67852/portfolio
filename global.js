console.log('IT’S ALIVE!');

export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
    return [];
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  if (!containerElement) return;

  containerElement.innerHTML = '';

  const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const headingTag = validHeadings.includes(headingLevel) ? headingLevel : 'h2';

  for (const project of projects) {
    const article = document.createElement('article');
    article.innerHTML = `
      <${headingTag}>${project.title} (${project.year || ''})</${headingTag}>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;
    containerElement.appendChild(article);
  }
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}

function setColorScheme(colorScheme) {
  document.documentElement.style.setProperty('color-scheme', colorScheme);
  const select = document.querySelector('#theme-select');
  if (select) {
    select.value = colorScheme;
  }
}

if ('colorScheme' in localStorage) {
  setColorScheme(localStorage.colorScheme);
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select id="theme-select">
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `,
);

const select = document.querySelector('#theme-select');

if ('colorScheme' in localStorage) {
  setColorScheme(localStorage.colorScheme);
}

select?.addEventListener('input', function (event) {
  const scheme = event.target.value;
  setColorScheme(scheme);
  localStorage.colorScheme = scheme;
});

const pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'resume/', title: 'Resume' },
  { url: 'https://github.com/yhu67852', title: 'GitHub' },
];

const BASE_PATH =
  location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? '/'
    : '/portfolio/';

const nav = document.createElement('nav');
document.body.prepend(nav);

const currentPath = location.pathname.replace(/index\.html$/, '');

for (const p of pages) {
  let url = p.url;
  const title = p.title;

  url = !url.startsWith('http') ? BASE_PATH + url : url;

  const a = document.createElement('a');
  a.href = url;
  a.textContent = title;

  const linkPath = a.pathname.replace(/index\.html$/, '');

  if (a.host === location.host && linkPath === currentPath) {
    a.classList.add('current');
  }

  if (a.host !== location.host) {
    a.target = '_blank';
    a.rel = 'noreferrer noopener';
  }

  nav.append(a);
}

const form = document.querySelector('form');
form?.addEventListener('submit', function (event) {
  event.preventDefault();
  const data = new FormData(form);
  const params = [];
  for (const [name, value] of data) {
    params.push(`${name}=${encodeURIComponent(value)}`);
  }
  location.href = `${form.action}?${params.join('&')}`;
});