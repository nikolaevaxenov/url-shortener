import ILink from "../../interfaces/link";
import styles from "./LinkCard.module.scss";
import { AiFillEdit, AiFillDelete, AiFillSave } from "react-icons/ai";
import { useAppDispatch } from "../../hooks/redux";
import { chooseCard } from "../../features/profileLinkCard/cardSlice";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type LinkCardProps = {
  link: ILink;
};

type FormInput = {
  shortLink: string;
};

export default function LinkCard({ link }: LinkCardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<FormInput>();

  const editText = useRef<HTMLParagraphElement>(null);
  const editForm = useRef<HTMLSpanElement>(null);

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
    console.log("Result = ", result);
  };

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    editHandler(false);

    editLink(link.shortLink, data.shortLink);
    dispatch(chooseCard("null"));
    refreshData();
  };

  const editHandler = (currState: boolean) => {
    if (currState) {
      if (editText.current !== null) {
        editText.current.style.display = "none";
      }

      if (editForm.current !== null) {
        editForm.current.style.display = "inline";
      }

      setEditBtn(
        <button type="submit" onClick={handleSubmit(onSubmit)}>
          Сохранить <AiFillSave />
        </button>
      );
    } else {
      if (editText.current !== null) {
        editText.current.style.display = "inline";
      }

      if (editForm.current !== null) {
        editForm.current.style.display = "none";
      }

      setEditBtn(
        <button type="button" onClick={() => editHandler(true)}>
          Изменить короткую ссылку <AiFillEdit />
        </button>
      );
    }
  };

  const [editBtn, setEditBtn] = useState(
    <button type="button" onClick={() => editHandler(true)}>
      Изменить короткую ссылку <AiFillEdit />
    </button>
  );

  return (
    <div className={styles.wrapper}>
      <p className={styles.wrapper__fullLink}>{link.fullLink}</p>
      <p id="editLinkText" ref={editText} className={styles.wrapper__shortLink}>
        goshort.ga/{link.shortLink}
      </p>
      <span
        id="editLinkForm"
        className={styles.wrapper__editLinkForm}
        ref={editForm}
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
            })}
          />

          {errors.shortLink?.message && (
            <p className={styles.errors}>{errors.shortLink?.message}</p>
          )}
        </form>
      </span>
      <p className={styles.wrapper__createdAt}>
        {new Date(link.createdAt).toLocaleDateString("en-GB")}
      </p>
      <div className={styles.wrapper__controls}>
        {editBtn}
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
