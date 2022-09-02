import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type { Record as VibeRecord } from "pages/api/vibes";

type Params = {
  queryKey: [string, { start: number }, { end: number }];
};

type Result = {
  averageVibe: {
    contentedness: number;
    anxiousness: number;
    tiredness: number;
  };
  records: VibeRecord[];
};

export default function DailyVibe() {
  const start = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
  const end = Math.floor(new Date().setHours(23, 59, 59, 0) / 1000);

  const vibeQuery = useQuery(
    ["vibes", { start }, { end }],
    async (params: Params) => {
      const [, { start }, { end }] = params.queryKey;
      const result = await fetch(`/api/vibes?start=${start}&end=${end}`);
      const { results: records } = (await result.json()) as {
        results: VibeRecord[];
      };

      const data: Result = {
        averageVibe: {
          contentedness: 0,
          anxiousness: 0,
          tiredness: 0,
        },
        records: [],
      };

      if (records.length) {
        const total = records.length;
        data.averageVibe.contentedness =
          records.reduce((acc, cur) => acc + cur.contentedness, 0) / total;
        data.averageVibe.anxiousness =
          records.reduce((acc, cur) => acc + cur.anxiousness, 0) / total;
        data.averageVibe.tiredness =
          records.reduce((acc, cur) => acc + cur.tiredness, 0) / total;
        data.records = records;
      }

      console.log(data);
      return data;
    }
  );

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

  return (
    <div className="card bg-base-200 shadow-xl my-8">
      <div className="card-body not-prose">
        <h1 className="card-title text-2xl">Today&apos;s Vibe</h1>
        <div className="flex flex-grow items-center justify-between gap-2 py-2">
          <div className="flex flex-grow items-center">
            <label className="pr-2">😊</label>
            <progress
              className="progress progress-primary shadow-sm"
              value={vibeQuery.data?.averageVibe.contentedness ?? 0}
              max="100"
            ></progress>
          </div>
          <div className="flex flex-grow items-center">
            <label className="pr-2">😳</label>
            <progress
              className="progress progress-secondary shadow-sm"
              value={vibeQuery.data?.averageVibe.anxiousness ?? 0}
              max="100"
            ></progress>
          </div>
          <div className="flex flex-grow items-center">
            <label className="pr-2">😴</label>
            <progress
              className="progress progress-accent shadow-sm"
              value={vibeQuery.data?.averageVibe.tiredness ?? 0}
              max="100"
            ></progress>
          </div>
        </div>
        <div className="flex flex-col prose">
          {vibeQuery.data?.records.map((record) => (
            <div key={record.id} className="flex flex-grow pb-2">
              <p
                className={`flex-none w-24 font-extrabold ${vibeColor(record)}`}
              >
                {format(new Date((record.id || 0) * 1000), "h:mm a")}
              </p>
              <p className="grow">{record.thoughts}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
