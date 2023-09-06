import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface SelectorStateI {
    parameter : string,
    value : string,
}

export const selectorSlice = createSlice({
    name : 'selector',
    initialState : {
        parameter : '',
        value : '',
    },
    reducers : {
        setParameter : (state : SelectorStateI, action : PayloadAction<string>) => {
            state.parameter = action.payload;
        },
        setValue : (state : SelectorStateI, action : PayloadAction<string>) => {
            state.value = action.payload;
        }
    }
});

export default selectorSlice.reducer;
export const {setParameter, setValue} = selectorSlice.actions;