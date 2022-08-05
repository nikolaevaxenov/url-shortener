import type { NextApiRequest, NextApiResponse } from "next";
import { customAlphabet } from "nanoid";
import { getLink } from "../../../services/link";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  6
);

const getSafeRandomId = async () => {
  const safeId = nanoid();
  const result = await getLink(safeId, true);

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
