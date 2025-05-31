"use client";

import { NavItem } from "@/app/layout";
import { Heart, House, Search, ShoppingCart, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-gray-500 p-4 flex justify-around border-t">
      <NavItem label="Home" href="/">
        <House />
      </NavItem>

      <NavItem label="Zoek" href="#">
        <Search />
      </NavItem>

      <NavItem label="Boodschappenlijst" href="/shoppinglist">
        <ShoppingCart />
      </NavItem>

      <NavItem label="Favorieten" href="/favourites">
        <Heart />
      </NavItem>

      <NavItem
        label={user ? "Profiel" : "Login"}
        href={user ? "/profile" : "/login"}
      >
        <User />
      </NavItem>
    </footer>
  );
};
export default Footer;
