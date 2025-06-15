import api from "@/lib/axios"; // Importeer de geconfigureerde Axios-instantie
// import { info } from "console";

export const compareProductPrices = async (productId: string) => {
  try {
    const response = await api.get(`/products/${productId}/compare`);
    return response.data;
  } catch (error) {
    console.error("Fout bij ophalen prijsvergelijking:", error);
    return null;
  }
};

export const compareShoppingList = async (productIds: string[]) => {
  console.log("Sending request with productIds:", productIds);
  try {
    const response = await api.post("/api/shopping-list/compare", {
      product_ids: productIds,
    });
    return response.data;
  } catch (error) {
    console.error("Fout bij ophalen boodschappenlijst vergelijking:", error);
    return null;
  }
};
