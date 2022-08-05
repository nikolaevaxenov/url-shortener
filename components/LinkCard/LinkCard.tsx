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
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useMutation } from "@tanstack/react-query";
import {
  deleteLink,
  editLink,
  validateLink,
  EditLinkData,
} from "../../services/link";

type LinkCardProps = {
  link: ILink;
};

type FormInput = {
  shortLink: string;
};

export default function LinkCard({ link }: LinkCardProps) {
  const dispatch = useAppDispatch();
  const editCardState = useAppSelector((state) => state.card.editState);

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

  const deleteLinkMutation = useMutation(
    (shortLink: string) => deleteLink(shortLink),
    {
      onSuccess: () => {
        dispatch(chooseCard("deleted"));
      },
    }
  );

  const editLinkMutation = useMutation(
    (linkData: EditLinkData) => editLink(linkData),
    {
      onSuccess: (data) => {
        dispatch(chooseCard(data._id));
        dispatch(editCard(false));
      },
    }
  );

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    editLinkMutation.mutate({
      shortLink: link.shortLink,
      newShortLink: data.shortLink,
    });

    toast.success("Ссылка успешно изменена!", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.wrapper__fullLink}>{link.fullLink}</p>
      {editCardState ? (
        <span className={styles.wrapper__editLinkForm}>
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
      ) : (
        <div className={styles.wrapper__shortLink}>
          <div className={styles.wrapper__shortLinkBlock}>
            <Link href={`/${link.shortLink}`}>
              <a target="_blank">goshort.ga/{link.shortLink}</a>
            </Link>
            <CopyToClipboard
              text={`https://goshort.ga/${link.shortLink}`}
              onCopy={() =>
                toast.success("Ссылка скопирована!", {
                  position: "bottom-center",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: true,
                  progress: undefined,
                })
              }
            >
              <button type="button">
                <AiOutlineCopy />
              </button>
            </CopyToClipboard>
          </div>
        </div>
      )}

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
          onClick={() => deleteLinkMutation.mutate(link.shortLink)}
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
