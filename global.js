console.log('IT’S ALIVE!');

export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

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

for (const p of pages) {
  let url = p.url;
  const title = p.title;

  url = !url.startsWith('http') ? BASE_PATH + url : url;

  const a = document.createElement('a');
  a.href = url;
  a.textContent = title;

  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname,
  );

  if (a.host !== location.host) {
    a.target = '_blank';
    a.rel = 'noreferrer noopener';
  }

  nav.append(a);
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

function setColorScheme(colorScheme) {
  document.documentElement.style.setProperty('color-scheme', colorScheme);
  if (select) {
    select.value = colorScheme;
  }
}

select?.addEventListener('input', function (event) {
  const scheme = event.target.value;
  setColorScheme(scheme);
  localStorage.colorScheme = scheme;
});

if ('colorScheme' in localStorage) {
  setColorScheme(localStorage.colorScheme);
}

const form = document.querySelector('form');

form?.addEventListener('submit', function (event) {
  event.preventDefault();

  const data = new FormData(form);
  const params = [];

  for (const [name, value] of data) {
    params.push(`${name}=${encodeURIComponent(value)}`);
  }

  const url = `${form.action}?${params.join('&')}`;
  location.href = url;
});