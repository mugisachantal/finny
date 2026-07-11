import { useState } from "react";

export const QuickActions = () => {
  const [amount, setAmount] = useState("200000");
  const [message, setMessage] = useState("");
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [chatAnswer, setChatAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getRecommendation = async () => {
    setLoading(true);
    const response = await fetch("/api/finny/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestedAmount: Number(amount),
        requestedTenure: 30,
        urgency: "medium",
        borrowerProfile: { incomeBand: "low", borrowingExperience: "first_time" },
      }),
    });
    const data = await response.json();
    setRecommendation(data.recommendations?.[0]?.name ? `Top match: ${data.recommendations[0].name} — UGX ${data.recommendations[0].totalRepayment}` : "No recommendation available yet.");
    setLoading(false);
  };

  const askChat = async () => {
    if (!message.trim()) return;
    const response = await fetch("/api/finny/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        userProfile: { income_band: "low", education_level: "secondary", region: "kampala" },
        currentApplication: { requested_amount: Number(amount), requested_tenure_days: 30, purpose: "emergency" },
      }),
    });
    const data = await response.json();
    setChatAnswer(data.answer || "I can help explain loan costs and fraud warnings.");
    setMessage("");
  };

  return (
    <div className="w-md p-5 border rounded-3xl space-y-4 bg-white">
      <div className="space-y-2">
        <label className="text-sm font-medium">Loan amount (UGX)</label>
        <input value={amount} onChange={(event) => setAmount(event.target.value)} className="w-full border rounded-lg px-3 py-2" />
      </div>

      <button onClick={getRecommendation} className="w-full bg-[#BA5A31] text-white rounded-lg h-10" disabled={loading}>
        {loading ? "Checking options..." : "Get recommendation"}
      </button>
      {recommendation && <p className="text-sm text-slate-700">{recommendation}</p>}

      <div className="space-y-2">
        <label className="text-sm font-medium">Ask Finny</label>
        <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Is this loan safe?" className="w-full border rounded-lg px-3 py-2" />
        <button onClick={askChat} className="w-full border rounded-lg h-10">Ask</button>
      </div>
      {chatAnswer && <p className="text-sm text-slate-700">{chatAnswer}</p>}
    </div>
  );
};
