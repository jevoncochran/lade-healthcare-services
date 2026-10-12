import type { Metadata } from "next";

// Account pages (sign in, sign up, password reset…) are private: keep them
// out of search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const AccountLayout = ({ children }: LayoutProps<"/">) => children;

export default AccountLayout;
