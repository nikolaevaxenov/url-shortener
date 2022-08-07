import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/connection";
import { ResponseFuncs } from "../../../utils/types";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const catcher = (error: Error) => res.status(400).json({ error });

  const shortLink: string = req.query.shortLink as string;

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Link } = await connect();

      const link = await Link.findOne({ shortLink: shortLink }).catch(catcher);

      if (link !== null) {
        if (link.password === "") {
          res.json({ password: "", fullLink: link.fullLink });
        } else {
          res.status(403).json({ shortLink });
        }
      } else {
        res.status(404).json({});
      }
    },
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Link } = await connect();

      const link = await Link.findOne({ shortLink: shortLink }).catch(catcher);
      if (link !== null) {
        link.views = link.views + 1;
        link.save().then(() => res.status(200).json({}));
      } else {
        res.status(404).json({});
      }
    },
    PUT: withApiAuthRequired(
      async (req: NextApiRequest, res: NextApiResponse) => {
        const { Link } = await connect();
        const usedWords = ["profile"];

        const checkId = await Link.exists({ shortLink: req.body.shortLink });

        if (checkId || usedWords.includes(shortLink)) {
          res
            .status(409)
            .json({ error: "Указанная короткая ссылка уже существует" });
        } else {
          res.json(
            await Link.findOneAndUpdate(
              { shortLink: shortLink },
              { shortLink: req.body.shortLink },
              {
                new: true,
              }
            ).catch(catcher)
          );
        }
      }
    ),
    DELETE: withApiAuthRequired(
      async (req: NextApiRequest, res: NextApiResponse) => {
        const { Link } = await connect();
        res.json(
          await Link.findOneAndRemove({ shortLink: shortLink }).catch(catcher)
        );
      }
    ),
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
