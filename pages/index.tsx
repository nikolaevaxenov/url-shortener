import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>GoShort</title>
      </Head>
      <main className={styles.main}>
        <p className={styles.main__title}>GoShort</p>
        <p className={styles.main__subText}>простой сокращатель ссылок</p>
        <div className={styles.main__inputGroup}>
          <input
            type="url"
            name="urlToShort"
            id="urlToShort"
            placeholder="Вставьте сюда вашу ссылку"
            className={styles.main__urlInput}
          />
          <button type="button" className={styles.main__urlButton}>
            Сократить
          </button>
        </div>

        <p className={styles.main__adText}>
          Вы можете изменять, удалять, задавать собственные адреса ссылкам
          зарегистрировавшись на сайте
        </p>
      </main>
    </>
  );
};

export default Home;
