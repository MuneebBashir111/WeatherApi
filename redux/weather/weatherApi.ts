import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type Weather = {};

export const weatherApi = createApi({
  reducerPath: "weatherApi",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: " https://api.openweathermap.org/data/2.5/",
  }),
  endpoints: (builder) => ({
    getWeather: builder.query<Weather, { city: any }>({
      query: (city: any) =>
        `weather?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.NEXT_PUBLIC_API_KEY}&exclude=minutely&units=metric`,
    }),
  }),
});

export const { useLazyGetWeatherQuery } = weatherApi;
