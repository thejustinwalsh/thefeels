import { endOfMonth, format, fromUnixTime, startOfMonth } from "date-fns";
import { NextPageWithLayout } from "./_app";
import Layout from "components/layout/Layout";
import PageLayout from "components/layout/PageLayout";
import Calendar from "components/icons/Calendar";
import useVibeInfiniteQuery from "hooks/useVibeInfiniteQuery";

const Timeline: NextPageWithLayout = () => {
  const vibeQuery = useVibeInfiniteQuery(
    startOfMonth(new Date()),
    endOfMonth(new Date()),
    "week"
  );

  return (
    <div className="flex gap-8">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Jump To</span>
        </label>
        <div className="input-group">
          <input
            type="date"
            placeholder="Type here"
            className="input input-bordered w-full max-w-sm"
          />
          <button className="btn btn-square">
            <Calendar />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {vibeQuery.data &&
          vibeQuery.data.pages.map((data) =>
            data.results.map((results) =>
              results.entries.map((entry) => {
                return (
                  <>
                    <h2 className="h-4">
                      {format(fromUnixTime(entry.id), "MM/dd/yyyy h:mm a")}
                    </h2>
                    <span key={entry.id}>{entry.thoughts}</span>
                  </>
                );
              })
            )
          )}
        {vibeQuery.hasNextPage && (
          <button className="btn" onClick={() => vibeQuery.fetchNextPage()}>
            Older Vibes
          </button>
        )}
      </div>
    </div>
  );
};

Timeline.getLayout = function getLayout(page) {
  return (
    <Layout>
      <PageLayout>{page}</PageLayout>
    </Layout>
  );
};

export default Timeline;
