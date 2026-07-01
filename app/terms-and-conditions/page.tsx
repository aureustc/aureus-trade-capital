import { LegalPageShell } from "@/components/LegalPageShell";

const EMAIL = "aureustradecapital@gmail.com";

export const metadata = {
  title: "Terms & Conditions | Aureus Trade Capital",
  description: "Terms governing use of the Aureus Trade Capital ATC Bot software.",
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPageShell
      title="Terms & Conditions"
      subtitle="Last updated: May 2026"
      sections={[
        {
          title: "License Terms",
          content: (
            <>
              <p>
                By purchasing the ATC Bot, you receive a non-exclusive, non-transferable
                license to use the software on MetaTrader 5 for the duration selected (3 months,
                6 months, yearly, or lifetime). The license is for personal or business use on
                accounts you own or control.
              </p>
              <p>
                You may not redistribute, resell, reverse-engineer, or sublicense the bot
                without written permission from Aureus Trade Capital.
              </p>
            </>
          ),
        },
        {
          title: "Acceptable Use",
          content: (
            <>
              <p>You agree to use the bot only on supported MT5 platforms and in compliance with:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Your broker&apos;s terms of service</li>
                <li>Applicable financial regulations in your jurisdiction</li>
                <li>Our setup and risk guidelines</li>
              </ul>
              <p>
                Misuse, unauthorized sharing of license keys, or attempts to bypass license
                validation may result in immediate license revocation without refund.
              </p>
            </>
          ),
        },
        {
          title: "No Refund Policy (After License Delivery)",
          content: (
            <p>
              The ATC Bot is a digital product. Once your license key and setup materials have
              been delivered to your email, all sales are final and no refunds will be issued.
              See our Refund Policy for exceptions related to non-delivery.
            </p>
          ),
        },
        {
          title: "Intellectual Property",
          content: (
            <p>
              All software, documentation, branding, and website content are the intellectual
              property of Aureus Trade Capital. Your purchase grants a license to use the bot,
              not ownership of the underlying code or algorithms.
            </p>
          ),
        },
        {
          title: "Limitation of Liability",
          content: (
            <>
              <p>
                Aureus Trade Capital provides trading automation software only. We are not
                responsible for trading losses, broker issues, connectivity failures, or market
                conditions. The bot does not guarantee profits.
              </p>
              <p>
                To the maximum extent permitted by law, our total liability shall not exceed the
                amount you paid for your license in the twelve months preceding any claim.
              </p>
            </>
          ),
        },
        {
          title: "Governing Law (India)",
          content: (
            <p>
              These terms are governed by the laws of India. Any disputes shall be subject to the
              exclusive jurisdiction of courts in India. For questions, contact{" "}
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
