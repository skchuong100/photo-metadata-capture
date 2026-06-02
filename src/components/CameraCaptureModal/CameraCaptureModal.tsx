import { useCallback, useEffect, useRef, useState } from 'react';
import type { CreatePhotoCaptureInput, PhotoCaptureLocation } from '../../types/photoCapture';
import Button from '../Button/Button';
import BaseModal from '../BaseModal/BaseModal';
import styles from './CameraCaptureModal.module.css';

type CameraCaptureModalProps = {
  isOpen: boolean;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (capture: CreatePhotoCaptureInput) => Promise<unknown>;
};

type CapturedPreview = {
  blob: Blob;
  url: string;
  capturedAt: string;
  width: number;
  height: number;
  mimeType: string;
  fileSize: number;
};

const cameraUnavailableMessage =
  'Camera access is unavailable. Please check your browser permissions and try again.';

const locationUnavailableMessage =
  'GPS location could not be captured. Please enable location access and try saving again.';

function getLocationErrorMessage(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
    return 'Location permission was denied. Please allow location access and try saving again.';
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return 'Your current location is unavailable. Please try again in a few moments.';
  }

  if (error.code === error.TIMEOUT) {
    return 'Location capture timed out. Please try saving again.';
  }

  return locationUnavailableMessage;
}

function getCurrentLocation() {
  return new Promise<PhotoCaptureLocation>((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported in this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const { coords } = position;

        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
          altitude: coords.altitude,
          altitudeAccuracy: coords.altitudeAccuracy,
          heading: coords.heading,
          speed: coords.speed,
        });
      },
      error => {
        reject(new Error(getLocationErrorMessage(error)));
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 12000,
      }
    );
  });
}

function createImageBlobFromVideo(video: HTMLVideoElement) {
  return new Promise<CapturedPreview>((resolve, reject) => {
    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) {
      reject(new Error('The camera preview is not ready yet.'));
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');

    if (!context) {
      reject(new Error('Unable to prepare the image capture.'));
      return;
    }

    context.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      blob => {
        if (!blob) {
          reject(new Error('Unable to capture the photo.'));
          return;
        }

        resolve({
          blob,
          url: URL.createObjectURL(blob),
          capturedAt: new Date().toISOString(),
          width,
          height,
          mimeType: blob.type || 'image/jpeg',
          fileSize: blob.size,
        });
      },
      'image/jpeg',
      0.92
    );
  });
}

export default function CameraCaptureModal({
  isOpen,
  isSaving = false,
  onClose,
  onSave,
}: CameraCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [preview, setPreview] = useState<CapturedPreview | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setIsCameraReady(false);
  }, []);

  const clearPreview = useCallback(() => {
    setPreview(currentPreview => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview.url);
      }

      return null;
    });
  }, []);

  const startCamera = useCallback(async () => {
    if (!('mediaDevices' in navigator) || !navigator.mediaDevices.getUserMedia) {
      setError('Camera capture is not supported in this browser.');
      return;
    }

    try {
      setIsCameraLoading(true);
      setIsCameraReady(false);
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1600 },
          height: { ideal: 1200 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraReady(true);
      }
    } catch (cameraError) {
      setError(
        cameraError instanceof Error ? cameraError.message : cameraUnavailableMessage
      );
      stopCamera();
    } finally {
      setIsCameraLoading(false);
    }
  }, [stopCamera]);

  const handleClose = useCallback(() => {
    stopCamera();
    clearPreview();
    setError(null);
    setIsCameraLoading(false);
    setIsLocationLoading(false);
    setIsCameraReady(false);
    onClose();
  }, [clearPreview, onClose, stopCamera]);

  const handleCapturePhoto = useCallback(async () => {
    if (!videoRef.current) {
      setError(cameraUnavailableMessage);
      return;
    }

    try {
      setError(null);
      const capturedPreview = await createImageBlobFromVideo(videoRef.current);
      clearPreview();
      setPreview(capturedPreview);
      stopCamera();
    } catch (captureError) {
      setError(
        captureError instanceof Error
          ? captureError.message
          : 'Unable to capture the photo.'
      );
    }
  }, [clearPreview, stopCamera]);

  const handleRetake = useCallback(async () => {
    clearPreview();
    await startCamera();
  }, [clearPreview, startCamera]);

  const handleSavePhoto = useCallback(async () => {
    if (!preview) {
      setError('Please capture a photo before saving.');
      return;
    }

    try {
      setError(null);
      setIsLocationLoading(true);
      const location = await getCurrentLocation();

      await onSave({
        id: crypto.randomUUID(),
        imageBlob: preview.blob,
        capturedAt: preview.capturedAt,
        source: 'camera',
        location,
        image: {
          width: preview.width,
          height: preview.height,
          fileSize: preview.fileSize,
          mimeType: preview.mimeType,
        },
      });

      handleClose();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to save the captured photo.'
      );
    } finally {
      setIsLocationLoading(false);
    }
  }, [handleClose, onSave, preview]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const startCameraTimer = window.setTimeout(() => {
      void startCamera();
    }, 0);

    return () => {
      window.clearTimeout(startCameraTimer);
      stopCamera();
      clearPreview();
      setError(null);
      setIsCameraLoading(false);
      setIsLocationLoading(false);
      setIsCameraReady(false);
    };
  }, [clearPreview, isOpen, startCamera, stopCamera]);

  const isWorking = isCameraLoading || isLocationLoading || isSaving;
  const primaryActionText = preview ? 'Save Photo' : 'Capture Photo';

  return (
    <BaseModal
      isOpen={isOpen}
      title="Take New Photo"
      onClose={handleClose}
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isWorking}
          >
            Cancel
          </Button>

          {preview ? (
            <Button
              type="button"
              variant="secondary"
              onClick={handleRetake}
              disabled={isWorking}
            >
              Retake
            </Button>
          ) : null}

          <Button
            type="button"
            onClick={preview ? handleSavePhoto : handleCapturePhoto}
            disabled={isWorking || (!preview && !isCameraReady)}
            isLoading={isWorking}
          >
            {primaryActionText}
          </Button>
        </>
      }
    >
      <div className={styles.captureArea}>
        {preview ? (
          <img
            className={styles.previewImage}
            src={preview.url}
            alt="Captured preview before saving"
          />
        ) : (
          <div className={styles.videoFrame}>
            <video
              ref={videoRef}
              className={styles.video}
              autoPlay
              muted
              playsInline
              aria-label="Live camera preview"
            />

            {isCameraLoading ? (
              <div className={styles.loadingOverlay}>Starting camera...</div>
            ) : null}
          </div>
        )}
      </div>

      <div className={styles.statusPanel}>
        <h3 className={styles.statusTitle}>
          {preview ? 'Review your photo' : 'Camera preview'}
        </h3>

        <p className={styles.statusText}>
          {preview
            ? 'Retake the photo or save it with the current GPS location and timestamp metadata.'
            : 'Position the camera, then capture the photo when you are ready.'}
        </p>

        {preview ? (
          <dl className={styles.previewMetadata}>
            <div>
              <dt>Captured</dt>
              <dd>{new Date(preview.capturedAt).toLocaleString()}</dd>
            </div>

            <div>
              <dt>Image size</dt>
              <dd>
                {preview.width} x {preview.height}
              </dd>
            </div>
          </dl>
        ) : null}

        {isLocationLoading ? (
          <p className={styles.loadingText}>Getting GPS location...</p>
        ) : null}

        {error ? <p className={styles.errorText}>{error}</p> : null}
      </div>
    </BaseModal>
  );
}
