import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "@redux-saga/core";

import gameReducer from '../features/game/gameSlice';
import gameMiddleware from "./middleware";

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
    reducer: {
        game: gameReducer
    },
    middleware: [sagaMiddleware]
    // getDefaultMiddleware({
    //     serializableCheck: false,
    // }),
})

sagaMiddleware.run(gameMiddleware)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
