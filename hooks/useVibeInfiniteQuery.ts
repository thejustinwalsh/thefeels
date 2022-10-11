import { useInfiniteQuery } from "@tanstack/react-query";
import { fromUnixTime, getUnixTime, sub } from "date-fns";
import { ErrorResponse, GetResponse } from "pages/api/vibes";

type PageParam = {
  start: number;
  end?: number;
  groupBy?: "day" | "week" | "month";
};

export default function useVibeInfiniteQuery(
  start: Date,
  end?: Date,
  groupBy?: "day" | "week" | "month"
) {
  const startTime = getUnixTime(start);
  const endTime = end ? getUnixTime(end) : undefined;

  return useInfiniteQuery(
    ["vibes"],
    async ({ pageParam = { start: startTime, end: endTime, groupBy } }) => {
      const result = await fetch(
        `/api/vibes?start=${pageParam.start}${
          pageParam.end ? "&end=" + pageParam.end : ""
        }${pageParam.groupBy ? "&groupBy=" + pageParam.groupBy : ""}`
      );

      if (!result.ok) {
        throw new Error(((await result.json()) as ErrorResponse).error);
      }

      return (await result.json()) as GetResponse;
    },
    {
      getNextPageParam: (lastPage) => ({
        start: getUnixTime(
          sub(fromUnixTime(lastPage.cursor.start), { months: 1 })
        ),
        end: lastPage.cursor.start - 1,
        groupBy,
      }),
    }
  );
}
