import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/connection";
import { ResponseFuncs } from "../../../utils/types";
import { customAlphabet } from "nanoid";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  6
);

const getSafeRandomId = async () => {
  const { Link } = await connect();

  const safeId = nanoid();

  const link = await Link.findOne({ shortLink: safeId });

  if (link !== null) {
    getSafeRandomId();
  } else {
    return safeId;
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const catcher = (error: Error) => res.status(400).json({ error });

  const handleCase: ResponseFuncs = {
    GET: withApiAuthRequired(
      async (req: NextApiRequest, res: NextApiResponse) => {
        const { Link } = await connect();
        const session = getSession(req, res);

        res.json(
          await Link.find({ username: session?.user.sub }).catch(catcher)
        );
      }
    ),
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Link } = await connect();

      const safeId = await getSafeRandomId();
      console.log(safeId);
      const currDate = new Date();

      res.json(
        await Link.create({
          fullLink: req.body.fullLink,
          username: "Guest",
          shortLink: safeId,
          createdAt: currDate,
        }).catch(catcher)
      );
    },
    PUT: withApiAuthRequired(
      async (req: NextApiRequest, res: NextApiResponse) => {
        const { Link } = await connect();
        const session = getSession(req, res);

        const safeId = await getSafeRandomId();
        console.log(safeId);
        const currDate = new Date();

        res.json(
          await Link.create({
            fullLink: req.body.fullLink,
            username: session?.user.sub,
            shortLink: safeId,
            createdAt: currDate,
          }).catch(catcher)
        );
      }
    ),
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
