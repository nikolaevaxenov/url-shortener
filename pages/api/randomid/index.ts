import type { NextApiRequest, NextApiResponse } from "next";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  6
);

const getSafeRandomId = async () => {
  const safeId = nanoid();
  const res = await fetch(`${process.env.APP_URL}/api/links/${safeId}`, {
    method: "get",
  });
  const result = await res.json();

  if (result !== null) {
    getSafeRandomId();
  } else {
    return safeId;
  }
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  getSafeRandomId().then((safeId) => res.status(200).json({ id: safeId }));
};

export default handler;
