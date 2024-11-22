"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

const MobileNav = ({ user }: MobileNavProps) => {
  const pathname = usePathname();

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white">
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-1 px-4"
          >
            <Image src="/icons/logo.svg" width={34} height={34} alt="logo" />
            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
              Horizon
            </h1>
          </Link>
          <div className="mobile-nav">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                {sidebarLinks.map(({ label, icon, route }) => {
                  const isActive =
                    pathname === route || pathname.startsWith(`${route}/`);

                  return (
                    <SheetClose asChild key={route}>
                      <Link
                        href={route}
                        key={label}
                        className={cn("mobile-nav-link w-full", {
                          "active-nav-link": isActive,
                        })}
                      >
                        <Image src={icon} alt={label} width={20} height={20} />
                        <span className={"text-16 font-semibold text-black-2"}>
                          {label}
                        </span>
                      </Link>
                    </SheetClose>
                  );
                })}
                USER
              </nav>
            </SheetClose>

            <Footer user={user} type="mobile" />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
