import { RootState } from "./../../store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CardState {
  idCard: string;
  editState: boolean;
}

const initialState: CardState = {
  idCard: "null",
  editState: false,
};

export const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    chooseCard: (state, action: PayloadAction<string>) => {
      state.idCard = action.payload;
    },
    editCard: (state, action: PayloadAction<boolean>) => {
      state.editState = action.payload;
    },
  },
});

export const { chooseCard, editCard } = cardSlice.actions;

export default cardSlice.reducer;
