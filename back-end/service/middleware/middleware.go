package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/usermodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/utils"
)

type MiddleWare struct {
	userService usermodel.UserService
}

func NewMiddleWare(userService usermodel.UserService) *MiddleWare {
	return &MiddleWare{userService: userService}
}

func (m *MiddleWare) JWTMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Extraer el token de la cabecera "Authorization"
		ctx := r.Context()
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Token no encontrado", http.StatusUnauthorized)
			return
		}

		// El token debe estar en el formato "Bearer <token>"
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			http.Error(w, "Formato de token inválido", http.StatusUnauthorized)
			return
		}

		// Verificar y obtener las claims
		tokenString := tokenParts[1]
		claims, err := m.userService.VerifyJWT(ctx, tokenString)
		if err != nil {
			http.Error(w, "Token inválido: "+err.Error(), http.StatusUnauthorized)
			return
		}

		ctx = context.WithValue(r.Context(), utils.UserContextKey, claims)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
