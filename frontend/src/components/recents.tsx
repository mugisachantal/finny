import { LuChevronRight } from "react-icons/lu";

export const Recents = () => {
  return (
    <section className="w-xl mx-auto mt-14">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium mb-4">Recents</h2>
        <a
          href="#"
          className="text-xs flex items-center space-x-4 hover:underline"
        >
          <span>Full History</span> <LuChevronRight />
        </a>
      </div>
      <div className="py-2 pl-4 w-full min-h-10 rounded-md bg-dust-grey/40">
        <div className="flex items-center justify-between">
          <p className="text-medium">Quick Sent loan successful</p>
          <p className="text-lg text-red-500/70 hover:text-xl p-2 pointer-cursor">
            &times;
          </p>
        </div>
      </div>
    </section>
  );
};
