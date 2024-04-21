import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";
import getCurrentUsers from "@/app/actions/getCurrentUser";

async function Sidebar({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUsers();
  return (
    <div className="h-full bg-neutral-900">
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
      <main className="lg:pl-20 h-full">{children}</main>
    </div>
  );
}

export default Sidebar;
