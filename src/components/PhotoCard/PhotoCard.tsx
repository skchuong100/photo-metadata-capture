import type { PhotoCapture } from '../../types/photoCapture';
import {
  formatCoordinate,
  formatDateTime,
} from '../../lib/formatPhotoCapture';
import useObjectUrl from '../../hooks/useObjectUrl';
import BaseCard from '../BaseCard/BaseCard';
import Button from '../Button/Button';
import styles from './PhotoCard.module.css';

type PhotoCardProps = {
  capture: PhotoCapture;
  onViewMore: (capture: PhotoCapture) => void;
};

export default function PhotoCard({ capture, onViewMore }: PhotoCardProps) {
  const imageUrl = useObjectUrl(capture.imageBlob);
  const hasCoordinates =
    capture.location.latitude !== null && capture.location.longitude !== null;

  return (
    <BaseCard className={styles.card}>
      {imageUrl ? (
        <img
          className={styles.image}
          src={imageUrl}
          alt={`Captured photo from ${formatDateTime(capture.capturedAt)}`}
        />
      ) : (
        <div className={styles.imageFallback}>Loading photo...</div>
      )}

      <div className={styles.content}>
        <div className={styles.metaPreview}>
          <p className={styles.timestamp}>{formatDateTime(capture.capturedAt)}</p>

          <p className={styles.coordinates}>
            {hasCoordinates
              ? `${formatCoordinate(capture.location.latitude)}, ${formatCoordinate(capture.location.longitude)}`
              : 'GPS unavailable'}
          </p>
        </div>

        <Button type="button" fullWidth onClick={() => onViewMore(capture)}>
          View More
        </Button>
      </div>
    </BaseCard>
  );
}
