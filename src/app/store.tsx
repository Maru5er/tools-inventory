import {configureStore} from '@reduxjs/toolkit';
import selectorReducer from '../component/selector/selectorSlice';

const store = configureStore({
    reducer: {
        selector : selectorReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;