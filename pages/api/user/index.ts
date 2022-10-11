import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { redis } from "lib/upstash";

import endOfDay from "date-fns/endOfDay";
import endOfWeek from "date-fns/endOfWeek";
import endOfMonth from "date-fns/endOfMonth";
import fromUnixTime from "date-fns/fromUnixTime";
import getUnixTime from "date-fns/getUnixTime";

export type PostResponse = {};
export type ErrorResponse = { error: string };
export type Response = PostResponse | ErrorResponse;

// DELETE api/user
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session || !session?.user?.email) {
    res.status(401).json({ error: "Requires Authentication." });
    return;
  }

  switch (req.method) {
    case "DELETE":
      {
        await redis.del(`vibe:${session?.user?.email}`);
        res.status(200).json({});
      }
      break;

    default:
      res.status(405).json({ error: "Method Not Allowed." });
  }
}
