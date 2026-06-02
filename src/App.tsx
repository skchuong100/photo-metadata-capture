import { useState } from 'react';
import {
  BaseCard,
  Button,
  CameraCaptureModal,
  MasonryPhotoFeed,
  PhotoDetailsModal,
} from './components';
import usePhotoCaptures from './hooks/usePhotoCaptures';
import { createSampleCaptures } from './lib/createSampleCaptures';
import type { PhotoCapture } from './types/photoCapture';
import styles from './App.module.css';

export default function App() {
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [selectedCapture, setSelectedCapture] = useState<PhotoCapture | null>(null);
  const [isSeedingSampleCaptures, setIsSeedingSampleCaptures] = useState(false);
  const [sampleCaptureError, setSampleCaptureError] = useState<string | null>(null);
  const { captures, isLoading, error, addCapture, clearCaptures } = usePhotoCaptures();
  const canSeedSampleCaptures = import.meta.env.DEV;

  function handleClearCaptures() {
    setSelectedCapture(null);
    void clearCaptures();
  }

  async function handleSeedSampleCaptures() {
    try {
      setIsSeedingSampleCaptures(true);
      setSampleCaptureError(null);
      const sampleCaptures = await createSampleCaptures();

      for (const sampleCapture of sampleCaptures) {
        await addCapture(sampleCapture);
      }
    } catch (seedError) {
      setSampleCaptureError(
        seedError instanceof Error
          ? seedError.message
          : 'Unable to create sample captures.'
      );
    } finally {
      setIsSeedingSampleCaptures(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Field Photo Metadata Capture</h1>

          <p className={styles.description}>
            Take a photo using the device camera, capture GPS coordinates and
            timestamp metadata, then review each capture in a polished photo
            feed.
          </p>

          <div className={styles.actions}>
            <Button
              type="button"
              size="lg"
              onClick={() => setIsCameraModalOpen(true)}
            >
              Take New Photo
            </Button>

            {canSeedSampleCaptures ? (
              <Button
                type="button"
                variant="secondary"
                size="lg"
                isLoading={isSeedingSampleCaptures}
                onClick={handleSeedSampleCaptures}
              >
                Seed Random Samples
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <section className={styles.feedSection} aria-labelledby="feed-title">
        <div className={styles.feedHeader}>
          <div>
            <h2 className={styles.feedTitle} id="feed-title">
              Captured Photos
            </h2>

            <p className={styles.feedDescription}>
              {isLoading
                ? 'Checking local capture storage...'
                : `${captures.length} saved capture${captures.length === 1 ? '' : 's'} in local browser storage.`}
            </p>
          </div>

          {captures.length > 0 ? (
            <Button type="button" variant="danger" onClick={handleClearCaptures}>
              Clear Saved Captures
            </Button>
          ) : null}
        </div>

        {error ? <p className={styles.errorText}>{error}</p> : null}
        {sampleCaptureError ? (
          <p className={styles.errorText}>{sampleCaptureError}</p>
        ) : null}

        {captures.length > 0 ? (
          <MasonryPhotoFeed captures={captures} onViewMore={setSelectedCapture} />
        ) : (
          <BaseCard className={styles.emptyCard}>
            <h3 className={styles.emptyTitle}>No captures yet</h3>

            <p className={styles.emptyText}>
              Take a new photo to populate the masonry feed.
            </p>
          </BaseCard>
        )}
      </section>

      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onSave={addCapture}
      />

      <PhotoDetailsModal
        capture={selectedCapture}
        isOpen={selectedCapture !== null}
        onClose={() => setSelectedCapture(null)}
      />
    </main>
  );
}
