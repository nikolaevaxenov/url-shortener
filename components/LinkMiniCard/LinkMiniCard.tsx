import ILink from "../../interfaces/link.ts";
import styles from "./LinkMiniCard.module.scss";

type LinkMiniCardProps = {
  link: ILink;
};

export default function LinkMiniCard({ link }: LinkMiniCardProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.wrapper__shortLink}>goshort.ga/{link.shortLink}</p>
      <p className={styles.wrapper__fullLink}>{link.fullLink}</p>
      <p className={styles.wrapper__createdAt}>
        {new Date(link.createdAt).toLocaleDateString("en-GB")}
      </p>
    </div>
  );
}
