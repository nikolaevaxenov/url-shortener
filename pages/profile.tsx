import type { NextPage } from "next";
import Head from "next/head";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import styles from "../styles/Profile.module.scss";
import ILink from "../interfaces/link";
import LinkCard from "../components/LinkCard/LinkCard";
import LinkMiniCard from "../components/LinkMiniCard/LinkMiniCard";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { chooseCard, editCard } from "../features/profileLinkCard/cardSlice";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getUserLinks } from "../services/link";
import { UserData } from "auth0";

type ProfileProps = {
  user: UserData;
};

const Profile: NextPage<ProfileProps> = ({ user }) => {
  const idCard = useAppSelector((state) => state.card.idCard);
  const editState = useAppSelector((state) => state.card.editState);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { refetch, data, isLoading } = useQuery(
    ["links", user.email as string],
    () => getUserLinks(user.email as string)
  );

  const [linkCard, setLinkCard] = useState(<></>);

  useEffect(() => {
    refetch();
  }, [refetch, editState]);

  useEffect(() => {
    if (idCard === "deleted") {
      toast.error("Ссылка удалена!", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });

      dispatch(chooseCard("null"));
      refetch();
    } else if (idCard === "null") {
      setLinkCard(<></>);
    } else {
      setLinkCard(
        <LinkCard
          link={
            data?.find((link: ILink) => link._id === idCard) ?? {
              _id: "lorem",
              shortLink: "lorem",
              fullLink: "lorem",
              createdAt: "lorem",
              views: 123,
              password: "",
            }
          }
        />
      );
    }
  }, [data, dispatch, idCard, refetch, router]);

  return (
    <>
      <Head>
        <title>Личный кабинет</title>
      </Head>
      <main className={styles.wrapper}>
        {isLoading ? (
          <div>Загрузка...</div>
        ) : (
          <div className={styles.wrapper__leftSide}>
            <p className={styles.wrapper__linkCount}>{data.length} ссылок</p>
            {data.map((link: ILink) => (
              <div
                className={styles.wrapper__linkCard}
                key={link._id}
                onClick={() => {
                  dispatch(chooseCard(link._id));
                  dispatch(editCard(false));
                }}
              >
                <LinkMiniCard link={link} />
              </div>
            ))}
          </div>
        )}
        <div className={styles.wrapper__rightSide}>{linkCard}</div>
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
        />
      </main>
    </>
  );
};

export const getServerSideProps = withPageAuthRequired();

export default Profile;
