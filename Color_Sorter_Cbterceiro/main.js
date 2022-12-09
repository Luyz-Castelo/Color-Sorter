import { countTimeSpentOnFunction } from "../helpers/countTimeSpentOnFunction.js";
import { Color } from "../helpers/model/color.js"
import { RGBColor } from "../helpers/model/rgbColor.js"
import { HEXColor } from "../helpers/model/hexColor.js"
import { HSLColor } from "../helpers/model/hslColor.js"
import { Cluster } from "../helpers/model/cluster.js"

// Here the concept of STORE is used because cbterceiro was teaching me about it

const STORE = {
	colors: [],
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
};

function main() {
  const redirectToChoicesPage = document.querySelector('#redirect-to-choices-page');
	redirectToChoicesPage.addEventListener('click', () => window.location = '/index.html');

  const createRandomBoxColor = document.querySelector('#create-random-box-color-button');
  const createTenRandomBoxColor = document.querySelector('#create-ten-random-box-color-button');
  const createHundredRandomBoxColor = document.querySelector('#create-hundred-random-box-color-button');
  const createThousandRandomBoxColor = document.querySelector('#create-thousand-random-box-color-button');
  const sortColorContainer = document.querySelector('#sort-color-container-button')

  const alternateBetweenBasicAndComplexVisualization = document.querySelector('#alternate-between-basic-and-complex-visualization');

  createRandomBoxColor.addEventListener('click', () => countTimeSpentOnFunction(createRandomColoredBox, [1]));
  createTenRandomBoxColor.addEventListener('click', () => countTimeSpentOnFunction(createRandomColoredBox, [10]));
  createHundredRandomBoxColor.addEventListener('click', () => countTimeSpentOnFunction(createRandomColoredBox, [100]));
  createThousandRandomBoxColor.addEventListener('click', () => countTimeSpentOnFunction(createRandomColoredBox, [1000]));
  sortColorContainer.addEventListener('click', () => countTimeSpentOnFunction(sortColors))

	alternateBetweenBasicAndComplexVisualization.addEventListener('click', alternateBetweenBasicAndComplexVisualizationFunc)
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

function createRandomColoredBox(quantityOfTimes = 1) {
  const createdColors = createRandomColors(quantityOfTimes);

  addColorsInStore(createdColors);
  addColorsInClustersStore(createdColors);
  addColorsDiv(createdColors);
}

function alternateBetweenBasicAndComplexVisualizationFunc() {
	if (STORE.visualizationMode === 'basic')  {
    STORE.visualizationMode = 'complex';
	} else {
		STORE.visualizationMode = 'basic';
	}

  document.querySelector('.container').className = `container color-container-${STORE.visualizationMode}`;
}

function sortColors() {
  sortColorsInClusters();

  updateStoreColorsBasedOnClusters();

  updateAllColorDivs();
}

function createRandomColors(quantityOfTimes = 1) {
  const createdColors = [];
  let i = 0;
  while (i < quantityOfTimes) {
		const randomColor = getRandomColor();

		if(colorAlreadyExistsInStore(randomColor)) {
      continue;
    }

    createdColors.push(randomColor);
    i++;
  }
  return createdColors;
}

function colorAlreadyExistsInStore(randomColor) {
  // TODO melhoria de performance
  return STORE.colors.includes(c => c.colorInHex.hexString === randomColor.colorInHex.hexString);
}

function addColorsInStore(randomColors) {
  STORE.colors.push(...randomColors);
}

function addColorsInClustersStore(randomColors) {
  randomColors.forEach((color) => {
    let minDistance;
    let minDistanceClusterIndex;

    STORE.clusters.forEach((cluster, clusterIndex) => {
      const distance = colorDistance(color.colorInRGB, cluster.leadColor);
      if (typeof minDistance === 'undefined' || minDistance > distance) {
        minDistance = distance;
        minDistanceClusterIndex = clusterIndex;
      }
    });

		STORE.clusters[minDistanceClusterIndex].colors.push(color);
  });
}

function addColorsDiv(randomColors) {
  const colorContainerDiv = document.querySelector('#color-container');

  randomColors.forEach(randomColor => {
    const colorBoxElement = createRandomColorBoxElement(randomColor);
    colorContainerDiv.appendChild(colorBoxElement);
  });
}

function createRandomColorBoxElement(randomColor) {
  const div = createDivWithStyle(randomColor);
  const span = createSpanWithStyle(randomColor);

  div.appendChild(span);

  return div;
}

function createDivWithStyle(randomColor) {
  const div = document.createElement('div');

	div.classList.add('box');

  div.title = JSON.stringify(randomColor.colorInRGB);
  div.style.backgroundColor = randomColor.colorInHex.hexString;

  return div;
}

function createSpanWithStyle(randomColor) {
  const span = document.createElement('span');

  span.innerText = randomColor.colorInHex.hexString;

  return span;
}

function updateDivWithStyle(div, color) {
	div.title = JSON.stringify(color.colorInRGB);
  div.style.backgroundColor = color.colorInHex.hexString;

  div.querySelector('span').innerText = color.colorInHex.hexString;
}

function sortColorsInClusters() {
  STORE.clusters.forEach((cluster) => {
		const dim = ['white', 'grey', 'black'].includes(cluster.name) ? 'lightness' : 'saturation';
    cluster.colors = oneDimensionSorting(cluster.colors, dim);
  });
}

function updateStoreColorsBasedOnClusters() {
  STORE.colors = STORE.clusters.flatMap(cluster => cluster.colors);
}

function updateAllColorDivs() {
  const colorContainerDiv = document.querySelector('#color-container');

  const colors = STORE.colors;
  const colorDivs = colorContainerDiv.childNodes;

  if (colors.length !== colorDivs.length) {
    throw new Error(`colors.length (${colors.length}) is different than colorDivs.length (${colorDivs.length})!`);
  }

  colors.forEach((color, index) => {
    const div = colorDivs[index];
    updateDivWithStyle(div, color);
  });
}


// -----------------------------------------------------------------------------------
// Adapted code that i've copied from the internet

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
