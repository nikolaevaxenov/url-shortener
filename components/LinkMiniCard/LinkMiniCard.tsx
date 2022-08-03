import { AiFillEye } from "react-icons/ai";
import ILink from "../../interfaces/link";
import styles from "./LinkMiniCard.module.scss";

type LinkMiniCardProps = {
  link: ILink;
};

export default function LinkMiniCard({ link }: LinkMiniCardProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.wrapper__shortLink}>goshort.ga/{link.shortLink}</p>
      <p className={styles.wrapper__fullLink}>{link.fullLink}</p>
      <div className={styles.wrapper__dateViews}>
        <p>{new Date(link.createdAt).toLocaleDateString()}</p>
        <p>
          {link.views} <AiFillEye />
        </p>
      </div>
    </div>
  );
}
