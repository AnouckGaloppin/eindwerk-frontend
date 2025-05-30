import { NavItem } from "@/app/layout";
import { Heart, House, Search, ShoppingCart, User } from "lucide-react";

const Footer = () => {
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

      <NavItem label="Profiel" href="/dashboard">
        <User />
      </NavItem>
    </footer>
  );
};
export default Footer;
