import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { redis } from "lib/upstash";

import endOfDay from "date-fns/endOfDay";
import endOfWeek from "date-fns/endOfWeek";
import endOfMonth from "date-fns/endOfMonth";
import fromUnixTime from "date-fns/fromUnixTime";
import getUnixTime from "date-fns/getUnixTime";

export type Record = {
  id: number;
  contentedness: number;
  anxiousness: number;
  tiredness: number;
  thoughts: string;
};

export type Result = {
  average: {
    contentedness: number;
    anxiousness: number;
    tiredness: number;
  };
  entries: Record[];
};

export type GetResponse = {
  results: Result[];
  cursor: {
    start: number;
    end: number;
  };
};
export type PostResponse = { id: number };
export type ErrorResponse = { error: string };
export type Response = GetResponse | PostResponse | ErrorResponse;

function nextGroup(
  start: number,
  end: number,
  groupBy?: "day" | "week" | "month"
) {
  const startDate = fromUnixTime(start);
  switch (groupBy) {
    case "day":
      return Math.min(end, getUnixTime(endOfDay(startDate)));
    case "week":
      return Math.min(end, getUnixTime(endOfWeek(startDate)));
    case "month":
      return Math.min(end, getUnixTime(endOfMonth(startDate)));
    default:
      return end;
  }
}

function newResult(): Result {
  return {
    average: {
      contentedness: 0,
      anxiousness: 0,
      tiredness: 0,
    },
    entries: [],
  };
}

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
        const id = getUnixTime(new Date());
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
        const {
          start: queryStart,
          end: queryEnd,
          groupBy,
        } = req.query as {
          start?: string;
          end?: string;
          groupBy?: "day" | "week" | "month";
        };
        if (queryStart) {
          const start = parseInt(queryStart);
          const end = queryEnd ? parseInt(queryEnd) : -1;

          const data = await redis.zrange<Record[]>(
            `vibe:${session?.user?.email}`,
            start,
            end,
            { byScore: true }
          );

          let cursor = end === -1 ? start : end;
          const results: Result[] = [];
          if (data.length) {
            cursor = cursor === start ? data[data.length - 1].id : cursor;
            let boundary = nextGroup(start, cursor, groupBy);
            let current = newResult();

            for (const entry of data) {
              if (entry.id <= boundary) {
                current.average.contentedness += entry.contentedness;
                current.average.anxiousness += entry.anxiousness;
                current.average.tiredness += entry.tiredness;
                current.entries.push(entry);
              }

              if (
                entry.id >= boundary ||
                entry.id === data[data.length - 1].id
              ) {
                current.average.contentedness = Math.round(
                  current.average.contentedness / current.entries.length
                );
                current.average.anxiousness = Math.round(
                  current.average.anxiousness / current.entries.length
                );
                current.average.tiredness = Math.round(
                  current.average.tiredness / current.entries.length
                );
                results.push(current);

                boundary = nextGroup(entry.id, cursor);
                current = newResult();
              }
            }
          }

          res.status(200).json({ cursor: { start, end: cursor }, results });
        } else {
          res.status(404).json({ error: "Record not found." });
        }
      }
      break;

    default:
      res.status(405).json({ error: "Method Not Allowed." });
  }
}
