import type { NextPage } from "next";
import { UserContext, useUser } from "@auth0/nextjs-auth0";
import { useForm } from "react-hook-form";
import { AiOutlineCopy, AiOutlineReload } from "react-icons/ai";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type FormData = {
  fullLink: string;
};

const Home: NextPage = () => {
  const { user, error, isLoading } = useUser();
  const { register, handleSubmit, reset } = useForm<FormData>();

  const [creationSuccess, setCreationSuccess] = useState(["idle", ""]);
  const resultLink = useRef<HTMLInputElement>(null);

  const createLink = async ({ fullLink }: FormData) => {
    const linkObj = user
      ? { username: user.email, fullLink: fullLink }
      : { fullLink: fullLink };

    setCreationSuccess(["loading", ""]);
    const res = await fetch("/api/links", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(linkObj),
    });

    const result = await res.json();
    console.log("Result = ", result);

    if (resultLink.current) {
      resultLink.current.value = `goshort.ga/${result.shortLink}`;
      setCreationSuccess(["ready", `https://goshort.ga/${result.shortLink}`]);
    }
  };

  const handleCopy = () => {
    if (resultLink.current) {
      resultLink.current.select();

      toast.success("Ссылка скопирована!", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <Head>
        <title>GoShort</title>
      </Head>
      <main className={styles.main}>
        <p className={styles.main__title}>GoShort</p>
        <p className={styles.main__subText}>сервис сокращения ссылок</p>
        <div
          id="inputForm"
          className={styles.main__inputGroup}
          style={{ display: creationSuccess[0] === "idle" ? "block" : "none" }}
        >
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
        <div
          className={styles.main__inputGroup}
          style={{
            display: creationSuccess[0] === "loading" ? "block" : "none",
          }}
        >
          <input
            readOnly
            value="Загрузка..."
            className={styles.main__urlInput}
          />
        </div>
        <div
          id="resultForm"
          className={styles.main__inputGroup}
          style={{ display: creationSuccess[0] === "ready" ? "block" : "none" }}
        >
          <input
            ref={resultLink}
            readOnly
            className={styles.main__urlInput}
            onClick={(e) => e.currentTarget.select()}
          />

          <CopyToClipboard
            text={creationSuccess[1]}
            onCopy={() => handleCopy()}
          >
            <button type="button" className={styles.main__urlButton}>
              Скопировать <AiOutlineCopy />
            </button>
          </CopyToClipboard>
        </div>
        <button
          type="button"
          className={styles.main__reloadButton}
          style={{ display: creationSuccess[0] === "ready" ? "block" : "none" }}
          onClick={() => {
            setCreationSuccess(["idle", ""]);
            reset();
          }}
        >
          Сократить новую ссылку <AiOutlineReload />
        </button>

        <p className={styles.main__adText}>
          Вы можете изменять, удалять, задавать собственные адреса ссылкам
          зарегистрировавшись на сайте
        </p>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
        />
      </main>
    </>
  );
};

export default Home;
