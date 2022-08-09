import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../../utils/connection";
import { ResponseFuncs } from "../../../../utils/types";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const catcher = (error: Error) => res.status(400).json({ error });
  const lang = req.query.lang || "ru";

  const bcrypt = require("bcrypt");

  const handleCase: ResponseFuncs = {
    POST: withApiAuthRequired(
      async (req: NextApiRequest, res: NextApiResponse) => {
        const { Link } = await connect();
        const session = getSession(req, res);

        const linkObj = await Link.findOne({ shortLink: req.body.shortLink });

        if (linkObj !== null) {
          if (linkObj.userId === session?.user.sub) {
            if (linkObj.password === "") {
              if (req.body.password === "") {
                linkObj.password = "";
                linkObj
                  .save()
                  .then((result: string) => res.status(200).json(result));
              } else {
                bcrypt.hash(
                  req.body.password,
                  10,
                  function (err: string, hash: string) {
                    linkObj.password = hash;
                    linkObj
                      .save()
                      .then((result: string) => res.status(200).json(result));
                  }
                );
              }
            } else {
              if (req.body.password === "") {
                bcrypt.compare(
                  req.body.oldPassword,
                  linkObj.password,
                  function (err: string, result: boolean) {
                    if (result) {
                      linkObj.password = "";
                      linkObj
                        .save()
                        .then((result: string) => res.status(200).json(result));
                    } else {
                      res.status(403).json({});
                    }
                  }
                );
              } else {
                bcrypt.compare(
                  req.body.oldPassword,
                  linkObj.password,
                  function (err: string, result: boolean) {
                    if (result) {
                      bcrypt.hash(
                        req.body.password,
                        10,
                        function (err: string, hash: string) {
                          linkObj.password = hash;
                          linkObj
                            .save()
                            .then((result: string) =>
                              res.status(200).json(result)
                            );
                        }
                      );
                    } else {
                      res.status(403).json({});
                    }
                  }
                );
              }
            }
          } else {
            res.status(403).json({
              error:
                lang === "ru"
                  ? "Вы не владеете указанной короткой ссылкой"
                  : "You do not own the specified short link",
            });
          }
        } else {
          res.status(404).json({});
        }
      }
    ),
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Link } = await connect();

      const linkObj = await Link.findOne({ shortLink: req.body.shortLink });

      if (linkObj !== null) {
        bcrypt.compare(
          req.body.password,
          linkObj.password,
          function (err: string, result: boolean) {
            if (result) {
              res.status(200).json({ fullLink: linkObj.fullLink });
            } else {
              res.status(403).json({});
            }
          }
        );
      } else {
        res.status(404).json({});
      }
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
