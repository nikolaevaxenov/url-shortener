import Link from "next/link";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Link href="https://github.com/nikolaevaxenov/">
        <a target="_blank">
          © 2022 <u>Nikolaev-Axenov</u>
        </a>
      </Link>
    </footer>
  );
}
