package worker

import (
	"fmt"
	"net/http"

	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/service/middleware"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/usermodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/workermodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/utils"
	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
)

type Handler struct {
	service workermodel.WorkerService
}

func NewHandler(service workermodel.WorkerService) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterRouter(router *mux.Router, middleware *middleware.MiddleWare) {
	router.HandleFunc("/specialities", h.handlerGetSpecialitiesByFilters).Methods("GET")
	// router.HandleFunc("/", h.handlerUpdateWorker).Methods("PUT")
	// router.HandleFunc("/", h.handlerCreateWorker).Methods("POST")
	protectedRoutes := router.PathPrefix("").Subrouter()
	protectedRoutes.Use(middleware.JWTMiddleware)
	protectedRoutes.HandleFunc("/", h.handlerGetWorkerByFilters).Methods("GET")
	protectedRoutes.HandleFunc("/", h.handlerUpdateWorker).Methods("PUT")
	protectedRoutes.HandleFunc("/", h.handlerCreateWorker).Methods("POST")
}

func (h *Handler) handlerCreateWorker(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var payload workermodel.RegisterWorkerPayload

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

	claims, ok := ctx.Value(utils.UserContextKey).(*usermodel.UserToken)
	println("claims", ok)
	if !ok {
		http.Error(w, "No se pudieron obtener los datos del usuario", http.StatusInternalServerError)
		return
	}

	id, err := utils.StringToUint(claims.Subject)
	println("id", id, err)

	if err != nil {
		http.Error(w, "No se pudieron obtener los datos del usuario", http.StatusInternalServerError)
		return
	}

	worker, err := h.service.CreateWorker(ctx, id, &payload)
	println("create worker", err)

	if err != nil {
		var status int
		switch err {
		default:
			status = http.StatusInternalServerError
		}
		utils.WriteError(w, status, err)
		return
	}

	utils.WriteJSON(w, http.StatusCreated, worker)
}

func (h *Handler) handlerUpdateWorker(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var payload workermodel.UpdateWorkerDetailPayload

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

	claims, ok := ctx.Value(utils.UserContextKey).(*usermodel.UserToken)
	println("claims", ok)
	if !ok {
		http.Error(w, "No se pudieron obtener los datos del usuario", http.StatusInternalServerError)
		return
	}

	worker, err := h.service.UpdateWorker(ctx, claims.Subject, &payload)
	// worker, err := h.service.UpdateWorker(ctx, "21", &payload)
	println("update", err)

	if err != nil {
		var status int
		switch err {
		default:
			status = http.StatusInternalServerError
		}
		utils.WriteError(w, status, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, worker)
}
func (h *Handler) handlerGetWorkerByFilters(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	filters := utils.MapQueryToJSON(r.URL.Query())
	details, err := h.service.GetWorkerByFilters(ctx, filters)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, details)
}

func (h *Handler) handlerGetSpecialitiesByFilters(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	filters := utils.MapQueryToJSON(r.URL.Query())
	details, err := h.service.GetSpecialitiesByFilters(ctx, filters)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, details)
}
