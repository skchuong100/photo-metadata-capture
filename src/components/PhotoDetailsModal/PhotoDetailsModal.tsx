import type { PhotoCapture } from '../../types/photoCapture';
import {
  formatAspectRatio,
  formatBitDepth,
  formatCameraSource,
  formatCoordinate,
  formatDateTime,
  formatFileSize,
  formatMeters,
} from '../../lib/formatPhotoCapture';
import useObjectUrl from '../../hooks/useObjectUrl';
import BaseModal from '../BaseModal/BaseModal';
import MetadataList from '../MetadataList/MetadataList';
import styles from './PhotoDetailsModal.module.css';

type PhotoDetailsModalProps = {
  capture: PhotoCapture | null;
  isOpen: boolean;
  onClose: () => void;
};

function getPhotoMetadataItems(capture: PhotoCapture) {
  return [
    { label: 'Captured timestamp', value: formatDateTime(capture.capturedAt) },
    { label: 'Saved timestamp', value: formatDateTime(capture.savedAt) },
    { label: 'Source', value: formatCameraSource(capture.source) },
    {
      label: 'Image dimensions',
      value: `${capture.image.width} x ${capture.image.height}`,
    },
    {
      label: 'Aspect ratio',
      value: formatAspectRatio(capture.image.width, capture.image.height),
    },
    { label: 'File size', value: formatFileSize(capture.image.fileSize) },
    { label: 'MIME type', value: capture.image.mimeType },
    {
      label: 'Bit depth',
      value: formatBitDepth(capture.image.bitDepth, capture.image.bitsPerChannel),
    },
  ];
}

function getLocationItems(capture: PhotoCapture) {
  return [
    { label: 'Latitude', value: formatCoordinate(capture.location.latitude) },
    { label: 'Longitude', value: formatCoordinate(capture.location.longitude) },
    {
      label: 'Estimated location accuracy',
      value: formatMeters(capture.location.accuracy),
    },
  ];
}

export default function PhotoDetailsModal({
  capture,
  isOpen,
  onClose,
}: PhotoDetailsModalProps) {
  const imageUrl = useObjectUrl(capture?.imageBlob);

  return (
    <BaseModal isOpen={isOpen} title="Photo Details" onClose={onClose} size="lg">
      {capture ? (
        <div className={styles.content}>
          <div className={styles.imagePanel}>
            {imageUrl ? (
              <img
                className={styles.image}
                src={imageUrl}
                alt={`Captured photo from ${formatDateTime(capture.capturedAt)}`}
              />
            ) : (
              <div className={styles.imageFallback}>Loading photo...</div>
            )}
          </div>

          <section className={styles.metadataSection} aria-labelledby="photo-metadata-title">
            <h3 className={styles.sectionTitle} id="photo-metadata-title">
              Photo Metadata
            </h3>

            <MetadataList items={getPhotoMetadataItems(capture)} />
          </section>

          <section className={styles.metadataSection} aria-labelledby="location-title">
            <h3 className={styles.sectionTitle} id="location-title">
              Location
            </h3>

            <MetadataList items={getLocationItems(capture)} />
          </section>
        </div>
      ) : null}
    </BaseModal>
  );
}
