import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface userI {
    username : string,
    token : string
}

export const userSlice = createSlice({
    name : 'user',
    initialState : {
        username : '',
        token : '',
    },
    reducers : {
        setUsername : (state : userI, action : PayloadAction<string>) => {
            state.username = action.payload;
        },
        setToken : (state : userI, action : PayloadAction<string>) => {
            state.token = action.payload;
        }
    }
});

export default userSlice.reducer;
export const {setUsername, setToken} = userSlice.actions;