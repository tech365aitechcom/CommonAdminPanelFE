import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Core: "C1",
  Cosmetics: "A1",
  Display: "D1",
  Functional_major: "F1.1",
  Functional_minor: "F2.1",
  Warranty: "W1",
  Accessories: "A1.1",
  Functional: "F",
  Physical: "A1",
  MobileID: "",
  storage: "",
  ram: "",
};

const optionsSlice = createSlice({
  name: "adminAnswer",
  initialState,
  reducers: {
    setSelectedOptions: (state, action) => {
      const { id, value } = action.payload;
      state[id] = value;
    },
    setMobileID: (state, action) => {
      state.MobileID = action.payload;
    },
    setStorage: (state, action) => {
      state.storage = action.payload;
    },
    setRam: (state, action) => {
      state.ram = action.payload;
    },
  },
});

export const { setSelectedOptions, setMobileID, setStorage, setRam } =
  optionsSlice.actions;

export default optionsSlice.reducer;
