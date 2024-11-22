import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const currentUser = { firstName: "Zeeshan", lastName: "Asghar" };
  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={currentUser} />
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" alt="logo" width={30} height={30} />
          <div>
            <MobileNav user={currentUser} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}

export default Layout;
