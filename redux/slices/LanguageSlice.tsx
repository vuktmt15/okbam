import {PayloadAction, createSlice} from "@reduxjs/toolkit";

interface ILanguageState {
  language: string;
}

const initialState: ILanguageState = {
  language: "en",
};

const LanguageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
  },
});

export const {setLanguage} = LanguageSlice.actions;

export default LanguageSlice.reducer;
