import { api }            from "@/lib/api"
import { Comuna, Region } from "@/models/location/response"
import { Speciality }     from "@/models/worker/response"

export const specialitiesOption = {
  queryKey: ["specialities"],
  queryFn : async () => {
    const response = await api.get('/worker/specialities')
    if ( response.status !== 200 ) {
      throw new Error( "Error fetching regions" )
    }
    return await response.data.data as Speciality[]
  }
}


export const regionsOption = {
  queryKey: ["regions"],
  queryFn : async () => {
    const response = await api.get('/location/regions')
    if ( response.status !== 200 ) {
      throw new Error( "Error fetching regions" )
    }
    return await response.data.data as Region[]
  }
}

export const comunasOption = {
  queryKey: ["comunas"],
  queryFn : async () => {
    const response = await api.get('/location/comunas')
    if ( response.status !== 200 ) {
      throw new Error( "Error fetching comunas" )
    }
    return await response.data.data as Comuna[]
  }
}