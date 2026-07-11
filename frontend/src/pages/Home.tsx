import { Navbar } from "../components/navbar";
import { QuickActions } from "../components/quick-actions";
import { Recents } from "../components/recents";
import { TopLoaners } from "../components/sections/top-loaners";
import { StatusBar } from "../components/status-bar";
import { Footer } from "../components/sections/footer";
import { FloatingChatbot } from "../components/FloatingChatbot.tsx";
export default function Home() {
  return (
    <main className="w-screen min-h-screen relative">
      <Navbar />
      <section className="w-full min-h-screen flex flex-col items-center justify-between bg-background">
        <div className="flex flex-col items-center justify-center h-full">
          <QuickActions />
          <Recents />
        </div>
      </section>
      <section className="w-full min-h-screen flex flex-col items-center justify-between bg-background">
        <TopLoaners />
      </section>
      <StatusBar />
      <Footer />
      <FloatingChatbot />
    </main>
  );
}
