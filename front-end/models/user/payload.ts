import { userTypeSchema } from "@/models/user/response"
import { passwordSchema } from "@/models/utils/password"
import { format, validate } from "rut.js"
import { z } from "zod"

export const registerUserSchema = z.object( {
  full_name    : z.string( {
    message: "El nombre es obligatorio"
  } ),
  phone        : z.string( {
    message: "El número de teléfono es obligatorio"
  } ).min( 8, {
    message: "El número de teléfono es muy corto"
  } ).max( 15, {
    message: "El número de teléfono es muy largo"
  } ),
  email        : z.email( {
    message: "El correo electrónico no es válido"
  } ),
  user_type    : userTypeSchema,
  bank_identity: z.string({
    message: "Rut es obligatorio"
  }).refine( text => {
    return validate( text )
  }, {
    message: "El RUT no es válido"
  } ).transform( text => {
    return format( text, { dots: false } )
  } ),
  calle        : z.string({
    message: "La calle es obligatoria"
  }),
  comuna       : z.string({
    message: "La comuna es obligatoria"
  }),
  region       : z.string({
    message: "La región es obligatoria"
  }),
  date_birth   : z.iso.datetime({
    message: "La fecha de nacimiento es obligatoria"
  })
} )

export type RegisterUserPayload = z.infer<typeof registerUserSchema>

export const loginUserSchema = z.object( {
  email   : z.email( {
    message: "El correo electrónico no es válido"
  } ),
  password: passwordSchema
} )

export type LoginUserPayload = z.infer<typeof loginUserSchema>


export const updateUserSchema = z.object( {
  email         : z.string().nullish(),
  password      : z.string().nullish(),
  calle         : z.string().nullish(),
  comuna        : z.string().nullish(),
  house_type    : z.string().nullish(),
  services_types: z.array( z.string() ).nullish(),
  bank_identity : z.string().nullish(),
  bank_number   : z.string().nullish(),
  date_birth    : z.iso.datetime().nullish(),
  phone         : z.string().nullish()
} )

export type UpdateUserPayload = z.infer<typeof updateUserSchema>
