import {configureStore} from '@reduxjs/toolkit';
import selectorReducer from '../component/selector/selectorSlice';
import userReducer from '../component/userAuth/userSlice';

const store = configureStore({
    reducer: {
        selector : selectorReducer,
        user : userReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;