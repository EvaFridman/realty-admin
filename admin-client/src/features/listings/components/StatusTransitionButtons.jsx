import { listingStatusLabels } from '../../data/adminData';
import styles from '../../../constants/adminData.js';

export default function StatusTransitionButtons({ allowedTransitions, onTransition }) {
  if (!allowedTransitions || allowedTransitions.length === 0) {
    return <p className={styles.noTransitions}>Дальнейшие переходы недоступны</p>;
  }

  return (
    <div className={styles.btns}>
      {allowedTransitions.map((status) => (<button key={status} type="button" onClick={() => onTransition(status)}>{listingStatusLabels[status]}</button>))}</div>
  );
}