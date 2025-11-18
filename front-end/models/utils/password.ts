import { z }                      from "zod"

export const passwordSchema = z.string( {
  message: "Debe ingresar una contraseña"
} )
                               .min( 8, {
                                 message: "La contraseña debe tener al menos 8 caracteres"
                               } )
                               .regex( RegExp( /^(?=.*[a-z]).*$/ ),
                                 {
                                   message: "La contraseña debe contener al menos una letra minúscula"
                                 } )
                               .regex( RegExp( /^(?=.*[A-Z]).*$/ ),
                                 {
                                   message: "La contraseña debe contener al menos una letra mayúscula"
                                 } )
                               .regex( RegExp( /^(?=.*\d).*$/ ),
                                 {
                                   message: "La contraseña debe contener al menos un número"
                                 } )
                               // .regex( RegExp( /^(?=.*[$@!?&]).*$/ ),
                               .regex( RegExp( /^(?=.*[^a-zA-Z0-9]).*/ ),
                                 {
                                   message: "La contraseña debe contener al menos un carácter especial"
                                 } )

export type Password = z.infer<typeof passwordSchema>
