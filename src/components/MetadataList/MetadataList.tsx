import styles from './MetadataList.module.css';

type MetadataListItem = {
  label: string;
  value: string;
};

type MetadataListProps = {
  items: MetadataListItem[];
};

export default function MetadataList({ items }: MetadataListProps) {
  return (
    <dl className={styles.list}>
      {items.map(item => (
        <div className={styles.item} key={item.label}>
          <dt className={styles.label}>{item.label}</dt>
          <dd className={styles.value}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
