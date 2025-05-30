import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ShoppingItem, ShoppingListState } from "@/types/shoppingTypes";

// type ShoppingItem = {
//   id: string;
//   name: string;
//   quantity: number;
// };

// type ShoppingListState = {
//   items: ShoppingItem[];
//   loading: boolean;
//   error: string | null;
// };

const initialState: ShoppingListState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchShoppingList = createAsyncThunk<ShoppingItem[]>(
  "shoppingList/fetch",
  async () => {
    const response = await axios.get<ShoppingItem[]>(
      "http://localhost:8000/api/shopping-list"
    );
    return response.data;
  }
);

export const addItem = createAsyncThunk<ShoppingItem, { name: string }>(
  "shoppingList/add",
  async (item) => {
    const response = await axios.post<ShoppingItem>(
      "http://localhost:8000/api/shopping-list",
      item
    );
    return response.data;
  }
);

const shoppingListSlice = createSlice({
  name: "shoppingList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShoppingList.pending, (state) => {
        state.loading = true;
        // state.error = null;
      })
      .addCase(fetchShoppingList.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchShoppingList.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to fetch shopping list";
        state.loading = false;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default shoppingListSlice.reducer;
