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
        const session = getSession(req, res);

        const usedWords = ["profile"];

        const link = await Link.findOne({ shortLink: shortLink }).catch(
          catcher
        );

        if (link !== null) {
          if (link.userId === session?.user.sub) {
            const checkId = await Link.exists({
              shortLink: req.body.shortLink,
            });

            if (checkId || usedWords.includes(shortLink)) {
              res
                .status(409)
                .json({ error: "Указанная короткая ссылка уже существует" });
            } else {
              link.shortLink = req.body.shortLink;

              link
                .save()
                .then((result: string) => res.status(200).json(result));
            }
          } else {
            res
              .status(403)
              .json({ error: "Вы не владеете указанной короткой ссылкой" });
          }
        } else {
          res.status(404).json(null);
        }
      }
    ),
    DELETE: withApiAuthRequired(
      async (req: NextApiRequest, res: NextApiResponse) => {
        const { Link } = await connect();
        const session = getSession(req, res);

        const link = await Link.findOne({ shortLink: shortLink }).catch(
          catcher
        );

        if (link !== null) {
          if (link.userId === session?.user.sub) {
            link
              .remove()
              .then((result: string) => res.status(200).json(result));
          } else {
            res
              .status(403)
              .json({ error: "Вы не владеете указанной короткой ссылкой" });
          }
        } else {
          res.status(404).json(null);
        }
      }
    ),
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
