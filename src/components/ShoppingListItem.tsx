import { ShoppingItem } from "@/types/shoppingTypes";

// type Props = {
//   name: string;
// };

export default function ShoppingListItem({ name }: ShoppingItem) {
  return <li className="p-2 bg-gray-100 rounded">{name}</li>;
}
