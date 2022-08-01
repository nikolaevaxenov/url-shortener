import { RootState } from "./../../store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CardState {
  idCard: string;
}

const initialState: CardState = {
  idCard: "null",
};

export const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    chooseCard: (state, action: PayloadAction<string>) => {
      state.idCard = action.payload;
    },
  },
});

export const { chooseCard } = cardSlice.actions;

export default cardSlice.reducer;
