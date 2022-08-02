import ILink from "../../interfaces/link";
import styles from "./LinkCard.module.scss";
import {
  AiFillEdit,
  AiFillDelete,
  AiFillSave,
  AiOutlineClose,
} from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { chooseCard, editCard } from "../../features/profileLinkCard/cardSlice";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

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

  const editText = useRef<HTMLParagraphElement>(null);
  const editForm = useRef<HTMLSpanElement>(null);

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

    dispatch(chooseCard("null"));
    refreshData();
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
      <p
        id="editLinkText"
        ref={editText}
        className={styles.wrapper__shortLink}
        style={{ display: editCardState ? "none" : "inline" }}
      >
        goshort.ga/{link.shortLink}
      </p>
      <span
        id="editLinkForm"
        className={styles.wrapper__editLinkForm}
        ref={editForm}
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
      <p className={styles.wrapper__createdAt}>
        {new Date(link.createdAt).toLocaleDateString()}
      </p>
      <div className={styles.wrapper__controls}>
        {editCardState ? (
          <div className={styles.wrapper__editControls}>
            <button type="submit" onClick={handleSubmit(onSubmit)}>
              Сохранить <AiFillSave />
            </button>
            <button type="button" onClick={() => dispatch(editCard(false))}>
              Отмена <AiOutlineClose />
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => dispatch(editCard(true))}>
            Изменить короткую ссылку <AiFillEdit />
          </button>
        )}
        <button
          type="button"
          id={styles.deleteBtn}
          onClick={() => deleteLink(link.shortLink)}
        >
          Удалить <AiFillDelete />
        </button>
      </div>
    </div>
  );
}
