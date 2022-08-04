import ILink from "../../interfaces/link";
import styles from "./LinkCard.module.scss";
import {
  AiFillEdit,
  AiFillDelete,
  AiFillSave,
  AiOutlineClose,
  AiFillEye,
  AiOutlineCopy,
} from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { chooseCard, editCard } from "../../features/profileLinkCard/cardSlice";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";

type LinkCardProps = {
  link: ILink;
};

type FormInput = {
  shortLink: string;
};

export default function LinkCard({ link }: LinkCardProps) {
  const dispatch = useAppDispatch();
  const idCard = useAppSelector((state) => state.card.idCard);
  const editCardState = useAppSelector((state) => state.card.editState);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput>();

  useEffect(() => {
    reset({
      shortLink: link.shortLink,
    });
  }, [link, reset]);

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const deleteLink = async (shortLink: string) => {
    const res = await fetch(`/api/links/${shortLink}`, {
      method: "delete",
    });

    dispatch(chooseCard("deleted"));
  };

  const editLink = async (shortLink: string, newShortLink: string) => {
    const res = await fetch(`/api/links/${shortLink}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shortLink: newShortLink }),
    });

    const result = await res.json();

    toast.success("Ссылка успешно изменена!", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });

    dispatch(chooseCard(result._id));
    refreshData();
  };

  const validateLink = async (shortLink: string) => {
    const usedWords = ["profile"];

    const res = await fetch(`/api/links/${shortLink}`, {
      method: "get",
    });

    const result = await res.json();

    if (usedWords.includes(shortLink) || result !== null) {
      return "Указанная короткая ссылка уже существует";
    } else {
      return true;
    }
  };

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    dispatch(editCard(false));

    editLink(link.shortLink, data.shortLink);
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.wrapper__fullLink}>{link.fullLink}</p>
      <div
        className={styles.wrapper__shortLink}
        style={{ display: editCardState ? "none" : "inline" }}
      >
        <div className={styles.wrapper__shortLinkBlock}>
          <Link href={`/${link.shortLink}`}>
            <a target="_blank">goshort.ga/{link.shortLink}</a>
          </Link>
          <CopyToClipboard text={`https://goshort.ga/${link.shortLink}`}>
            <button type="button">
              <AiOutlineCopy />
            </button>
          </CopyToClipboard>
        </div>
      </div>
      <span
        className={styles.wrapper__editLinkForm}
        style={{ display: editCardState ? "inline" : "none" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className={styles.wrapper__shortLink}>goshort.ga/</p>
          <input
            type="text"
            placeholder="Ваша короткая ссылка"
            defaultValue={link.shortLink}
            {...register("shortLink", {
              required: "Это обязательное поле",
              minLength: {
                value: 6,
                message: "Минимальная длина ссылки 6 символов",
              },
              maxLength: {
                value: 20,
                message: "Максимальная длина ссылки 20 символов",
              },
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message:
                  "Ссылка должна содержать только цифры и латинские буквы",
              },
              validate: (newShortLink) => validateLink(newShortLink),
            })}
          />

          {errors.shortLink?.message && (
            <p className={styles.errors}>{errors.shortLink?.message}</p>
          )}
        </form>
      </span>
      <div className={styles.wrapper__dateViews}>
        <div>{new Date(link.createdAt).toLocaleDateString()}</div>
        <div>
          {link.views} <AiFillEye />
        </div>
      </div>
      <div className={styles.wrapper__controls}>
        {editCardState ? (
          <div className={styles.wrapper__editControls}>
            <button
              type="submit"
              className={styles.iconWithText}
              onClick={handleSubmit(onSubmit)}
            >
              Сохранить <AiFillSave />
            </button>
            <button
              type="button"
              className={styles.iconWithText}
              onClick={() => dispatch(editCard(false))}
            >
              Отмена <AiOutlineClose />
            </button>
          </div>
        ) : (
          <button
            className={styles.iconWithText}
            type="button"
            onClick={() => dispatch(editCard(true))}
          >
            Изменить короткую ссылку <AiFillEdit />
          </button>
        )}
        <button
          type="button"
          id={styles.deleteBtn}
          className={styles.iconWithText}
          onClick={() => deleteLink(link.shortLink)}
        >
          Удалить <AiFillDelete />
        </button>
      </div>
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
    </div>
  );
}
