import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');

let query = '';
let selectedYear = null; 
const colors = d3.scaleOrdinal(d3.schemeTableau10);
const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
const sliceGenerator = d3.pie().value((d) => d.value);

function filterProjects() {
  let filtered = projects.filter((project) => {
    let values = Object.values(project)
      .flatMap((val) => (Array.isArray(val) ? val : [val]))
      .filter(Boolean)
      .join('\n')
      .toLowerCase();
    return values.includes(query.toLowerCase());
  });

  let rolledData = d3.rollups(
    filtered,
    (v) => v.length,
    (d) => d.year
  );

  let pieData = rolledData.map(([year, count]) => ({
    value: count,
    label: year,
  }));

  if (selectedYear && !pieData.some((d) => String(d.label) === String(selectedYear))) {
    selectedYear = null;
  }

  renderPieChart(pieData);

  if (selectedYear !== null) {
    filtered = filtered.filter((project) => String(project.year) === String(selectedYear));
  }

  renderProjects(filtered, projectsContainer, 'h2');
  const titleElement = document.querySelector('.projects-title');
  if (titleElement) {
    titleElement.textContent = `${filtered.length} Projects`;
  }
}

function renderPieChart(pieData) {
  const svg = d3.select('#projects-pie-plot');
  const legend = d3.select('.legend');

  svg.selectAll('path').remove();
  legend.selectAll('li').remove();

  if (!pieData || pieData.length === 0) return;

  const arcData = sliceGenerator(pieData);
  const arcs = arcData.map((d) => arcGenerator(d));

  // Render pie slices
  arcs.forEach((arc, i) => {
    const isSelected = String(pieData[i].label) === String(selectedYear);

    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .attr('class', isSelected ? 'selected' : '')
      .on('click', () => {
        selectedYear = isSelected ? null : pieData[i].label;
        filterProjects();
      });
  });

  pieData.forEach((d, idx) => {
    const isSelected = String(d.label) === String(selectedYear);

    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', `legend-item ${isSelected ? 'selected' : ''}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
        selectedYear = isSelected ? null : d.label;
        filterProjects();
      });
  });
}

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    query = event.target.value;
    filterProjects();
  });
}

filterProjects();