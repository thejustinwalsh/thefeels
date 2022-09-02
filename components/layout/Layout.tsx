import Head from "next/head";

type Props = {
  children?: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <title>theFEELS</title>
        <meta name="description" content="Daily Vibe Tracker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </>
  );
}
