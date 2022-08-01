import type { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ id: Math.random().toString(36).slice(-6) });
};

export default handler;
