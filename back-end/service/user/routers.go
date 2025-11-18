package user

import (
	"fmt"
	"net/http"
	"time"

	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/service/middleware"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/usermodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/utils"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/utils/customserros"
	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
)

type Handler struct {
	service usermodel.UserService
}

func NewHandler(service usermodel.UserService) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterRouter(router *mux.Router, middleware *middleware.MiddleWare) {
	router.HandleFunc("/logout", h.logout).Methods("POST")
	router.HandleFunc("/login", h.login).Methods("POST")
	router.HandleFunc("/", h.user).Methods("GET")
	router.HandleFunc("/register", h.handlerRegister).Methods("POST")

	protectedRoutes := router.PathPrefix("").Subrouter()
	protectedRoutes.Use(middleware.JWTMiddleware)
	protectedRoutes.HandleFunc("/update", h.UpdateUserByEmail).Methods("PUT")
}

func (h *Handler) handlerRegister(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()
	var payload usermodel.RegisterUserPayload

	err := utils.ParseJSON(r, &payload)
	println("parse json", err)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	err = utils.Validate.Struct(payload)
	println("validate", err)
	if err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", errors))
		return
	}

	token, user, err := h.service.RegisterUser(ctx, &payload)
	println("service", err)

	if err != nil {
		var status int
		switch err {
		case customserros.ErrUserDontExists:
			status = http.StatusNotFound
		case customserros.ErrUserExists:
			status = http.StatusBadRequest
		default:
			status = http.StatusInternalServerError
		}
		utils.WriteError(w, status, err)
		return
	}

	utils.WriteJSON(w, http.StatusCreated,
		map[string]interface{}{
			"token": token,
			"user":  user},
	)
}

func (h *Handler) login(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()
	var payload usermodel.LoginUserPayload

	err := utils.ParseJSON(r, &payload)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	err = utils.Validate.Struct(payload)
	if err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", errors))
		return
	}

	token, user, err := h.service.Login(ctx, payload)

	if err != nil {
		var status int
		switch err {
		case customserros.ErrUserDontExists:
			status = http.StatusNotFound
		case customserros.ErrPasswordDontMatch:
			status = http.StatusUnauthorized
		default:
			status = http.StatusInternalServerError
		}
		utils.WriteError(w, status, err)
		return
	}

	// cookie := &http.Cookie{
	// 	Name:     "jwt",                                   // Nombre de la cookie
	// 	Value:    token,                                   // Token JWT
	// 	Path:     "/",                                     // Accesible en todas las rutas
	// 	Expires:  time.Now().Add(time.Hour * 24 * 30 * 6), // Misma expiración que el token
	// 	HttpOnly: true,                                    // Solo accesible por HTTP (no por JavaScript)
	// 	Secure:   false,                                   // En producción debería ser true (HTTPS)
	// 	SameSite: http.SameSiteLaxMode,                    // Protección CSRF
	// }
	// http.SetCookie(w, cookie)

	utils.WriteJSON(w, http.StatusOK,
		map[string]interface{}{
			"token": token,
			"user":  user},
	)

}

func (h *Handler) user(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	cookie, err := r.Cookie("jwt")

	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, customserros.ErrUnauthorized)
		return
	}

	user, err := h.service.GetUserByJWT(ctx, cookie.Value)

	if err != nil {
		var status int
		switch err {
		case customserros.ErrUnauthorized:
			status = http.StatusUnauthorized
		default:
			status = http.StatusInternalServerError
		}
		utils.WriteError(w, status, err)
		return
	}

	utils.WriteJSON(w, http.StatusAccepted, user)

}

func (h *Handler) logout(w http.ResponseWriter, r *http.Request) {
	cookie := &http.Cookie{
		Name:     "jwt",                      // Nombre de la cookie
		Value:    "",                         // Token JWT
		Path:     "/",                        // Accesible en todas las rutas
		Expires:  time.Now().Add(-time.Hour), // Misma expiración que el token
		HttpOnly: true,                       // Solo accesible por HTTP (no por JavaScript)
		Secure:   false,                      // En producción debería ser true (HTTPS)
		SameSite: http.SameSiteLaxMode,       // Protección CSRF
	}

	http.SetCookie(w, cookie)

	utils.WriteJSON(w, http.StatusOK, map[string]string{
		"message": "Logout successful",
	})
}

func (h *Handler) handlerGetByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idStr := r.URL.Query().Get("id")

	if idStr == "" {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}
	filters := map[string]interface{}{
		"id": idStr,
	}
	user, err := h.service.GetUserByFilters(ctx, filters)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, user)
}

func (h *Handler) UpdateUserByEmail(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var payload usermodel.UpdateUserPayload

	err := utils.ParseJSON(r, &payload)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	err = utils.Validate.Struct(payload)
	if err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", errors))
		return
	}

	claims, ok := ctx.Value(utils.UserContextKey).(*usermodel.UserToken)
	if !ok {
		http.Error(w, "No se pudieron obtener los datos del usuario", http.StatusInternalServerError)
		return
	}

	user, err := h.service.UpdateUserByEmail(ctx, claims.Email, &payload)

	if err != nil {
		var status int
		switch err {
		case customserros.ErrUserDontExists:
			status = http.StatusBadRequest
		case customserros.ErrNoUpdateUser:
			status = http.StatusBadRequest
		default:
			status = http.StatusInternalServerError
		}
		utils.WriteError(w, status, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, user)
}
