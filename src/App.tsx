import { useState } from 'react';
import { Button, BaseCard, CameraCaptureModal } from './components';
import usePhotoCaptures from './hooks/usePhotoCaptures';
import styles from './App.module.css';

export default function App() {
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const { captures, isLoading, error, addCapture, clearCaptures } = usePhotoCaptures();

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
          </div>
        </div>
      </section>

      <section className={styles.emptyState}>
        <BaseCard className={styles.emptyCard}>
          <h2 className={styles.emptyTitle}>No captures yet</h2>

          <p className={styles.emptyText}>
            {isLoading
              ? 'Checking local capture storage...'
              : `${captures.length} saved capture${captures.length === 1 ? '' : 's'} in local browser storage.`}
          </p>

          {error ? <p className={styles.errorText}>{error}</p> : null}

          {captures.length > 0 ? (
            <div className={styles.emptyActions}>
              <Button type="button" variant="danger" onClick={clearCaptures}>
                Clear Saved Captures
              </Button>
            </div>
          ) : null}
        </BaseCard>
      </section>

      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onSave={addCapture}
      />
    </main>
  );
}
