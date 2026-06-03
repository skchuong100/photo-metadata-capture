import { useState } from 'react';
import {
  Button,
  CameraCaptureModal,
  MasonryPhotoFeed,
  PhotoDetailsModal,
  Topbar,
} from './components';
import usePhotoCaptures from './hooks/usePhotoCaptures';
import type { PhotoCapture } from './types/photoCapture';
import styles from './App.module.css';

export default function App() {
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [selectedCapture, setSelectedCapture] = useState<PhotoCapture | null>(null);
  const { captures, isLoading, error, addCapture, clearCaptures } = usePhotoCaptures();

  function handleClearCaptures() {
    setSelectedCapture(null);
    void clearCaptures();
  }

  return (
    <>
      <Topbar onTakePhoto={() => setIsCameraModalOpen(true)} />

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>GPS + Timestamp Capture</p>

            <h1 className={styles.title}>
              <span> Photo Metadata Capture</span>
            </h1>

            <p className={styles.description}>
              Take photos directly from the browser, capture GPS and timestamp
              metadata, then review every saved capture in a visual feed.
            </p>
          </div>

          <aside className={styles.captureStat} aria-label="Capture count">
            <span className={styles.statLabel}>Captures</span>
            <strong className={styles.statValue}>{captures.length}</strong>
          </aside>
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
                  : `${captures.length} saved capture${captures.length === 1 ? '' : 's'}.`}
              </p>
            </div>

            {captures.length > 0 ? (
              <Button type="button" variant="danger" onClick={handleClearCaptures}>
                Clear All
              </Button>
            ) : null}
          </div>

          {error ? <p className={styles.errorText}>{error}</p> : null}

          {captures.length > 0 ? (
            <MasonryPhotoFeed captures={captures} onViewMore={setSelectedCapture} />
          ) : (
            <p className={styles.emptyText}>No captures yet.</p>
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
    </>
  );
}
