import { IoLocationSharp, IoTimeOutline } from 'react-icons/io5';
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
  const coordinates = hasCoordinates
    ? `${formatCoordinate(capture.location.latitude)}, ${formatCoordinate(capture.location.longitude)}`
    : 'GPS unavailable';

  return (
    <BaseCard className={styles.card}>
      <div className={styles.imageShell}>
        {imageUrl ? (
          <img
            className={styles.image}
            src={imageUrl}
            alt={`Captured photo from ${formatDateTime(capture.capturedAt)}`}
          />
        ) : (
          <div className={styles.imageFallback}>Loading photo...</div>
        )}

        <span className={styles.gpsBadge}>
          <span className={styles.gpsDot} aria-hidden="true" />
          {hasCoordinates ? 'GPS' : 'No GPS'}
        </span>

        <div className={styles.overlay}>
          <p className={styles.coordinates}>
            <IoLocationSharp aria-hidden="true" />
            <span>{coordinates}</span>
          </p>
          <p className={styles.timestamp}>
            <IoTimeOutline aria-hidden="true" />
            <span>{formatDateTime(capture.capturedAt)}</span>
          </p>
        </div>
      </div>

      <div className={styles.footer}>
        <Button
          className={styles.viewButton}
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onViewMore(capture)}
        >
          View More
        </Button>
      </div>
    </BaseCard>
  );
}
