import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState
}                                             from "react"
import { User, UserTypeEnum, userTypeSchema } from "@/models/user/response"
import {
  LoginUserPayload,
  RegisterUserPayload,
  UpdateUserPayload
}                                             from "@/models/user/payload"
import { Password }                           from "@/models/utils/password"
import * as SecureStore                       from "expo-secure-store"
import { jwtDecode }                          from "jwt-decode"
import { api }                                              from "@/lib/api"
import {
  RegisterWorkerPayload,
  UpdateWorkerDetailPayload
} from "@/models/worker/payload"
import {
  WorkerDetail
}                                                           from "@/models/worker/response"
import { useRouter }    from "expo-router"
import { userFromJson } from "@/models/user/mapper"
import { workerFromJson }                     from "@/models/worker/mapper"

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
}


const AuthContext = createContext<AuthContextType | undefined>(
  undefined )

export const AuthProvider = ( { children }: { children: ReactNode } ) => {
  const [user, setUser]           = useState<User | undefined>( undefined )
  const [worker, setWorker]       = useState<WorkerDetail | undefined>(
    undefined )
  const [token, setToken]         = useState<string | undefined>( undefined )
  const [isLoading, setIsLoading] = useState( true )

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
          }
          else {
            setToken( storedToken )
            api.defaults.headers.common["Authorization"] =
              `Bearer ${ storedToken }`
            const storedUser                             = await SecureStore.getItemAsync(
              USER_KEY )
            if ( storedUser ) {
              setUser( JSON.parse( storedUser ) )
            }
          }
        }
      }
      catch ( e ) {
        console.error( "Error cargando auth data:", e )
        await SecureStore.deleteItemAsync( TOKEN_KEY )
        await SecureStore.deleteItemAsync( USER_KEY )
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
      const { token: newToken, user: user }    = response.data
      api.defaults.headers.common["Authorization"] = `Bearer ${ newToken }`
      await SecureStore.setItemAsync( TOKEN_KEY, newToken )
      const userData = userFromJson(user)
      await SecureStore.setItemAsync( USER_KEY, JSON.stringify( userData ) )
      setToken( newToken )
      setUser( userData )
      if ( userData.user_type === UserTypeEnum.Worker ) {
        const workerResponse = await api.get( "/worker", {
          params: {
            user_id: userData.id
          }
        } )
        const workerData     = workerResponse.data.data[0]
        if ( !workerData ) {
          return false
        }
        await SecureStore.setItemAsync( WORKER_KEY,
          JSON.stringify( workerData ) )
        if(workerData.certificates.length === 0){
          router.replace( "/(unregister)/(worker-register)/step2" )
        }
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
    delete api.defaults.headers.common["Authorization"]
    await SecureStore.deleteItemAsync( TOKEN_KEY )
    await SecureStore.deleteItemAsync( USER_KEY )
    setToken( undefined )
    setUser( undefined )
  }

  const update = async ( payload: UpdateUserPayload ) => {
    try {
      const response = await api.put( "/user/update", payload )
      const userData = userFromJson(response.data)
      await SecureStore.setItemAsync( USER_KEY, JSON.stringify( userData ) )
      setUser( userData )
      return true
    }
    catch ( e ) {
      console.error( "Error en update:", e )
      return false
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
    try {
      const response = await api.post( "/worker", payload )
      const worker   = workerFromJson(response.data.data)
      await SecureStore.setItemAsync( WORKER_KEY, JSON.stringify( worker ) )
      setWorker( worker )
      return true
    }
    catch ( e ) {
      console.error( "Error en register:", e )
      return false
    }
  }


  const register = async ( payload: RegisterUserPayload,
    password: Password ) => {
    try {
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
        hasAccess
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