import { useState } from "react";

export function FloatingChatbot() {
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([
		{ role: "bot", text: "Hi, I’m Finny AI. How can I help you today?" },
	]);

	const sendMessage = () => {
		const trimmedMessage = message.trim();

		if (!trimmedMessage) {
			return;
		}

		setMessages((currentMessages) => [
			...currentMessages,
			{ role: "user", text: trimmedMessage },
			{
				role: "bot",
				text: "Thanks. I can help with onboarding, loan guidance, and lender support.",
			},
		]);
		setMessage("");
	};

	return (
		<>
			{isChatOpen ? (
				<div className="fixed bottom-24 right-6 z-50 w-[20rem] overflow-hidden rounded-[1.5rem] border border-[color:var(--color-dust-grey)] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.16)]">
					<div className="flex items-center justify-between bg-[color:var(--color-ebony)] px-4 py-3 text-white">
						<div>
							<p className="text-sm font-semibold">Finny AI</p>
							<p className="text-xs text-white/80">Online now</p>
						</div>
						<button
							type="button"
							onClick={() => setIsChatOpen(false)}
							aria-label="Close chatbot"
							className="rounded-full px-2 py-1 text-sm transition hover:bg-white/10"
						>
							✕
						</button>
					</div>

					<div className="max-h-[22rem] space-y-3 overflow-y-auto bg-[color:var(--color-soft-linen)] px-4 py-4">
						{messages.map((chatMessage, index) => (
							<div
								key={`${chatMessage.role}-${index}`}
								className={`flex ${chatMessage.role === "user" ? "justify-end" : "justify-start"}`}
							>
								<div
									className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
										chatMessage.role === "user"
											? "bg-[color:var(--color-muted-teal)] text-white"
											: "bg-white text-[color:var(--color-charcoal)] shadow-sm"
									}`}
								>
									{chatMessage.text}
								</div>
							</div>
						))}
					</div>

					<div className="border-t border-[color:var(--color-dust-grey)] bg-white p-3">
						<div className="flex gap-2">
							<input
								type="text"
								value={message}
								onChange={(event) => setMessage(event.target.value)}
								onKeyDown={(event) => {
									if (event.key === "Enter") {
										sendMessage();
									}
								}}
								placeholder="Type a message..."
								className="flex-1 rounded-xl border border-[color:var(--color-dust-grey)] bg-[color:var(--color-soft-linen)] px-3 py-2.5 text-sm text-[color:var(--color-charcoal)] outline-none placeholder:text-[color:var(--color-charcoal)]/40 focus:border-[color:var(--color-muted-teal)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(164,194,165,0.12)]"
							/>
							<button
								type="button"
								onClick={sendMessage}
								className="rounded-xl bg-[color:var(--color-ebony)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-95"
							>
								Send
							</button>
						</div>
					</div>
				</div>
			) : null}

			<button
				type="button"
				onClick={() => setIsChatOpen((current) => !current)}
				aria-label="Open chatbot"
				className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--color-ebony)] text-white shadow-[0_18px_40px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-1"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="h-6 w-6"
					aria-hidden="true"
				>
					<path d="M4 6.5A3.5 3.5 0 0 1 7.5 3h9A3.5 3.5 0 0 1 20 6.5v6A3.5 3.5 0 0 1 16.5 16H10l-4 4v-4h-.5A3.5 3.5 0 0 1 2 12.5v-6Z" />
					<path d="M8 8.5h8" />
					<path d="M8 11.5h5" />
				</svg>
			</button>
		</>
	);
}
