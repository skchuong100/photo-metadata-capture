import { useEffect, useRef, useState } from 'react';
import type { PhotoCapture } from '../../types/photoCapture';
import PhotoCard from '../PhotoCard/PhotoCard';
import styles from './MasonryPhotoFeed.module.css';

type MasonryPhotoFeedProps = {
  captures: PhotoCapture[];
  onViewMore: (capture: PhotoCapture) => void;
};

type MasonryPhotoFeedItemProps = {
  capture: PhotoCapture;
  onViewMore: (capture: PhotoCapture) => void;
};

const gridRowHeight = 8;
const gridGap = 16;
const gridRowUnit = gridRowHeight + gridGap;

function MasonryPhotoFeedItem({ capture, onViewMore }: MasonryPhotoFeedItemProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [rowSpan, setRowSpan] = useState(1);

  useEffect(() => {
    const measuredElement = contentRef.current;

    if (measuredElement === null) {
      return;
    }

    const element = measuredElement;

    function updateRowSpan() {
      const height = element.getBoundingClientRect().height;
      const nextRowSpan = Math.max(
        1,
        Math.ceil((height + gridGap) / gridRowUnit)
      );

      setRowSpan(nextRowSpan);
    }

    updateRowSpan();

    const observer = new ResizeObserver(updateRowSpan);
    observer.observe(element);
    window.addEventListener('resize', updateRowSpan);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateRowSpan);
    };
  }, [capture.id]);

  return (
    <div className={styles.item} style={{ gridRowEnd: `span ${rowSpan}` }}>
      <div ref={contentRef}>
        <PhotoCard capture={capture} onViewMore={onViewMore} />
      </div>
    </div>
  );
}

export default function MasonryPhotoFeed({ captures, onViewMore }: MasonryPhotoFeedProps) {
  return (
    <div className={styles.feed}>
      {captures.map(capture => (
        <MasonryPhotoFeedItem
          capture={capture}
          key={capture.id}
          onViewMore={onViewMore}
        />
      ))}
    </div>
  );
}
