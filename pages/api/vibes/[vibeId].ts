import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { redis } from "lib/upstash";

import type { Record, Response } from ".";

// PUT api/vibes/[vibeId]
// GET api/vibes/[vibeId]
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || session?.user?.email) {
    res.status(401).json({ error: "Requires Authentication." });
    return;
  }

  switch (req.method) {
    case "GET":
      {
        const { vibeId } = req.query as { vibeId: string };
        const id = parseInt(vibeId);

        const results = await redis.zrange<{ score: number; member: Record }[]>(
          `vibe:${session?.user?.email}`,
          id,
          id,
          { byScore: true, withScores: true }
        );

        if (results.length) {
          res
            .status(200)
            .json({ id: id, results: [{ id: id, ...results[0].member }] });
        } else {
          res.status(404).json({ error: "Not found." });
        }
      }
      break;

    default:
      res.status(405).json({ error: "Method Not Allowed." });
  }
}
