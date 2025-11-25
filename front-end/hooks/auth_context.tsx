import { api } from "@/lib/api"
import { RegisterRequestPayload, RegisterRequestWorkerPayload, UpdateValorRequest } from "@/models/sales/payload"
import { userFromJson } from "@/models/user/mapper"
import {
  LoginUserPayload,
  RegisterUserPayload,
  UpdateUserPayload
} from "@/models/user/payload"
import { User, UserTypeEnum, userTypeSchema } from "@/models/user/response"
import { Password } from "@/models/utils/password"
import { workerFromJson } from "@/models/worker/mapper"
import {
  RegisterWorkerPayload,
  UpdateWorkerDetailPayload
} from "@/models/worker/payload"
import {
  WorkerDetail
} from "@/models/worker/response"
import { useRouter } from "expo-router"
import * as SecureStore from "expo-secure-store"
import { jwtDecode } from "jwt-decode"
import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState
} from "react"

const TOKEN_KEY  = "my-jwt-token"
const USER_KEY   = "my-user-data"
const WORKER_KEY = "my-worker-data"

interface AuthContextType {
  user?: User
  worker?: WorkerDetail
  isLoading: boolean

  login( payload: LoginUserPayload ): Promise<boolean>

  logout( token?: string ): Promise<void>

  register( payload: RegisterUserPayload, password: Password ): Promise<boolean>

  registerWorker( payload: RegisterWorkerPayload ): Promise<boolean>

  update( payload: UpdateUserPayload ): Promise<boolean>
  updateWorker( payload: UpdateWorkerDetailPayload ): Promise<boolean>

  hasAccess( type: UserTypeEnum ): Promise<boolean>

  createRequest( payload: RegisterRequestPayload ): Promise<any>

  getRequestsCliente(status: string): Promise<any>

  getSolicitudesTrabajador(status: string): Promise<any>
  setValueStateCliente(status: string, id: number, request_id?: any): Promise<number>
  registerWorkerRequest(payload: RegisterRequestWorkerPayload): Promise<number>

  proponerValor(payload: UpdateValorRequest): Promise<boolean>

  getValueRequestClient(id :string): Promise<any>
  getRequestsWorker ( status: string ) : Promise<any>
}


const AuthContext = createContext<AuthContextType | undefined>(
  undefined )

export const AuthProvider = ( { children }: { children: ReactNode } ) => {
  const [user, setUser]           = useState<User | undefined>( undefined )
  const [worker, setWorker]       = useState<WorkerDetail | undefined>(
    undefined )
  const [token, setToken]         = useState<string | undefined>( undefined )
  const [isLoading, setIsLoading] = useState( true )
  console.log("crenado autProvider")

  const hasAccess = async ( type: UserTypeEnum ): Promise<boolean> => {
    if ( !user ) {
      return false
    }
    const parse = userTypeSchema.safeParse( type )

    if ( parse.error ) {
      return false
    }
    return parse.data >= type
  }

useEffect( () => {
  const loadAuthData = async () => {
    console.log("loadAuthData")
    try {
      const storedToken = await SecureStore.getItemAsync( TOKEN_KEY )

      if ( storedToken ) {
        const decodedToken = jwtDecode( storedToken )
        // @ts-ignore
        const expiresAt    = decodedToken.exp * 1000
        if ( expiresAt < Date.now() ) {
          console.warn( "Token expirado detectado al cargar." )
          await SecureStore.deleteItemAsync( TOKEN_KEY )
          await SecureStore.deleteItemAsync( USER_KEY )
          await SecureStore.deleteItemAsync( WORKER_KEY ) // ← Agregar esta línea
        }
        else {
          setToken( storedToken )
          api.defaults.headers.common["Authorization"] =
            `Bearer ${ storedToken }`
          console.log("storedToken storedtoken loadAuthData")
          console.log(storedToken)
          
          // Cargar usuario
          const storedUser = await SecureStore.getItemAsync( USER_KEY )
          console.log("storedUser")
          console.log(storedUser)
          if ( storedUser ) {
            const userData = JSON.parse( storedUser )
            console.log("userData")
            console.log(userData)
            setUser( userData )
            
            // Si es worker, cargar también los datos del worker
            if ( userData.user_type === UserTypeEnum.Worker ) {
              const storedWorker = await SecureStore.getItemAsync( WORKER_KEY )
              console.log("storedWorker")
              console.log(storedWorker)
              if ( storedWorker ) {
                const workerData = JSON.parse( storedWorker )
                console.log("workerData")
                console.log(workerData)
                setWorker( workerData )
                
                // Redirigir a la vista de maestro si es necesario
                if (workerData.certificates.length === 0) {
                  router.replace( "/(unregister)/(worker-register)/step2" )
                } else {
                  console.log("Redirigir a worker-tabs/index")
                  router.replace( "/(protected)/(worker-tabs)" ) // ← Agregar esta redirección
                }
              } else {

                // Si no hay datos del worker en storage, cargarlos desde la API
                try {
                  const workerResponse = await api.get( "/worker", {
                      params: {
                        ID: userData.id,
                        limit: 1,
                        preload: "Certificates"
                      }
                    } )
                  const workerData = workerResponse.data.data[0]
                  console.log("workerData get worker data")
                  console.log(workerData)
                  if ( workerData ) {
                    await SecureStore.setItemAsync( WORKER_KEY,
                      JSON.stringify( workerData ) )
                    setWorker( workerData )
                    
                    if (workerData.certificates.length === 0) {
                      router.replace( "/(unregister)/(worker-register)/step2" )
                    } else {
                      router.replace( "/(protected)/(worker-tabs)" ) // ← Agregar esta redirección
                    }
                  }
                } catch (error) {
                  console.error("Error cargando datos del worker:", error)
                }
              }
            } else {
              // Si es cliente, redirigir a vista de cliente
              router.replace( "/(protected)/(client-tabs)" ) // ← Agregar esta redirección
            }
          }
        }
      }
    }
    catch ( e ) {
      console.error( "Error cargando auth data:", e )
      await SecureStore.deleteItemAsync( TOKEN_KEY )
      await SecureStore.deleteItemAsync( USER_KEY )
      await SecureStore.deleteItemAsync( WORKER_KEY ) // ← Agregar esta línea
    }
    finally {
      setIsLoading( false )
    }
  }

  loadAuthData()
}, [] )
  const router = useRouter()
  const login = async ( payload: LoginUserPayload ) => {
    try {
      const response                               = await api.post(
        "/user/login", payload )
      console.log("login respuesta backend response.data.data")
      console.log(response.data.data)
      const { token: newToken, user: user }    = response.data.data
      api.defaults.headers.common["Authorization"] = `Bearer ${ newToken }`
      await SecureStore.setItemAsync( TOKEN_KEY, newToken )
      const userData = userFromJson(user)
      await SecureStore.setItemAsync( USER_KEY, JSON.stringify( userData ) )
      setToken( newToken )
      setUser( userData )
      //TODO Revisar que el login funcione con worker
      console.log("userData")
      console.log(userData)
      if ( userData.user_type === UserTypeEnum.Worker ) {
        const workerResponse = await api.get( "/worker", {
          params: {
            id: userData.id,
            limit: 1,
            preload: "Certificates"
          }
        } )
        const workerData     = workerResponse.data.data[0]
        console.log("workerData del login")
        console.log(workerData)
        if ( !workerData ) {
          return false
        }
        await SecureStore.setItemAsync( WORKER_KEY,
          JSON.stringify( workerData ) )
        if(workerData.certificates.length === 0){
          router.replace( "/(unregister)/(worker-register)/step2" )
        }
        console.log("moviendose a /(protected)/(worker-tabs) ")
        router.replace( "/(protected)/(worker-tabs)" )
      }else{
        router.replace( "/(protected)/(client-tabs)")
      }

      return true
    }
    catch ( e ) {
      console.error( "Error en signIn:", e )
      return false
    }
  }

  const logout = async () => {
    console.log( "Cerrando sesión..." )
    await SecureStore.deleteItemAsync( TOKEN_KEY )
    await SecureStore.deleteItemAsync( USER_KEY )
    await SecureStore.deleteItemAsync(WORKER_KEY);
    setToken( undefined )
    setUser( undefined )
    delete api.defaults.headers.common["Authorization"]
  }

  const update = async ( payload: UpdateUserPayload ) => {
    try {
      const response = await api.put( "/user/update", payload )
      const userData = userFromJson(response.data.data)
      await SecureStore.setItemAsync( USER_KEY, JSON.stringify( userData ) )
      setUser( userData )
      return true
    }
    catch ( e ) {
      console.error( "Error en update:", e )
      return false
    }
  }
  const proponerValor = async ( payload: UpdateValorRequest ) => {
    try {
      console.log(" funcion auth payload")
      console.log(payload)
      const response = await api.post( "/sale/request-value-proposed", payload )
      return await response.data.data
    }
    catch ( e ) {
      console.error( "Error en update:", e )
      return false
    }
  }

  const createRequest = async ( pre_payload: RegisterRequestPayload ) => {
    try {
      const payload = {
      is_public: Boolean(pre_payload.is_public),
      title: String(pre_payload.title),
      description: String(pre_payload.description),
      speciality_id: Number(pre_payload.speciality_id), // ← Convertir a número
      value: Number(pre_payload.value),
      ends_at: new Date(pre_payload.ends_at).toISOString(),
      status: pre_payload.status,
      location: String(pre_payload.location),
      location_text: String(pre_payload.location_text),
      images: pre_payload.images || [],
      notes: pre_payload.notes || []
    }
      const response = await api.post( "/sale/request", payload )

      return await response.data.data
    }
    catch ( e ) {
      console.error( "Error en update:", e )
      return false
    }
  }

    const registerWorkerRequest = async ( payload: RegisterRequestWorkerPayload ) => {
    try {
      console.log("payload de registerWorkerRequest")
      console.log(payload)
      const response = await api.post( "/sale/request-accepted", payload )
      const status = response.status
      return status
    }
    catch ( e ) {
      console.error( "Error en registerWorkerRequest:", e )
      return 0
    }
  }
  

  const getRequestsCliente = async ( status: string ) => {
    console.log("status")
    console.log(status)
    const response = await api.get( "/sale/request-cliente", {
      params: {"status": status, "preload": "Speciality, Images"}
    })
    return await response.data.data
  }

  const getRequestsWorker = async ( status: string ) => {
    const response = await api.get( "/sale/worker", {
      params: {"status": status, "preload": "WorkerDetail, Request"}
    })
    return await response.data.data
  }

  const getValueRequestClient = async ( id: string ) => {
    const response = await api.get( "/sale/request-value-proposed", {
      params: {"id": id, "preload": "Request, WorkerDetail", "status": "activo"}
    })
    return await response.data.data
  }

  const getSolicitudesTrabajador = async (status: string) => {
    const response = await api.get( "/sale/request-trabajador", {
      params: {"status": status, "preload": "Speciality, Images",
        order: "ASC"
      }
    })
    return await response.data.data
  }

  const setValueStateCliente = async (status: string, id: number, request_id?: any) => {
    try{
    console.log("status dentro del llamado api")
    console.log(status)
    const params: any = {
      "status": status,
      "id": id
    }
    
    // Agregar request_id solo si existe
    if (request_id !== undefined && request_id !== null) {
      params["request_id"] = request_id
    }
    
    const response = await api.put("/sale/request-value-proposed", null, {
      params: params
    })
    const statusCode = response.status
    return statusCode
    } catch (e) {
      console.log(e)
      return 0
    }
  }

  const updateWorker = async ( payload: UpdateWorkerDetailPayload ) => {
    try {
      const response = await api.put( "/worker", payload )
      const worker   = workerFromJson(response.data.data)
      await SecureStore.setItemAsync( WORKER_KEY, JSON.stringify( worker ) )
      setWorker( worker )
      return true
    }
    catch ( e ) {
      console.error( "Error en update worker:", e )
      return false
    }
  }


  const registerWorker = async ( payload: RegisterWorkerPayload ) => {
    let response
    try {
      const fullUrl = `${api.defaults.baseURL}/worker`
      console.log('URL completa:', fullUrl)
      response = await api.post( "/worker", payload )
      
      const worker   = workerFromJson(response.data.data)
      await SecureStore.setItemAsync( WORKER_KEY, JSON.stringify( worker ) )
      setWorker( worker )
      return true
    }
    catch ( e ) {
      console.log(response?.status)
      console.error( "Error en register:", e )
      return false
    }
  }


  const register = async ( payload: RegisterUserPayload,
    password: Password ) => {
    try {
      console.log(payload)
      const response                               = await api.post(
        "/user/register", {
          ...payload,
          password
        } )
      const { token: newToken, user }    = response.data.data
      const userData = userFromJson(user)
      api.defaults.headers.common["Authorization"] = `Bearer ${ newToken }`
      await SecureStore.setItemAsync( TOKEN_KEY, newToken )
      await SecureStore.setItemAsync( USER_KEY, JSON.stringify( userData ) )
      setToken( newToken )
      setUser( userData )
      return true
    }
    catch ( e ) {
      console.error( "Error en register:", e )
      return false
    }
  }
  return (
    <AuthContext.Provider value={
      {
        user,
        worker,
        registerWorker,
        updateWorker,
        isLoading,
        login,
        logout,
        update,
        register,
        hasAccess,
        createRequest,
        getRequestsCliente,
        getSolicitudesTrabajador,
        proponerValor,
        getValueRequestClient,
        setValueStateCliente,
        registerWorkerRequest,
        getRequestsWorker
      }
    }>
      { children }
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext( AuthContext )
  if ( !context ) {
    throw new Error( "useAuthContext must be used within a AuthProvider" )
  }
  return context
}