import { MdOutlineContactSupport } from "react-icons/md";
import { FinnyAiButton } from "./finny-ai-button";

interface StatusBarProps {
  onAskFinny: () => void;
}

export const StatusBar = ({ onAskFinny }: StatusBarProps) => {
  return (
    <div className="py-5 fixed bottom-0 w-screen left-0 bg-background z-40">
      <div className="w-7xl flex items-center justify-between mx-auto">
        <div className="flex items-center space-x-4 w-fit">
          <span className="text-sm font-medium">Help</span>
          <MdOutlineContactSupport />
        </div>
        <div className="flex items-center space-x-4 w-fit">
          <span className="text-sm font-medium">Ask Finny AI</span>
          <FinnyAiButton onClick={onAskFinny} />
        </div>
      </div>
    </div>
  );
};
