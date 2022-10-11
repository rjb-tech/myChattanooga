import mainSlice from "./slices/mainSlice";
import { statsApi } from "./services/statsService";
import { articlesApi } from "./services/articlesService";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

export default configureStore({
  reducer: {
    main: mainSlice,
    [articlesApi.reducerPath]: articlesApi.reducer,
    [statsApi.reducerPath]: statsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(articlesApi.middleware)
      .concat(statsApi.middleware),
});
