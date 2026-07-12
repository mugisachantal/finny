import { useState } from "react";
import { QuickActions } from "../components/quick-actions";
import { Recents } from "../components/recents";
import { TopLoaners } from "../components/sections/top-loaners";
import { StatusBar } from "../components/status-bar";
import { Footer } from "../components/sections/footer";
import { Navbar } from "@/components/navbar.tsx";
import { FloatingChatbot } from "../components/FloatingChatbot";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <main className="w-full min-h-screen relative overflow-x-hidden">
      <Navbar />
      <section className="w-full min-h-screen flex flex-col items-center justify-between bg-background py-32">
        <div className="flex flex-col items-center justify-center h-full">
          <QuickActions />
          <Recents />
        </div>
      </section>
      <section className="w-full min-h-screen flex flex-col items-center justify-between bg-background">
        <TopLoaners />
      </section>
      <StatusBar onAskFinny={() => setChatOpen(true)} />
      <Footer />
      <FloatingChatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </main>
  );
}
