import type { NextPage } from "next";
import { UserContext, useUser } from "@auth0/nextjs-auth0";
import { useForm } from "react-hook-form";
import Head from "next/head";
import styles from "../styles/Home.module.scss";

type FormData = {
  fullLink: string;
};

const Home: NextPage = () => {
  const { user, error, isLoading } = useUser();
  const { register, handleSubmit } = useForm<FormData>();

  const createLink = async ({ fullLink }: FormData) => {
    const linkObj = user
      ? { username: user.email, fullLink: fullLink }
      : { fullLink: fullLink };

    const res = await fetch("/api/links", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(linkObj),
    });

    const result = await res.json();
    console.log("Result = ", result);
  };

  return (
    <>
      <Head>
        <title>GoShort</title>
      </Head>
      <main className={styles.main}>
        <p className={styles.main__title}>GoShort</p>
        <p className={styles.main__subText}>сервис сокращения ссылок</p>
        <div className={styles.main__inputGroup}>
          <form onSubmit={handleSubmit(createLink)}>
            <input
              type="url"
              placeholder="Вставьте сюда вашу ссылку"
              className={styles.main__urlInput}
              {...register("fullLink")}
            />
            <button type="submit" className={styles.main__urlButton}>
              Сократить
            </button>
          </form>
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
