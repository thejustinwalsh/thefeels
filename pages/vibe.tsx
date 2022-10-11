import { NextPageWithLayout } from "./_app";
import Layout from "components/layout/Layout";
import PageLayout from "components/layout/PageLayout";
import CurrentVibe from "components/CurrentVibe";
import DailyVibe from "components/DailyVibe";

const Vibe: NextPageWithLayout = () => {
  return (
    <>
      <CurrentVibe />
      <DailyVibe />
    </>
  );
};

Vibe.getLayout = function getLayout(page) {
  return (
    <Layout>
      <PageLayout>{page}</PageLayout>
    </Layout>
  );
};

export default Vibe;
