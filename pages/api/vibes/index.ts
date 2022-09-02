import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { redis } from "lib/upstash";

export type Record = {
  id?: number;
  contentedness: number;
  anxiousness: number;
  tiredness: number;
  thoughts: string;
};

export type Response = {
  id?: number;
  results?: Record[];
  error?: string;
};

// POST api/vibes
// GET api/vibes?start=1&end=2
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
    case "POST":
      {
        const id = Math.floor(Date.now() / 1000);
        const body = req.body as Partial<Omit<Record, "id">>;

        const contentedness = body.contentedness || 0;
        const anxiousness = body.anxiousness || 0;
        const tiredness = body.tiredness || 0;
        const thoughts = body.thoughts || "";

        await redis.zadd<Record>(`vibe:${session?.user?.email}`, {
          score: id,
          member: { id, contentedness, anxiousness, tiredness, thoughts },
        });
        res.status(200).json({ id });
      }
      break;

    case "GET":
      {
        const { start, end } = req.query as { start?: string; end?: string };
        if (start) {
          const results = await redis.zrange<Record[]>(
            `vibe:${session?.user?.email}`,
            parseInt(start),
            end ? parseInt(end) : -1,
            { byScore: true }
          );
          res.status(200).json({ results });
        } else {
          res.status(404).json({ error: "Record not found." });
        }
      }
      break;

    default:
      res.status(405).json({ error: "Method Not Allowed." });
  }
}
