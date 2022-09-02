import type { NextPage } from "next";
import { NextPageWithLayout } from "./_app";
import Layout from "components/layout/Layout";
import AuthLayout from "components/layout/AuthLayout";

const Timeline: NextPageWithLayout = () => {
  return <h1>Hello</h1>;
};

Timeline.getLayout = function getLayout(page) {
  return (
    <Layout>
      <AuthLayout>{page}</AuthLayout>
    </Layout>
  );
};

export default Timeline;
