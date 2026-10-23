import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects ? projects.slice(0, 3) : [];
const projectsContainer = document.querySelector('.projects');

if (projectsContainer) {
  renderProjects(latestProjects, projectsContainer, 'h3');
}

const githubData = await fetchGitHubData('yhu67852');
const profileStats = document.querySelector('#profile-stats');

if (profileStats && githubData) {
  profileStats.innerHTML = `
    <h2>My GitHub Stats</h2>
    <dl>
      <dt>FOLLOWERS</dt><dd>${githubData.followers ?? 0}</dd>
      <dt>FOLLOWING</dt><dd>${githubData.following ?? 0}</dd>
      <dt>PUBLIC REPOS</dt><dd>${githubData.public_repos ?? 0}</dd>
      <dt>PUBLIC GISTS</dt><dd>${githubData.public_gists ?? 0}</dd>
    </dl>
  `;
}