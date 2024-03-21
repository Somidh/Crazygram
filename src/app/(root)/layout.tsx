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
      <div className="px-4 max-w-md mx-auto">{children}</div>
      <Bottombar />
    </div>
  );
}
