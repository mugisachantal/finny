import { useState } from "react";
import { GiTakeMyMoney } from "react-icons/gi";
import { TbHistoryToggle } from "react-icons/tb";

export const QuickActions = () => {
  const [amount, setAmount] = useState("200000");
  const [chatAnswer, setChatAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getRecommendation = async () => {
    setLoading(true);
    const response = await fetch("/api/v1/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestedAmount: Number(amount),
        requestedTenure: 30,
        urgency: "medium",
        borrowerProfile: {
          incomeBand: "low",
          borrowingExperience: "first_time",
        },
      }),
    });
    const data = await response.json();
    setChatAnswer(
      data.data?.recommendations?.[0]?.name
        ? `Top match: ${data.data.recommendations[0].name} — UGX ${data.data.recommendations[0].totalRepayment}`
        : "No recommendation available yet.",
    );
    setLoading(false);
  };


  return (
    <div className="w-xl space-y-10 flex flex-col items-center justify-center min-h-[40vh] pt-24">
      <div className="w-full text-center">
        <h1 className="text-4xl font-medium">Welcome Back, Jerome !</h1>
      </div>
      <div className="flex items-center flex-col justify-center p-2 border rounded-md space-y-4">
        <div className="flex items-end w-full justify-between">
          <div className="flex space-x-5 items-center w-full px-3">
            <label className="text-sm font-medium whitespace-nowrap">
              Amount (UGX)
            </label>
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="w-full px-3 py-2 outline-none font-semibold text-lg"
            />
          </div>

          <button
            onClick={getRecommendation}
            className="w-fit bg-[#BA5A31] text-white rounded-sm h-10 px-6 whitespace-nowrap font-medium cursor-pointer"
            disabled={loading}
          >
            {loading ? "Looking..." : "Find Loans"}
          </button>
        </div>
        {/*<div className="flex items-center space-x-2 w-full">
          <span className="px-5 py-1 text-sm bg-teal-500/50 rounded-[6px]">
            35,000
          </span>
          <span className="px-5 py-1 text-sm bg-teal-500/50 rounded-[6px]">
            35,000
          </span>
          <span className="px-5 py-1 text-sm bg-teal-500/50 rounded-[6px]">
            35,000
          </span>
          <span className="px-5 py-1 text-sm bg-teal-500/50 rounded-[6px]">
            35,000
          </span>
        </div>*/}
      </div>

      <div className="grid grid-cols-3 gap-6 w-full">
        <div className="border w-full flex flex-col items-center justify-center p-2 rounded-md">
          <div className="w-1/3 aspect-square flex items-center justify-center">
            <GiTakeMyMoney className="text-4xl" />
          </div>
          <h2 className="text-xl font-medium text-center py-3">Quick Loan</h2>
        </div>
        <div className="border w-full flex flex-col items-center justify-center p-2 rounded-md">
          <div className="w-1/3 aspect-square flex items-center justify-center">
            <TbHistoryToggle className="text-4xl" />
          </div>
          <h2 className="text-xl font-medium text-center py-3">Quick Loan</h2>
        </div>
        <div className="border w-full flex flex-col items-center justify-center p-2 rounded-md">
          <div className="w-1/3 aspect-square flex items-center justify-center">
            <GiTakeMyMoney className="text-4xl" />
          </div>
          <h2 className="text-xl font-medium text-center py-3">Quick Loan</h2>
        </div>
      </div>

      {chatAnswer && <p className="text-sm text-slate-700">{chatAnswer}</p>}
    </div>
  );
};
