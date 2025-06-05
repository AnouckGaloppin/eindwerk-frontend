"use client";

import { NavItem } from "@/app/layout";
import { Heart, House, Search, ShoppingCart, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const Footer = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: House },
    { label: "Zoek", href: "/search", icon: Search },
    { label: "Boodschappenlijst", href: "/shoppinglist", icon: ShoppingCart },
    { label: "Favorieten", href: "/favourites", icon: Heart },
    {
      label: user ? "Profiel" : "Login",
      href: user ? "/profile" : "/login",
      icon: User,
    },
  ];

  return (
    <footer className="fixed bottom-0 w-full z-50 bg-gradient-to-r from-indigo-500 to-teal-500 text-white">
      <nav className="max-w-screen-sm mx-auto flex justify-between items-center px-4 py-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <NavItem
              key={label}
              label={label}
              href={href}
              className={clsx(
                "flex flex-col items-center text-xs transition-all px-3 py-2 rounded-xl",
                isActive
                  ? "bg-teal-400 text-black shadow-md scale-110 ring-2 ring-teal-300"
                  : "hover:bg-white/20 text-white/80 hover:text-white hover:scale-102"
              )}
            >
              <Icon
                className={clsx(
                  "w-6 h-6 mb-1 transition-transform",
                  isActive && "scale-115 drop-shadow-sm"
                )}
              />
            </NavItem>
          );
        })}
      </nav>
    </footer>
  );
};

export default Footer;

// {
/* <NavItem
        label="Home"
        href="/"
        className="flex flex-col items-center text-sm hover:text-white/80 transition"
      >
        <House className="w-6 h-6 mb-1" />
      </NavItem>

      <NavItem
        label="Zoek"
        href="#"
        className="flex flex-col items-center text-sm hover:text-white/80 transition"
      >
        <Search className="w-6 h-6 mb-1" />
      </NavItem>

      <NavItem
        label="Boodschappenlijst"
        href="/shoppinglist"
        className="flex flex-col items-center text-sm hover:text-white/80 transition"
      >
        <ShoppingCart className="w-6 h-6 mb-1" />
      </NavItem>

      <NavItem
        label="Favorieten"
        href="/favourites"
        className="flex flex-col items-center text-sm hover:text-white/80 transition"
      >
        <Heart className="w-6 h-6 mb-1" />
      </NavItem>

      <NavItem
        label={user ? "Profiel" : "Login"}
        href={user ? "/profile" : "/login"}
        className="flex flex-col items-center text-sm hover:text-white/80 transition"
      >
        <User className="w-6 h-6 mb-1" />
      </NavItem> */
// }
//     </footer>
//   );
// };
// export default Footer;
