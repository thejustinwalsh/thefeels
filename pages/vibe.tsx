import { NextPageWithLayout } from "./_app";
import Layout from "components/layout/Layout";
import AuthLayout from "components/layout/AuthLayout";
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
      <AuthLayout>{page}</AuthLayout>
    </Layout>
  );
};

export default Vibe;
