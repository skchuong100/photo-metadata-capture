import type { HTMLAttributes, ReactNode } from 'react';
import styles from './BaseCard.module.css';

type BaseCardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export default function BaseCard({
  children,
  className,
  ...cardProps
}: BaseCardProps) {
  const classNames = [styles.card, className ?? ''].filter(Boolean).join(' ');

  return (
    <article {...cardProps} className={classNames}>
      {children}
    </article>
  );
}