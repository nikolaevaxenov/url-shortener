import { AiFillEye } from "react-icons/ai";
import ILink from "../../interfaces/link";
import styles from "./LinkMiniCard.module.scss";
import { useAppSelector } from "../../hooks/redux";
import classnames from "classnames";

type LinkMiniCardProps = {
  link: ILink;
};

export default function LinkMiniCard({ link }: LinkMiniCardProps) {
  const idCard = useAppSelector((state) => state.card.idCard);

  return (
    <div
      className={classnames(
        styles.wrapper,
        idCard === link._id && styles.wrapper__selected
      )}
    >
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
