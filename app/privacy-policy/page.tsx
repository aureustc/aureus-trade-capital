import { LegalPageShell } from "@/components/LegalPageShell";

const EMAIL = "aureustradecapital@gmail.com";

export const metadata = {
  title: "Privacy Policy | Aureus Trade Capital",
  description: "How Aureus Trade Capital collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      subtitle="Last updated: May 2026"
      sections={[
        {
          title: "Information We Collect",
          content: (
            <>
              <p>
                When you purchase a license, contact support, or subscribe to updates, we may
                collect your name, email address, phone number (if provided), payment reference
                details, and any information you include in support messages.
              </p>
              <p>
                We also collect basic technical data such as browser type, device information,
                and pages visited to improve site performance and security.
              </p>
            </>
          ),
        },
        {
          title: "How We Use It",
          content: (
            <>
              <p>We use your information to:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Deliver your ATC Bot license and setup materials</li>
                <li>Process and verify payments</li>
                <li>Respond to support requests</li>
                <li>Send product updates related to your purchase</li>
                <li>Improve our website and services</li>
              </ul>
              <p>We do not sell your personal data to third parties.</p>
            </>
          ),
        },
        {
          title: "Data Storage",
          content: (
            <p>
              License and order records are stored securely on our systems. Payment card and
              UPI details are processed by Razorpay and are not stored on our servers. We retain
              order data as required for license delivery, support, and legal compliance.
            </p>
          ),
        },
        {
          title: "Third-Party Services (Clerk, Supabase & Razorpay)",
          content: (
            <p>
              We use Clerk for authentication, Supabase for secure license and support ticket
              storage, and Razorpay for payment processing. These providers handle data according
              to their own privacy policies. We receive only the information needed to manage your
              account, license, and orders.
            </p>
          ),
        },
        {
          title: "Your Rights",
          content: (
            <>
              <p>You may request to:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Access the personal data we hold about you</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of data where legally permitted</li>
                <li>Opt out of non-essential marketing emails</li>
              </ul>
            </>
          ),
        },
        {
          title: "Contact Us",
          content: (
            <p>
              For privacy-related questions, email{" "}
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
