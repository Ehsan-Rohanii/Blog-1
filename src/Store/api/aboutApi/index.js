import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aboutApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl:
      "http://localhost:5000/api",
  }),
  endpoints : (builder) => ({
    getAboutData : builder.query({
        query : (filter) => {
            const url = `?filter=${filter}`
            return {
                method : "GET" ,
                url , 
                body : filter
            }
        }
    }),
    getAboutData : builder.query({
        query : (filter) => {
            const url = `?filter=${filter}`
            return {
                method : "GET" ,
                url , 
                body : filter
            }
        }
    })
  })
});

export const { useGetAboutDataQuery } = aboutApi