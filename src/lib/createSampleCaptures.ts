import type { CreatePhotoCaptureInput } from '../types/photoCapture';

type SampleAspectKind = 'landscape' | 'portrait' | 'square' | 'wide-landscape' | 'tall-portrait';

type SampleCaptureConfig = {
  label: string;
  width: number;
  height: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  hue: number;
};

const sampleAspectKinds: SampleAspectKind[] = [
  'landscape',
  'portrait',
  'square',
  'wide-landscape',
  'tall-portrait',
];

const randomSampleCount = 9;
const baseLatitude = 33.77005;
const baseLongitude = -117.95641;

function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getRandomInteger(min: number, max: number) {
  return Math.round(getRandomNumber(min, max));
}

function getRandomSampleAspectKind() {
  const randomIndex = getRandomInteger(0, sampleAspectKinds.length - 1);
  return sampleAspectKinds[randomIndex];
}

function shuffleItems<T>(items: T[]) {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const swapIndex = getRandomInteger(0, index);
    const currentItem = shuffledItems[index];
    shuffledItems[index] = shuffledItems[swapIndex];
    shuffledItems[swapIndex] = currentItem;
  }

  return shuffledItems;
}

function getSampleDimensions(kind: SampleAspectKind) {
  if (kind === 'landscape') {
    return {
      width: getRandomInteger(1000, 1450),
      height: getRandomInteger(650, 900),
    };
  }

  if (kind === 'portrait') {
    return {
      width: getRandomInteger(650, 900),
      height: getRandomInteger(1000, 1450),
    };
  }

  if (kind === 'square') {
    const size = getRandomInteger(760, 1100);

    return {
      width: size,
      height: size,
    };
  }

  if (kind === 'wide-landscape') {
    return {
      width: getRandomInteger(1300, 1800),
      height: getRandomInteger(500, 720),
    };
  }

  return {
    width: getRandomInteger(500, 720),
    height: getRandomInteger(1300, 1800),
  };
}

function formatSampleLabel(kind: SampleAspectKind) {
  if (kind === 'wide-landscape') {
    return 'Wide Landscape Sample';
  }

  if (kind === 'tall-portrait') {
    return 'Tall Portrait Sample';
  }

  return `${kind.charAt(0).toUpperCase()}${kind.slice(1)} Sample`;
}

function createRandomSampleConfig(kind: SampleAspectKind, index: number): SampleCaptureConfig {
  const dimensions = getSampleDimensions(kind);

  return {
    label: `${formatSampleLabel(kind)} ${index + 1}`,
    width: dimensions.width,
    height: dimensions.height,
    latitude: baseLatitude + getRandomNumber(-0.004, 0.004),
    longitude: baseLongitude + getRandomNumber(-0.004, 0.004),
    accuracy: getRandomInteger(8, 35),
    hue: getRandomInteger(0, 359),
  };
}

function createRandomSampleConfigs() {
  const requiredKinds: SampleAspectKind[] = ['landscape', 'portrait'];
  const randomKinds = Array.from(
    { length: randomSampleCount - requiredKinds.length },
    getRandomSampleAspectKind
  );

  return shuffleItems([...requiredKinds, ...randomKinds]).map(createRandomSampleConfig);
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error('Unable to create sample image.'));
      },
      type,
      quality
    );
  });
}

function drawSampleImage(canvas: HTMLCanvasElement, config: SampleCaptureConfig) {
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas is not supported in this browser.');
  }

  const gradient = context.createLinearGradient(0, 0, config.width, config.height);
  gradient.addColorStop(0, `hsl(${config.hue} 80% 42%)`);
  gradient.addColorStop(1, `hsl(${(config.hue + 70) % 360} 78% 24%)`);

  context.fillStyle = gradient;
  context.fillRect(0, 0, config.width, config.height);

  context.fillStyle = 'rgba(255, 255, 255, 0.16)';
  context.beginPath();
  context.arc(config.width * 0.16, config.height * 0.18, config.width * 0.2, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = 'rgba(15, 23, 42, 0.26)';
  context.beginPath();
  context.arc(config.width * 0.86, config.height * 0.82, config.width * 0.28, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = 'rgba(255, 255, 255, 0.18)';
  const stripeCount = 7;

  for (let index = 0; index < stripeCount; index += 1) {
    const x = (config.width / stripeCount) * index;
    context.fillRect(x, config.height * 0.66, config.width * 0.06, config.height * 0.34);
  }

  const titleSize = Math.max(34, Math.round(Math.min(config.width, config.height) * 0.08));
  const detailSize = Math.max(20, Math.round(titleSize * 0.42));
  const padding = Math.max(36, Math.round(Math.min(config.width, config.height) * 0.07));

  context.fillStyle = 'rgba(2, 6, 23, 0.62)';
  context.fillRect(0, config.height - padding * 3.6, config.width, padding * 3.6);

  context.fillStyle = '#f8fafc';
  context.font = `700 ${titleSize}px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
  context.textBaseline = 'bottom';
  context.fillText(config.label, padding, config.height - padding * 1.7);

  context.fillStyle = '#cbd5e1';
  context.font = `600 ${detailSize}px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
  context.fillText(`${config.width} x ${config.height}`, padding, config.height - padding * 0.85);
}

async function createSampleCapture(
  config: SampleCaptureConfig,
  index: number
): Promise<CreatePhotoCaptureInput> {
  const canvas = document.createElement('canvas');
  canvas.width = config.width;
  canvas.height = config.height;
  drawSampleImage(canvas, config);

  const mimeType = 'image/jpeg';
  const imageBlob = await canvasToBlob(canvas, mimeType, 0.9);
  const capturedAt = new Date(Date.now() - index * 60_000).toISOString();

  return {
    id: crypto.randomUUID(),
    imageBlob,
    capturedAt,
    source: 'development-sample',
    location: {
      latitude: config.latitude,
      longitude: config.longitude,
      accuracy: config.accuracy,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    image: {
      width: config.width,
      height: config.height,
      fileSize: imageBlob.size,
      mimeType,
      bitDepth: 24,
      bitsPerChannel: 8,
    },
  };
}

export function createSampleCaptures() {
  const randomSampleConfigs = createRandomSampleConfigs();
  return Promise.all(randomSampleConfigs.map(createSampleCapture));
}
