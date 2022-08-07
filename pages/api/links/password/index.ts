import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../../utils/connection";
import { ResponseFuncs } from "../../../../utils/types";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const catcher = (error: Error) => res.status(400).json({ error });

  const handleCase: ResponseFuncs = {
    POST: withApiAuthRequired(
      async (req: NextApiRequest, res: NextApiResponse) => {
        const { Link } = await connect();

        const linkObj = await Link.findOne({ shortLink: req.body.shortLink });

        if (linkObj.password === req.body.oldPassword) {
          linkObj.password = req.body.password;
          const result = await linkObj.save();
          res.status(200).json(result);
        } else {
          res.status(403).json({});
        }
      }
    ),
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Link } = await connect();

      const linkObj = await Link.findOne({ shortLink: req.body.shortLink });

      if (linkObj.password === req.body.password) {
        res.status(200).json({});
      } else {
        res.status(403).json({});
      }
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
