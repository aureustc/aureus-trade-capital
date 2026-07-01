import { LegalPageShell } from "@/components/LegalPageShell";

const EMAIL = "aureustradecapital@gmail.com";

export const metadata = {
  title: "Refund Policy | Aureus Trade Capital",
  description: "Refund terms for ATC Bot license purchases.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPageShell
      title="Refund Policy"
      subtitle="Last updated: May 2026"
      sections={[
        {
          title: "Digital Product — No Refunds After Delivery",
          content: (
            <p>
              The ATC Bot is a digital software license delivered via email. Once your license
              key and setup guide have been sent to your registered email address, the sale is
              complete and no refunds will be issued. This is standard practice for downloadable
              and digitally delivered software products.
            </p>
          ),
        },
        {
          title: "Non-Delivery Exception",
          content: (
            <p>
              If your bot license is not delivered within 24 hours of confirmed payment (and you
              have contacted us with your payment proof), you are entitled to a full refund.
              Refunds in this case are processed within 5–7 business days to the original
              payment method where possible.
            </p>
          ),
        },
        {
          title: "Manual Payment Disputes",
          content: (
            <p>
              For UPI or bank transfer payments, email your payment screenshot and order details
              to{" "}
              <a href={`mailto:${EMAIL}`} className="text-[var(--accent)] hover:underline">
                {EMAIL}
              </a>
              . If we cannot verify your payment or deliver your license, a full refund will be
              issued.
            </p>
          ),
        },
        {
          title: "Contact for Disputes",
          content: (
            <p>
              For refund requests or payment disputes, contact{" "}
              <a href={`mailto:${EMAIL}`} className="text-[var(--accent)] hover:underline">
                {EMAIL}
              </a>{" "}
              with your name, email, payment reference, and purchase date. We aim to respond
              within 24–48 hours.
            </p>
          ),
        },
      ]}
    />
  );
}
