import mainSlice from "./slices/mainSlice";
import weatherSlice from "./slices/weatherSlice";
import { statsApi } from "./services/statsService";
import { weatherApi } from "./services/weatherService";
import { articlesApi } from "./services/articlesService";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

export default configureStore({
  reducer: {
    main: mainSlice,
    weather: weatherSlice,
    [statsApi.reducerPath]: statsApi.reducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
    [articlesApi.reducerPath]: articlesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(articlesApi.middleware)
      .concat(weatherApi.middleware)
      .concat(statsApi.middleware),
});
