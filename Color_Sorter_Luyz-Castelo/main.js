import { countTimeSpentOnFunction } from "../helpers/countTimeSpentOnFunction.js";
import { Color } from "../helpers/model/color.js"
import { RGBColor } from "../helpers/model/rgbColor.js"
import { HEXColor } from "../helpers/model/hexColor.js"
import { HSLColor } from "../helpers/model/hslColor.js"
import { Cluster } from "../helpers/model/cluster.js"

// Here the concept of STORE is used, now that i refactored my code

const STORE = {
	colors_in_screen: [],
	clusters: [
    new Cluster('red', new RGBColor(255, 0, 0), []),
    new Cluster('orange', new RGBColor(255, 128, 0), []),
    new Cluster('yellow', new RGBColor(255, 255, 0), []),
    new Cluster('chartreuse', new RGBColor(128, 255, 0), []),
    new Cluster('green', new RGBColor(0, 255, 0), []),
    new Cluster('spring green', new RGBColor(0, 255, 128), []),
    new Cluster('cyan', new RGBColor(0, 255, 255), []),
    new Cluster('azure', new RGBColor(0, 127, 255), []),
    new Cluster('blue', new RGBColor(0, 0, 255), []),
    new Cluster('violet', new RGBColor(127, 0, 255), []),
    new Cluster('magenta', new RGBColor(255, 0, 255), []),
    new Cluster('rose', new RGBColor(255, 0, 128), []),
    new Cluster('black', new RGBColor(0, 0, 0), []),
    new Cluster('grey', new RGBColor(235, 235, 235), []),
    new Cluster('white', new RGBColor(255, 255, 255), []),
	],
	visualizationMode: 'basic',
  timeSpentOnFunctions: [],
};

/*
	// Here is how it was done before i refactored the code
	const COLORS_IN_SCREEN = []

	const CLUSTERS = [
		new Cluster ('red', [255, 0, 0], []),
		new Cluster ('orange', [255, 128, 0], []),
		new Cluster ('yellow', [255, 255, 0], []),
		new Cluster ('chartreuse', [128, 255, 0], []),
		new Cluster ('green', [0, 255, 0], []),
		new Cluster ('spring green', [0, 255, 128], []),
		new Cluster ('cyan', [0, 255, 255], []),
		new Cluster ('azure', [0, 127, 255], []),
		new Cluster ('blue', [0, 0, 255], []),
		new Cluster ('violet', [127, 0, 255], []),
		new Cluster ('magenta', [255, 0, 255], []),
		new Cluster ('rose', [255, 0, 128], []),
		new Cluster ('black', [0, 0, 0], []),
		new Cluster ('grey', [235, 235, 235], []),
		new Cluster ('white', [255, 255, 255], []),
	];

	let VISUALIZATION_MODE = 'basic';
*/

function main() {
	const redirectToChoicesPage = document.querySelector('#redirect-to-choices-page');
	redirectToChoicesPage.addEventListener('click', () => window.location = '/index.html');

  const createRandomBoxColor = document.querySelector('#create-random-box-color-button');
  const createTenRandomBoxColor = document.querySelector('#create-ten-random-box-color-button');
  const createHundredRandomBoxColor = document.querySelector('#create-hundred-random-box-color-button');
  const createThousandRandomBoxColor = document.querySelector('#create-thousand-random-box-color-button');
  const sortColorContainer = document.querySelector('#order-color-container-button');
	
  const alternateBetweenBasicAndComplexVisualization = document.querySelector('#alternate-between-basic-and-complex-visualization');
	// const getTimesSpentOnFunctions = document.querySelector('#get-times-spent-on-functions');

  createRandomBoxColor.addEventListener('click', () =>  countTimeSpentOnFunction(createRandomColoredBox, [1], `createRandomColoredBox`));
  createTenRandomBoxColor.addEventListener('click', () => countTimeSpentOnFunction(createRandomColoredBox, [10], `createRandomColoredBox`));
  createHundredRandomBoxColor.addEventListener('click', () => countTimeSpentOnFunction(createRandomColoredBox, [100], `createRandomColoredBox`));
  createThousandRandomBoxColor.addEventListener('click', () => countTimeSpentOnFunction(createRandomColoredBox, [1000], `createRandomColoredBox`));
  sortColorContainer.addEventListener('click', () => countTimeSpentOnFunction(sortColors));
	
	alternateBetweenBasicAndComplexVisualization.addEventListener('click', alternateBetweenBasicAndComplexVisualizationFunc);
	// getTimesSpentOnFunctions.addEventListener('click', getLocalStorage);
}

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  const colorInRGB = new RGBColor(r, g, b)
  const colorInHsl = new HSLColor(r, g, b)
	const colorInHex = new HEXColor(r, g, b)
  
  return new Color(colorInRGB, colorInHsl, colorInHex)
}

function createRandomColoredBox(quantityOfColorsToBeCreated = 1) {
	const colorContainerDiv = document.querySelector('#color-container');
	let i = 0;
	while (i < quantityOfColorsToBeCreated) {
		const randomColor = getRandomColor();
		
		if(STORE.colors_in_screen.includes(c => c.colorInHex.hexString === randomColor.colorInHex.hexString)) continue;
			
		STORE.colors_in_screen.push(randomColor);
		
		const colorBoxElement = createRandomColorBoxElement(randomColor);
		colorContainerDiv.appendChild(colorBoxElement);
		
		i++;
	}
}
 
function alternateBetweenBasicAndComplexVisualizationFunc() {
	if (STORE.visualizationMode === 'basic')  {
		document.querySelector('.container').className = 'container color-container-complex';
		STORE.visualizationMode = 'complex';
	} else {
		document.querySelector('.container').className = 'container color-container-basic';
		STORE.visualizationMode = 'basic';
	} 
}

function createRandomColorBoxElement(randomColor) {
	const div = createDivWithStyle(randomColor);
	const span = createSpanWithStyle(randomColor);

	div.appendChild(span);

	return div;
}

function createDivWithStyle(randomColor) {
  const div = document.createElement('div');

	div.classList.add('box')
  div.title = JSON.stringify(randomColor.colorInRGB);

  div.style.backgroundColor = randomColor.colorInHex.hexString;
  div.style.display = 'flex';
  div.style.justifyContent = 'center';
  
  return div;
}

function createSpanWithStyle(randomColor) {
  const span = document.createElement('span');

  span.style.backgroundColor = '#F0F0F0';
  span.innerText = randomColor.colorInHex.hexString;

  span.style.margin = 'auto';
  span.style.padding = '1px';
  span.style.border = '1px solid';

  return span;
}

function updateDivStyle(div, color) {
	div.title = JSON.stringify(color.colorInRGB);
	div.style.backgroundColor = color.colorInHex.hexString;
}

function sortColors() {
  const colorContainerDiv = document.querySelector('#color-container');
  
	const colorsInContainer = [...STORE.colors_in_screen]
  
  sortWithClusters(colorsInContainer)

  const clustersWithColors = [...STORE.clusters].filter(cluster => cluster.colors.length !== 0);
	
	const clusterColors = clustersWithColors.map(cluster => cluster.colors).flat();

	colorContainerDiv.childNodes.forEach((node, index) => {
		updateDivStyle(node, clusterColors[index]);
	});
}



// -----------------------------------------------------------------------------------
// Adapted code that i've copied from the internet


function sortWithClusters(colorsToSort) {
	STORE.clusters.forEach(cluster => cluster.colors = [])
  // const clusters = [...]; // as defined above
  colorsToSort.forEach((color) => {
    let minDistance;
    let minDistanceClusterIndex;
    STORE.clusters.forEach((cluster, clusterIndex) => {
      const distance = colorDistance(color.colorInRGB, cluster.leadColor);
      if (typeof minDistance === 'undefined' || minDistance > distance) {
        minDistance = distance;
        minDistanceClusterIndex = clusterIndex;
      }
    });
		STORE.clusters[minDistanceClusterIndex].colors.push(color)
  });
  STORE.clusters.forEach((cluster) => {
		const dim = ['white', 'grey', 'black'].includes(cluster.name) ? 'lightness' : 'saturation';
    cluster.colors = oneDimensionSorting(cluster.colors, dim)
  });
}

function colorDistance(color1, color2) {
  const x =
    Math.pow(color1.r - color2.r, 2) +
    Math.pow(color1.g - color2.g, 2) +
    Math.pow(color1.b - color2.b, 2);
  return Math.sqrt(x);
}

function oneDimensionSorting(colors, dim) {
  return colors
    .sort((colorA, colorB) => {
      if (colorA.colorInHsl[dim] < colorB.colorInHsl[dim]) {
        return -1;
      } else if (colorA.colorInHsl[dim] > colorB.colorInHsl[dim]) {
        return 1;
      } else {
        return 0;
      }
    });
}



// -----------------------------------------------------------------------------------

main();
