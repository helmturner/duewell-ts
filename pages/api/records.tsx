import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err);
      }
      console.log({ fields, files });
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
