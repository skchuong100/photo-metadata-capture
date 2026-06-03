import { IoCameraOutline } from 'react-icons/io5';
import Button from '../Button/Button';
import styles from './Topbar.module.css';

type TopbarProps = {
  onTakePhoto: () => void;
};

export default function Topbar({ onTakePhoto }: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <div className={styles.inner}>
        <div className={styles.brand} aria-label="PhotoMetaDdata home">
          <span className={styles.brandIcon} aria-hidden="true">
            <IoCameraOutline />
          </span>
          <span className={styles.brandName}>Photo Metadata Capture</span>
        </div>

        <Button type="button" size="sm" onClick={onTakePhoto}>
          <IoCameraOutline aria-hidden="true" />
          Take Photo
        </Button>
      </div>
    </header>
  );
}
