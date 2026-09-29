import { ActivityToast } from "@/components/ActivityToast";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { UIProvider } from "@/components/UIProvider";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Sectors } from "@/components/sections/Sectors";
import { Services } from "@/components/sections/Services";

export default function HomePage() {
  return (
    <UIProvider>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Sectors />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <ActivityToast />
    </UIProvider>
  );
}
