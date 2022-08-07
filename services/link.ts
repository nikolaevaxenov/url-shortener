export interface LinkData {
  fullLink: string;
  username?: string | null;
}

export interface EditLinkData {
  shortLink: string;
  newShortLink: string;
}

export interface SetPasswordOnLinkData {
  shortLink: string;
  password: string;
  oldPassword?: string;
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
    method: linkData.username ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(linkData),
  });

  return res.json();
};

export const incrementViewsOnLink = async (shortLink: string, ssr = false) => {
  const resLink = await getLink(shortLink, ssr);
  const currentViews = await resLink.views;

  const res = await fetch(
    `${ssr ? process.env.APP_URL : ""}/api/links/${shortLink}`,
    {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ views: currentViews + 1 }),
    }
  );

  return res.json();
};

export const deleteLink = async (shortLink: string, ssr = false) => {
  const res = await fetch(
    `${ssr ? process.env.APP_URL : ""}/api/links/${shortLink}`,
    {
      method: "delete",
    }
  );

  return res.json();
};

export const editLink = async (
  { shortLink, newShortLink }: EditLinkData,
  ssr = false
) => {
  const res = await fetch(
    `${ssr ? process.env.APP_URL : ""}/api/links/${shortLink}`,
    {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shortLink: newShortLink }),
    }
  );

  return res.json();
};

export const validateLink = async (shortLink: string, ssr = false) => {
  const usedWords = ["profile"];

  const res = await fetch(
    `${ssr ? process.env.APP_URL : ""}/api/links/${shortLink}`,
    {
      method: "get",
    }
  );

  const result = await res.json();

  if (usedWords.includes(shortLink) || result !== null) {
    return "Указанная короткая ссылка уже существует";
  } else {
    return true;
  }
};

export const setPasswordOnLink = async (
  { shortLink, password, oldPassword }: SetPasswordOnLinkData,
  ssr = false
) => {
  const res = await fetch(
    `${ssr ? process.env.APP_URL : ""}/api/links/password/`,
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
