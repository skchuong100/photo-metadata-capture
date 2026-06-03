export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date(value));
}

export function formatCoordinate(value: number | null) {
  if (value === null) {
    return 'Unavailable';
  }

  return value.toFixed(6);
}

export function formatMeters(value: number | null) {
  if (value === null) {
    return 'Unavailable';
  }

  return `${value.toFixed(1)} m`;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatCameraSource(source: string) {
  if (source === 'camera') {
    return 'Device camera';
  }

  if (source === 'development-sample') {
    return 'Development sample';
  }

  return source;
}

export function formatAspectRatio(width: number, height: number) {
  function getGreatestCommonDivisor(firstValue: number, secondValue: number): number {
    return secondValue === 0
      ? firstValue
      : getGreatestCommonDivisor(secondValue, firstValue % secondValue);
  }

  if (!width || !height) {
    return 'Unavailable';
  }

  const divisor = getGreatestCommonDivisor(width, height);

  return `${width / divisor}:${height / divisor}`;
}


export function formatMegapixels(width: number, height: number) {
  if (!width || !height) {
    return 'Unavailable';
  }

  const megapixels = (width * height) / 1_000_000;

  return `${megapixels.toFixed(2)} MP`;
}

export function formatOrientation(width: number, height: number) {
  if (!width || !height) {
    return 'Unavailable';
  }

  if (width > height) {
    return 'Landscape';
  }

  if (height > width) {
    return 'Portrait';
  }

  return 'Square';
}

export function formatBitDepth(
  bitDepth: number | null | undefined,
  bitsPerChannel: number | null | undefined
) {
  if (!bitDepth) {
    return 'Unavailable';
  }

  if (!bitsPerChannel) {
    return `${bitDepth}-bit`;
  }

  return `${bitDepth}-bit RGB (${bitsPerChannel} bits per channel)`;
}
