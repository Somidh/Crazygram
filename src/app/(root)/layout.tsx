import Bottombar from "@/components/Bottombar";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

type SetupLayoutProp = {
  children: React.ReactNode;
};

export default function SetupLayout({ children }: SetupLayoutProp) {
  return (
    <div>
      <Navbar />
      <Sidebar />
      {children}
      <Bottombar />
    </div>
  );
}
