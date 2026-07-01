import { LegalPageShell } from "@/components/LegalPageShell";

const EMAIL = "aureustradecapital@gmail.com";

export const metadata = {
  title: "Risk Disclosure | Aureus Trade Capital",
  description: "Important risk information for Forex trading and the ATC Bot.",
};

export default function RiskDisclosurePage() {
  return (
    <LegalPageShell
      title="Risk Disclosure"
      subtitle="Please read carefully before using our software or trading Forex."
      sections={[
        {
          title: "Forex Trading Risk",
          content: (
            <p>
              Forex trading involves substantial risk of loss and is not suitable for all
              investors. Currency and CFD markets are highly volatile. You may lose some or all
              of your invested capital, and in certain circumstances you may lose more than your
              initial investment.
            </p>
          ),
        },
        {
          title: "The ATC Bot Is a Tool, Not Financial Advice",
          content: (
            <p>
              The ATC Bot is automated trading software. It does not constitute investment,
              financial, legal, or tax advice. You are solely responsible for your trading
              decisions, account settings, and risk parameters.
            </p>
          ),
        },
        {
          title: "Past Performance",
          content: (
            <p>
              Past performance on demo or simulated accounts does not guarantee future results
              on live accounts. Any statistics, charts, or examples shown on this website are for
              illustrative purposes only and do not represent typical or guaranteed outcomes.
            </p>
          ),
        },
        {
          title: "Capital at Risk",
          content: (
            <p>
              Only trade with capital you can afford to lose. Never invest money needed for
              living expenses, debt obligations, or emergency funds. Leverage amplifies both gains
              and losses.
            </p>
          ),
        },
        {
          title: "We Do Not Manage Your Funds",
          content: (
            <p>
              Aureus Trade Capital does not hold, manage, or have access to your trading funds.
              Your money remains in your broker account at all times. We sell software only.
            </p>
          ),
        },
        {
          title: "Not a Registered Broker or Advisor",
          content: (
            <p>
              Aureus Trade Capital is not a registered broker, investment advisor, fund manager,
              or financial institution. We do not provide portfolio management or custody services.
            </p>
          ),
        },
        {
          title: "Demo & Simulated Results",
          content: (
            <p>
              Performance data, equity curves, and metrics displayed on this site are from demo
              or simulated environments unless explicitly stated otherwise. Live trading results
              may differ significantly due to spreads, slippage, latency, broker conditions, and
              market events.
            </p>
          ),
        },
        {
          title: "Contact",
          content: (
            <p>
              Questions about this disclosure? Email{" "}
              <a href={`mailto:${EMAIL}`} className="text-[var(--accent)] hover:underline">
                {EMAIL}
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
