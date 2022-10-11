import { useCallback } from "react";
import { endOfToday, format, fromUnixTime, startOfToday } from "date-fns";
import useVibeQuery from "hooks/useVibeQuery";

import type { Record as VibeRecord } from "pages/api/vibes";

export default function DailyVibe() {
  const vibeQuery = useVibeQuery(startOfToday(), endOfToday());

  const vibeColor = useCallback((record: VibeRecord) => {
    const max = Math.max(
      record.contentedness,
      record.anxiousness,
      record.tiredness
    );
    switch (
      [record.contentedness, record.anxiousness, record.tiredness].indexOf(max)
    ) {
      case 0:
        return "text-primary";
      case 1:
        return "text-secondary";
      case 2:
        return "text-accent";
    }
    return "";
  }, []);

  const data =
    vibeQuery.data && vibeQuery.data.results.length > 0
      ? vibeQuery.data?.results[0]
      : undefined;

  return (
    <div className="card bg-base-200 shadow-xl my-8">
      <div className="card-body not-prose">
        <h1 className="card-title text-2xl">Today&apos;s Vibe</h1>
        <div className="flex flex-grow items-center justify-between gap-2 py-2">
          <div className="flex flex-grow items-center">
            <label className="pr-2">😊</label>
            <progress
              className="progress progress-primary shadow-sm"
              value={data?.average.contentedness ?? 0}
              max="100"
            ></progress>
          </div>
          <div className="flex flex-grow items-center">
            <label className="pr-2">😳</label>
            <progress
              className="progress progress-secondary shadow-sm"
              value={data?.average.anxiousness ?? 0}
              max="100"
            ></progress>
          </div>
          <div className="flex flex-grow items-center">
            <label className="pr-2">😴</label>
            <progress
              className="progress progress-accent shadow-sm"
              value={data?.average.tiredness ?? 0}
              max="100"
            ></progress>
          </div>
        </div>
        <div className="flex flex-col prose">
          {data?.entries.map((entry) => (
            <div key={entry.id} className="flex flex-grow pb-2">
              <p
                className={`flex-none w-24 font-extrabold ${vibeColor(entry)}`}
              >
                {format(fromUnixTime(entry.id), "h:mm a")}
              </p>
              <p className="grow">{entry.thoughts}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
