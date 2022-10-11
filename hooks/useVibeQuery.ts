import { useQuery } from "@tanstack/react-query";
import getUnixTime from "date-fns/getUnixTime";
import type { ErrorResponse, GetResponse } from "pages/api/vibes";

type Params = {
  queryKey: [
    string,
    { start: number },
    { end?: number },
    { groupBy?: "day" | "week" | "month" }
  ];
};

export default function useVibeQuery(
  start: Date,
  end?: Date,
  groupBy?: "day" | "week" | "month"
) {
  const startTime = getUnixTime(start);
  const endTime = end ? getUnixTime(end) : undefined;

  return useQuery(
    ["vibes", { start: startTime }, { end: endTime }, { groupBy }],
    async (params: Params) => {
      const [, { start }, { end }, { groupBy }] = params.queryKey;
      const result = await fetch(
        `/api/vibes?start=${start}${end ? "&end=" + end : ""}${
          groupBy ? "&groupBy=" + groupBy : ""
        }`
      );

      if (!result.ok) {
        throw new Error(((await result.json()) as ErrorResponse).error);
      }

      return (await result.json()) as GetResponse;
    }
  );
}
