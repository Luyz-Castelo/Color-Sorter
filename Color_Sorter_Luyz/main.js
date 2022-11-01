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


function main() {
  const createRandomBoxColor = document.querySelector('#create-random-box-color-button');
  const createTenRandomBoxColor = document.querySelector('#create-ten-random-box-color-button');
  const createHundredRandomBoxColor = document.querySelector('#create-hundred-random-box-color-button');
  const createThousandRandomBoxColor = document.querySelector('#create-thousand-random-box-color-button');
  const alternateBetweenBasicAndComplexVisualization = document.querySelector('#alternate-between-basic-and-complex-visualization');
  const orderColorContainer = document.querySelector('#order-color-container-button')

  createRandomBoxColor.addEventListener('click', () => createRandomColoredBox());
  createTenRandomBoxColor.addEventListener('click', () => createRandomColoredBox(10));
  createHundredRandomBoxColor.addEventListener('click', () => createRandomColoredBox(100));
  createThousandRandomBoxColor.addEventListener('click', () => createRandomColoredBox(1000));
	alternateBetweenBasicAndComplexVisualization.addEventListener('click', alternateBetweenBasicAndComplexVisualizationFunc)
  orderColorContainer.addEventListener('click', orderColorContainerDiv)
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
	console.time(`createRandomColoredBoxes(${quantityOfTimes})`)
	const colorContainerDiv = document.querySelector('#color-container');
	let i = 0;
	while (i < quantityOfTimes) {
		const randomColor = getRandomColor();

		if(COLORS_IN_SCREEN.includes(c => c.colorInHex.hexString === randomColor.colorInHex.hexString)) continue;
		
		COLORS_IN_SCREEN.push(randomColor);
		
		const colorBoxElement = createRandomColorBoxElement(randomColor);
		colorContainerDiv.appendChild(colorBoxElement);
		
		i++;
	}
	console.timeEnd(`createRandomColoredBoxes(${quantityOfTimes})`)
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

function orderColorContainerDiv() {
	console.time('orderColorContainerDiv')
  const colorContainerDiv = document.querySelector('#color-container');
  
	const colorsInContainer = [...COLORS_IN_SCREEN]

  // color sorting algorithm copiado
  sortWithClusters(colorsInContainer)

  const clustersWithColors = [...CLUSTERS].filter(cluster => cluster.colors.length !== 0);
	
	const clusterColors = clustersWithColors.map(cluster => cluster.colors).flat();

	colorContainerDiv.childNodes.forEach((node, index) => {
		updateDivStyle(node, clusterColors[index])
	});
	console.timeEnd('orderColorContainerDiv')
}

function updateDivStyle(div, color) {
	div.title = JSON.stringify(color.colorInRGB);
  div.style.backgroundColor = color.colorInHex.hexString;
}

function alternateBetweenBasicAndComplexVisualizationFunc() {
	if (VISUALIZATION_MODE === 'basic')  {
		document.querySelector('.container').className = 'container color-container-complex';
		VISUALIZATION_MODE = 'complex';
	} else {
		document.querySelector('.container').className = 'container color-container-basic';
		VISUALIZATION_MODE = 'basic';
	} 
}

// -----------------------------------------------------------------------------------
// Adapted code that i've copied from the internet


function sortWithClusters(colorsToSort) {
	CLUSTERS.forEach(cluster => cluster.colors = [])
  // const clusters = [...]; // as defined above
  colorsToSort.forEach((color) => {
    let minDistance;
    let minDistanceClusterIndex;
    CLUSTERS.forEach((cluster, clusterIndex) => {
      const colorRgbArr = [color.colorInRGB.r, color.colorInRGB.g, color.colorInRGB.b];
      const distance = colorDistance(colorRgbArr, cluster.leadColor);
      if (typeof minDistance === 'undefined' || minDistance > distance) {
        minDistance = distance;
        minDistanceClusterIndex = clusterIndex;
      }
    });
		CLUSTERS[minDistanceClusterIndex].colors.push(color)
  });
  CLUSTERS.forEach((cluster) => {
		const dim = ['white', 'grey', 'black'].includes(cluster.name) ? 'lightness' : 'saturation';
    cluster.colors = oneDimensionSorting(cluster.colors, dim)
  });
}

function colorDistance(color1, color2) {
  const x =
    Math.pow(color1[0] - color2[0], 2) +
    Math.pow(color1[1] - color2[1], 2) +
    Math.pow(color1[2] - color2[2], 2);
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

