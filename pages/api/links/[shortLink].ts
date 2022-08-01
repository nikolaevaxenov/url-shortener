import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/connection";
import { ResponseFuncs } from "../../../utils/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const catcher = (error: Error) => res.status(400).json({ error });

  const shortLink: string = req.query.shortLink as string;

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Link } = await connect();
      res.json(await Link.findOne({ shortLink: shortLink }).catch(catcher));
    },
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Link } = await connect();
      res.json(
        await Link.findOneAndUpdate({ shortLink: shortLink }, req.body, {
          new: true,
        }).catch(catcher)
      );
    },
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Link } = await connect();
      res.json(
        await Link.findOneAndRemove({ shortLink: shortLink }).catch(catcher)
      );
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
