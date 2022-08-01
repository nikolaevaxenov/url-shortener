import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../../utils/connection";
import { ResponseFuncs } from "../../../../utils/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const catcher = (error: Error) => res.status(400).json({ error });

  const username: string = req.query.username as string;

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Link } = await connect();
      res.json(await Link.find({ username: username }).catch(catcher));
    },
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Link } = await connect();
      const idReq = await fetch(`${process.env.APP_URL}/api/randomid`);
      const shortLink = await idReq.json();

      res.json(
        await Link.create({
          ...req.body,
          username: username,
          shortLink: shortLink.id,
        }).catch(catcher)
      );
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
