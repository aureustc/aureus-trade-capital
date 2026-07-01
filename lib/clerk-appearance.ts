/** Compact appearance for UserButton in the navbar */
export const clerkNavbarAppearance = {
  variables: {
    colorPrimary: "#dbb94a",
    colorText: "#f5f3ef",
    colorBackground: "#1c222d",
  },
  elements: {
    avatarBox: "h-8 w-8 border border-[rgba(219,185,74,0.4)]",
    userButtonPopoverCard: "bg-[#1c222d] border border-[rgba(219,185,74,0.22)]",
    userButtonPopoverActionButton: "text-[#f5f3ef] hover:bg-[rgba(219,185,74,0.1)]",
    userButtonPopoverActionButtonText: "text-[#f5f3ef]",
    userButtonPopoverFooter: "hidden",
  },
} as const;

/**
 * Clerk variables for SignIn / SignUp — always pair with app/clerk-auth.css
 * (Tailwind in elements is unreliable inside Clerk components).
 */
export const clerkAuthAppearance = {
  layout: {
    logoPlacement: "inside" as const,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorPrimary: "#dbb94a",
    colorDanger: "#f87171",
    colorSuccess: "#86efac",
    colorWarning: "#fbbf24",
    colorBackground: "#1c222d",
    colorInputBackground: "#161b24",
    colorInputText: "#f5f3ef",
    colorText: "#f5f3ef",
    colorTextSecondary: "#c4bfb8",
    colorTextOnPrimaryBackground: "#0f1218",
    colorNeutral: "#a8a29e",
    borderRadius: "0.75rem",
    fontFamily: "inherit",
    fontSize: "0.9375rem",
  },
  elements: {
    rootBox: "w-full max-w-md mx-auto",
    card: "shadow-none",
    headerTitle: "!text-[#f5f3ef]",
    headerSubtitle: "!text-[#c4bfb8]",
    socialButtonsBlockButton: "!text-[#f5f3ef]",
    socialButtonsBlockButtonText: "!text-[#f5f3ef]",
    dividerText: "!text-[#c4bfb8]",
    formFieldLabel: "!text-[#c4bfb8]",
    formFieldInput: "!text-[#f5f3ef]",
    formButtonPrimary: "!text-[#0f1218] !font-semibold",
    footerActionText: "!text-[#c4bfb8]",
    footerActionLink: "!text-[#dbb94a] !font-semibold",
    identityPreviewText: "!text-[#f5f3ef]",
    identityPreviewEditButton: "!text-[#dbb94a]",
    formFieldErrorText: "!text-[#f87171]",
    alertText: "!text-[#f5f3ef]",
    navbar: "hidden",
    navbarMobileMenuButton: "hidden",
    logoBox: "hidden",
  },
} as const;

/** @deprecated Use clerkNavbarAppearance or clerkAuthAppearance */
export const clerkAppearance = clerkNavbarAppearance;
