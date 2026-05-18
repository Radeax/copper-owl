import type { Recommendation } from '@/types/domain';
import styles from './RecommendationCard.module.css';

interface Props {
  recommendation: Recommendation;
}

export function RecommendationCard({ recommendation }: Props) {
  const { priority, title, zone, detail, flavor, tags } = recommendation;

  const priorityClass =
    priority === 'primary'
      ? styles.primary
      : priority === 'alternative'
        ? styles.alternative
        : styles.fallback;

  return (
    <article className={`${styles.card} ${priorityClass}`}>
      <header className={styles.head}>
        <div className={styles.eyebrow}>{zone}</div>
        <h3 className={styles.title}>{title}</h3>
      </header>

      <p className={styles.detail}>{detail}</p>

      {flavor && <p className={styles.flavor}>{flavor}</p>}

      {tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
