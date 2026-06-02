import { useState } from 'react';
import { Button, BaseCard, BaseModal } from './components';
import styles from './App.module.css';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <Button type="button" size="lg" onClick={() => setIsModalOpen(true)}>
              Open Modal
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.emptyState}>
        <BaseCard className={styles.emptyCard}>
          <h2 className={styles.emptyTitle}>No captures yet</h2>
        </BaseCard>
      </section>

      <BaseModal
        isOpen={isModalOpen}
        title="Open Modal"
        onClose={() => setIsModalOpen(false)}
      >
        <p className={styles.modalText}>Open Modal</p>
      </BaseModal>
    </main>
  );
}
