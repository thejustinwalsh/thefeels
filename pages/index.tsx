import { NextPageWithLayout } from "./_app";
import { InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react";
import { hasKey } from "lib/utils";
import Github from "components/icons/Github";
import Facebook from "components/icons/Facebook";
import Footer from "components/Footer";

const BUTTON_STYLES = {
  GitHub: {
    color: "#444444",
    icon: <Github />,
  },
  Facebook: {
    color: "#3B5998",
    icon: <Facebook />,
  },
};

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

const Home: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ providers }) => {
  return (
    <div data-theme="dark" className="flex flex-col h-screen justify-between">
      <header>
        <div className="hero min-h-screen bg-base-200 hero-gradient text-slate-50">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold">Get Started Now</h1>
              <p className="py-6">
                theFEELS is a daily vibe tracking app for journaling your
                thoughts and feels.
              </p>
            </div>
            <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
              <div className="card-body">
                {providers &&
                  Object.values(providers).map((provider) => (
                    <div key={provider.name}>
                      <button
                        className="btn btn-block gap-2"
                        style={{
                          backgroundColor: `${
                            hasKey(BUTTON_STYLES, provider.name)
                              ? BUTTON_STYLES[provider.name].color
                              : "inherit"
                          }`,
                        }}
                        onClick={() =>
                          signIn(provider.id, { callbackUrl: "/vibe" })
                        }
                      >
                        {hasKey(BUTTON_STYLES, provider.name) &&
                          BUTTON_STYLES[provider.name].icon}
                        Sign in with {provider.name}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </header>
      <main></main>
      <Footer />
    </div>
  );
};

export default Home;
