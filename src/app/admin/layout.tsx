import type { Metadata } from "next";

// Staff-only area: keep it out of search results.
export const metadata: Metadata = {
  title: {
    default: "Staff",
    template: "%s | Lade Staff",
  },
  robots: { index: false, follow: false },
};

const AdminLayout = ({ children }: LayoutProps<"/admin">) => children;

export default AdminLayout;
