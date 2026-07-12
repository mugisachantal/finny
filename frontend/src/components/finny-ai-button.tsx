import { RiChatSmileAiLine } from "react-icons/ri";

export const FinnyAiButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <>
      <button
        onClick={onClick}
        className="relative inline-flex w-12 h-12 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 transition-transform duration-300 hover:scale-105 active:scale-95"
      >
        <span
          className="absolute inset-0 [-webkit-mask-composite:destination-out] [mask-composite:exclude] bg-[conic-gradient(from_0deg,transparent_0,transparent_360deg)] rounded-full p-[2px]"
          style={{
            background:
              "linear-gradient(-45deg, #6366f1 0%, #a855f7 50%, #6366f1 100%)",
          }}
        ></span>

        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,#a855f7_360deg)]"></span>

        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-indigo-400 text-sm font-medium backdrop-blur-3xl gap-2">
          <RiChatSmileAiLine />
        </span>
      </button>
    </>
  );
};
