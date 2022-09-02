import Image from "next/image";
import Navbar from "components/Navbar";
import Footer from "components/Footer";

type Props = {
  children?: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="flex flex-col h-screen justify-between">
      <header>
        <Navbar />
      </header>
      <main className="prose container mx-auto justify-center p-2">
        {children}
      </main>
      <Footer />
    </div>
  );
}
