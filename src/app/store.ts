import { configureStore } from "@reduxjs/toolkit";
// import productReducer from "../features/products/productSlice";
import shoppingListReducer from "../features/shoppingList/shoppingListSlice";

export const store = configureStore({
  reducer: {
    // products: productReducer,
    shoppingList: shoppingListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
