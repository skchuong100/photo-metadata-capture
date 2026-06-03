import { formatCoordinate, formatMeters } from '../../lib/formatPhotoCapture';
import styles from './GoogleMapPreview.module.css';

type GoogleMapPreviewProps = {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
};

function getMapZoom(accuracy: number | null) {
  if (accuracy === null) {
    return 16;
  }

  if (accuracy <= 25) {
    return 18;
  }

  if (accuracy <= 75) {
    return 17;
  }

  if (accuracy <= 150) {
    return 16;
  }

  return 15;
}

function getGoogleMapsEmbedUrl(
  apiKey: string,
  latitude: number,
  longitude: number,
  accuracy: number | null
) {
  const params = new URLSearchParams({
    key: apiKey,
    q: `${latitude},${longitude}`,
    zoom: String(getMapZoom(accuracy)),
  });

  return `https://www.google.com/maps/embed/v1/place?${params.toString()}`;
}

export default function GoogleMapPreview({
  latitude,
  longitude,
  accuracy,
}: GoogleMapPreviewProps) {
  if (latitude === null || longitude === null) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>Location unavailable</p>
        <p className={styles.emptyText}>
          GPS coordinates were not captured for this photo.
        </p>
      </div>
    );
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim();
  const coordinates = `${formatCoordinate(latitude)}, ${formatCoordinate(longitude)}`;
  const accuracyLabel = formatMeters(accuracy);

  return (
    <div className={styles.wrapper}>
      <div className={styles.mapFrameWrapper}>
        {apiKey ? (
          <iframe
            className={styles.mapFrame}
            title={`Google Map for coordinates ${coordinates}`}
            src={getGoogleMapsEmbedUrl(apiKey, latitude, longitude, accuracy)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div className={styles.mapFallback}>
            <p className={styles.fallbackTitle}>Google Maps API key needed</p>
            <p className={styles.fallbackText}>
              Add a Maps Embed API key to show the embedded map preview.
            </p>
          </div>
        )}
      </div>

      <div className={styles.locationSummary}>
        <div>
          <span className={styles.label}>Coordinates</span>
          <p className={styles.value}>{coordinates}</p>
        </div>

        <div>
          <span className={styles.label}>Estimated location accuracy</span>
          <p className={styles.value}>{accuracyLabel}</p>
        </div>

      </div>
    </div>
  );
}
