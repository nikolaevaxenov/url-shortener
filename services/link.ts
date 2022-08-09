export interface LinkData {
  fullLink: string;
  userId?: string | null;
}

export interface DeleteLinkData {
  shortLink: string;
  lang?: string;
}

export interface EditLinkData {
  shortLink: string;
  newShortLink: string;
  lang?: string;
}

export interface SetPasswordOnLinkData {
  shortLink: string;
  password: string;
  oldPassword?: string;
  lang?: string;
}

export type CheckPasswordOnLinkData = Omit<
  SetPasswordOnLinkData,
  "oldPassword"
>;

export const getLink = async (shortLink: string, ssr = false) => {
  const res = await fetch(
    `${ssr ? process.env.APP_URL : ""}/api/links/${shortLink}`,
    {
      method: "get",
    }
  );

  return res.json();
};

export const getUserLinks = async (email: string, ssr = false) => {
  const res = await fetch(`${ssr ? process.env.APP_URL : ""}/api/links`, {
    method: "get",
  });

  return res.json();
};

export const createLink = async (linkData: LinkData, ssr = false) => {
  const res = await fetch(`${ssr ? process.env.APP_URL : ""}/api/links`, {
    method: linkData.userId ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(linkData),
  });

  return res.json();
};

export const incrementViewsOnLink = async (shortLink: string, ssr = false) => {
  const res = await fetch(
    `${ssr ? process.env.APP_URL : ""}/api/links/${shortLink}`,
    {
      method: "post",
    }
  );

  return res.json();
};

export const deleteLink = async (
  { shortLink, lang }: DeleteLinkData,
  ssr = false
) => {
  const res = await fetch(
    `${ssr ? process.env.APP_URL : ""}/api/links/${shortLink}?lang=${
      lang ?? "ru"
    }`,
    {
      method: "delete",
    }
  );

  return res.json();
};

export const editLink = async (
  { shortLink, newShortLink, lang }: EditLinkData,
  ssr = false
) => {
  const res = await fetch(
    `${ssr ? process.env.APP_URL : ""}/api/links/${shortLink}?lang=${
      lang ?? "ru"
    }`,
    {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shortLink: newShortLink }),
    }
  );

  if (!res.ok) {
    const result = await res.json();

    throw new Error(result.error);
  } else {
    return res.json();
  }
};

export const setPasswordOnLink = async (
  { shortLink, password, oldPassword, lang }: SetPasswordOnLinkData,
  ssr = false
) => {
  const res = await fetch(
    `${ssr ? process.env.APP_URL : ""}/api/links/password?lang=${lang ?? "ru"}`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shortLink,
        password,
        oldPassword: oldPassword ?? "",
      }),
    }
  );

  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Wrong password!");
  }
};

export const checkPasswordOnLink = async (
  { shortLink, password }: CheckPasswordOnLinkData,
  ssr = false
) => {
  const res = await fetch(
    `${ssr ? process.env.APP_URL : ""}/api/links/password/`,
    {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shortLink,
        password,
      }),
    }
  );

  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Wrong password!");
  }
};
