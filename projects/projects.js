import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');

let query = '';
let selectedIndex = -1;

const colors = d3.scaleOrdinal(d3.schemeTableau10);
const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
const sliceGenerator = d3.pie().value((d) => d.value);

function applyFilters() {
  let filtered = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  let rolledData = d3.rollups(
    filtered,
    (v) => v.length,
    (d) => d.year,
  );
  let pieData = rolledData.map(([year, count]) => ({
    value: count,
    label: year,
  }));

  renderPieChart(pieData);

  if (selectedIndex !== -1 && pieData[selectedIndex]) {
    const selectedYear = pieData[selectedIndex].label;
    filtered = filtered.filter((project) => project.year === selectedYear);
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

  // Clear previous paths and legend items
  svg.selectAll('path').remove();
  legend.selectAll('li').remove();

  if (!pieData || pieData.length === 0) return;

  const arcData = sliceGenerator(pieData);
  const arcs = arcData.map((d) => arcGenerator(d));

  arcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .attr('class', i === selectedIndex ? 'selected' : '')
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        applyFilters();
      });
  });

  pieData.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', `legend-item ${idx === selectedIndex ? 'selected' : ''}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;
        applyFilters();
      });
  });
}

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    query = event.target.value;
    selectedIndex = -1;
    applyFilters();
  });
}

applyFilters();