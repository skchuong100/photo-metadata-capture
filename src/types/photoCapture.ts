export type PhotoCaptureSource = 'camera';

export type PhotoCaptureLocation = {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
};

export type PhotoCaptureImageMetadata = {
  width: number;
  height: number;
  fileSize: number;
  mimeType: string;
};

export type PhotoCapture = {
  id: string;
  imageBlob: Blob;
  capturedAt: string;
  savedAt: string;
  source: PhotoCaptureSource;
  location: PhotoCaptureLocation;
  image: PhotoCaptureImageMetadata;
};

export type CreatePhotoCaptureInput = Omit<PhotoCapture, 'savedAt'>;
