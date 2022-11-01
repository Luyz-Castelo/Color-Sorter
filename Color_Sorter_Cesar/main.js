class Color {
  constructor(colorInRgb, colorInHsl, colorInHex) {
    this.colorInRGB = colorInRgb;
    this.colorInHsl = colorInHsl;
		this.colorInHex = colorInHex;
  }
}

class RGBColor {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
}

class HSLColor {
  constructor(r, g, b) {
    this.hue = calculateHue(r, g, b);
    this.saturation = calculateSaturation(r, g, b);
    this.lightness = calculateLightness(r, g, b);
  }
}

class HEXColor {
	constructor(r, g, b) {
    this.redHex = r.toString(16).padStart(2, '0');
    this.greenHex = g.toString(16).padStart(2, '0');
    this.blueHex = b.toString(16).padStart(2, '0');

		this.hexString = `#${this.redHex}${this.greenHex}${this.blueHex}`
  }
}

class Cluster {
  constructor(name, leadColor, colors) {
    this.name = name;
    this.leadColor = leadColor;
    this.colors = colors;
  }
}

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
  const createRandomBoxColor = document.querySelector('#create-random-box-color-button');
  const createTenRandomBoxColor = document.querySelector('#create-ten-random-box-color-button');
  const createHundredRandomBoxColor = document.querySelector('#create-hundred-random-box-color-button');
  const createThousandRandomBoxColor = document.querySelector('#create-thousand-random-box-color-button');
  const alternateBetweenBasicAndComplexVisualization = document.querySelector('#alternate-between-basic-and-complex-visualization');
  const sortColorContainer = document.querySelector('#sort-color-container-button')

  createRandomBoxColor.addEventListener('click', () => createRandomColoredBox());
  createTenRandomBoxColor.addEventListener('click', () => createRandomColoredBox(10));
  createHundredRandomBoxColor.addEventListener('click', () => createRandomColoredBox(100));
  createThousandRandomBoxColor.addEventListener('click', () => createRandomColoredBox(1000));
	alternateBetweenBasicAndComplexVisualization.addEventListener('click', alternateBetweenBasicAndComplexVisualizationFunc)
  sortColorContainer.addEventListener('click', sortColors)
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
  console.time('sortColors');
  sortColorsInClusters();
  // console.timeEnd('sortColorsInClusters');

  // console.time('updateStoreColorsBasedOnClusters');
  updateStoreColorsBasedOnClusters();
  // console.timeEnd('updateStoreColorsBasedOnClusters');

  // console.time('updateAllColorDivs');
  updateAllColorDivs();
  console.timeEnd('sortColors');
}

function createRandomColors(quantityOfTimes = 1) {
  const createdColors = [];
	console.time(`createRandomColors(${quantityOfTimes})`)
  let i = 0;
  while (i < quantityOfTimes) {
		const randomColor = getRandomColor();

		if(colorAlreadyExistsInStore(randomColor)) {
      continue;
    }

    createdColors.push(randomColor);
    i++;
  }
	console.timeEnd(`createRandomColors(${quantityOfTimes})`)
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

function calculateLightness(R, G, B)
{
	let Max = 0.0
	let Min = 0.0

	let fR = R / 255.0;
	let fG = G / 255.0;
	let fB = B / 255.0;

	if(fR >= fG && fR >= fB)
		Max = fR;
	else if(fG >= fB && fG >= fR)
		Max = fG;
	else if(fB >= fG && fB >= fR)
		Max = fB;

	if(fR <= fG && fR <= fB)
		Min = fR;
	else if(fG <= fB && fG <= fR)
		Min = fG;
	else if(fB <= fG && fB <= fR)
		Min = fB;

	let Lightness = (Min + Max) / 2.0;

	return Lightness;
}

function calculateSaturation(R, G, B)
{
	let Max = 0.0;
	let Min = 0.0;

	let fR = R / 255.0;
	let fG = G / 255.0;
	let fB = B / 255.0;

	if(fR >= fG && fR >= fB)
		Max = fR;
	else if(fG >= fB && fG >= fR)
		Max = fG;
	else if(fB >= fG && fB >= fR)
		Max = fB;

	if(fR <= fG && fR <= fB)
		Min = fR;
	else if(fG <= fB && fG <= fR)
		Min = fG;
	else if(fB <= fG && fB <= fR)
		Min = fB;

	let Lightness = calculateLightness(R, G, B);

	let Saturation;

	if(Max == Min)
	{
		Saturation = -1.0;
	}
	else
	{
		if(Lightness < 0.5)
		{
			Saturation = (Max - Min) / (Max + Min);
		}
		else
		{
			Saturation = (Max - Min) / (2.0 - Max - Min);
		}
	}

	return Saturation;
}

function calculateHue(R, G, B)
{
	let Max = 0.0;
	let Min = 0.0;

	let fR = R / 255.0;
	let fG = G / 255.0;
	let fB = B / 255.0;

	if(fR >= fG && fR >= fB)
		Max = fR;
	else if(fG >= fB && fG >= fR)
		Max = fG;
	else if(fB >= fG && fB >= fR)
		Max = fB;

	if(fR <= fG && fR <= fB)
		Min = fR;
	else if(fG <= fB && fG <= fR)
		Min = fG;
	else if(fB <= fG && fB <= fR)
		Min = fB;

	let Hue;

	if(Max == Min)
	{
		Hue = -1.0;
	}
	else
	{
		if(Max == fR)
		{
			Hue = (fG - fB) / (Max - Min);
		}
		else if(Max == fG)
		{
			Hue = 2.0 + (fB - fR) / (Max - Min);
		}
		else if(Max == fB)
		{
			Hue = 4.0 + (fR - fG) / (Max - Min);
		}

		Hue *= 60.0;

		if(Hue < 0.0)
		{
			Hue += 360.0;
		}
	}

	return Hue;
}

// -----------------------------------------------------------------------------------


main();
