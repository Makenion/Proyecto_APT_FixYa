package sales

import (
	"fmt"
	"net/http"

	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/service/middleware"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/salesmodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/usermodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/utils"
	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
)

type Handler struct {
	service salesmodel.SaleService
}

func NewHandler(service salesmodel.SaleService) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterRouter(router *mux.Router, middleware *middleware.MiddleWare) {
	// router.HandleFunc("/", h.user).Methods("GET")
	protectedRoutes := router.PathPrefix("").Subrouter()
	protectedRoutes.Use(middleware.JWTMiddleware)
	protectedRoutes.HandleFunc("/review", h.handlerCreateReview).Methods("POST")
	protectedRoutes.HandleFunc("/review", h.handlerGetReviewsByFilters).Methods("GET")
	protectedRoutes.HandleFunc("/request-cliente", h.handlerGetRequestsClienteByFilters).Methods("GET")
	protectedRoutes.HandleFunc("/request-trabajador", h.handlerGetRequestsTrabajadorByFilters).Methods("GET")
	protectedRoutes.HandleFunc("/request", h.handlerCreateRequest).Methods("POST")
	protectedRoutes.HandleFunc("/request", h.handlerDeleteRequest).Methods("DELETE")
	protectedRoutes.HandleFunc("/request", h.handlerUpdateRequest).Methods("PUT")
	protectedRoutes.HandleFunc("/request", h.handlerGetRequestsByFilters).Methods("GET")
	protectedRoutes.HandleFunc("/request-accepted", h.handlerCreateRequestWorker).Methods("POST")
	protectedRoutes.HandleFunc("/request-value-proposed", h.handlerCreateValorPropuesto).Methods("POST")
	protectedRoutes.HandleFunc("/request-value-proposed", h.handlerGetValueClientByFilters).Methods("GET")
	protectedRoutes.HandleFunc("/request-value-proposed", h.handlerSetStatusValueCliente).Methods("PUT")
	protectedRoutes.HandleFunc("/worker", h.handlerDeleteRequestWorker).Methods("DELETE")
	protectedRoutes.HandleFunc("/worker", h.handlerGetRequestsWorkersByFilters).Methods("GET")
	protectedRoutes.HandleFunc("/worker", h.handlerUpdateRequestWorker).Methods("PUT")
}

func (h *Handler) handlerCreateReview(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var payload salesmodel.RegisterReviewPayload

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

	_, err = h.service.CreateReview(ctx, &payload)

	if err != nil {
		var status int
		switch err {
		default:
			status = http.StatusInternalServerError
		}
		utils.WriteError(w, status, err)
		return
	}

	utils.WriteJSON(w, http.StatusCreated, nil)
}

// Patron de criteria - Criteria builder.
// Pa los filtros
func (h *Handler) handlerGetRequestsTrabajadorByFilters(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	filters := utils.MapQueryToJSON(r.URL.Query())
	requests, err := h.service.GetRequestsTrabajadorByFilters(ctx, filters)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, requests)
}

func (h *Handler) handlerGetRequestsClienteByFilters(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	filters := utils.MapQueryToJSON(r.URL.Query())
	requests, err := h.service.GetRequestsClienteByFilters(ctx, filters)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, requests)
}

func (h *Handler) handlerGetReviewsByFilters(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	filters := utils.MapQueryToJSON(r.URL.Query())
	reviews, err := h.service.GetReviewsByFilters(ctx, filters)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, reviews)
}

func (h *Handler) handlerCreateRequest(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var payload salesmodel.RegisterRequestPayload

	err := utils.ParseJSON(r, &payload)
	if err != nil {
		println("Error al parsear JSON")
		println(err.Error())
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	err = utils.Validate.Struct(payload)
	if err != nil {
		println("Error al validar la estructura")
		println(err.Error())
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", errors))
		return
	}

	claims, ok := ctx.Value(utils.UserContextKey).(*usermodel.UserToken)
	if !ok {
		http.Error(w, "No se pudieron obtener los datos del usuario", http.StatusInternalServerError)
		return
	}

	userId, err := utils.StringToUint(claims.Subject)

	if err != nil {
		http.Error(w, "No se pudieron obtener los datos del usuario", http.StatusInternalServerError)
		return
	}

	req, err := h.service.CreateRequest(ctx, userId, &payload)

	if err != nil {
		var status int
		switch err {
		default:
			status = http.StatusInternalServerError
		}
		utils.WriteError(w, status, err)
		return
	}

	utils.WriteJSON(w, http.StatusCreated, req)
}

func (h *Handler) handlerCreateRequestWorker(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var payload salesmodel.RegisterRequestWorkerPayload

	err := utils.ParseJSON(r, &payload)
	if err != nil {
		println("Error al parsear el payload")
		println(err.Error())
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	err = utils.Validate.Struct(payload)
	if err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", errors))
		return
	}

	_, err = h.service.CreateRequestWorker(ctx, &payload)

	if err != nil {
		var status int
		switch err {
		default:
			status = http.StatusInternalServerError
		}
		utils.WriteError(w, status, err)
		return
	}

	utils.WriteJSON(w, http.StatusCreated, nil)
}

func (h *Handler) handlerDeleteRequestWorker(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id, err := utils.StringToUint(r.URL.Query().Get("id"))

	if err != nil {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	err = h.service.DeleteRequestWorker(ctx, id)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, nil)
}

func (h *Handler) handlerDeleteRequest(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id, err := utils.StringToUint(r.URL.Query().Get("id"))

	if err != nil {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	err = h.service.DeleteRequest(ctx, id)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, nil)
}

func (h *Handler) handlerGetRequestsByFilters(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	filters := utils.MapQueryToJSON(r.URL.Query())
	reviews, err := h.service.GetRequestsByFilters(ctx, filters)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, reviews)
}

func (h *Handler) handlerGetRequestsWorkersByFilters(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	filters := utils.MapQueryToJSON(r.URL.Query())
	reviews, err := h.service.GetRequestsWorkersByFilters(ctx, filters)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, reviews)
}

func (h *Handler) handlerSetStatusValueCliente(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	parametros := utils.MapQueryToJSON(r.URL.Query())

	err := h.service.SetStatusValueCliente(ctx, parametros)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, nil)
}

func (h *Handler) handlerGetValueClientByFilters(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	filters := utils.MapQueryToJSON(r.URL.Query())
	reviews, err := h.service.GetValueClientByFilters(ctx, filters)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, reviews)
}

func (h *Handler) handlerUpdateRequest(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var payload salesmodel.UpdateRequestPayload

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

	request, err := h.service.UpdateRequest(ctx, claims.Subject, &payload)

	if err != nil {
		var status int
		switch err {
		default:
			status = http.StatusInternalServerError
		}
		utils.WriteError(w, status, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, request)
}

func (h *Handler) handlerUpdateRequestWorker(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var payload salesmodel.UpdateRequestWorkerPayload

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

	rw, err := h.service.UpdateRequestWorker(ctx, claims.Subject, &payload)

	if err != nil {
		var status int
		switch err {
		default:
			status = http.StatusInternalServerError
		}
		utils.WriteError(w, status, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, rw)
}

func (h *Handler) handlerCreateValorPropuesto(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var payload salesmodel.CreateValorPropuestoPayload

	err := utils.ParseJSON(r, &payload)
	if err != nil {
		println("Error al parsear JSON")
		println(err.Error())
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	err = utils.Validate.Struct(payload)
	if err != nil {
		println("Error al validar la estructura")
		println(err.Error())
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", errors))
		return
	}

	println("router payload.ValorProposed")
	println(payload.ValorProposed)

	req, err := h.service.CreateValorPropuesto(ctx, &payload)

	if err != nil {
		var status int
		switch err {
		default:
			status = http.StatusInternalServerError
		}
		utils.WriteError(w, status, err)
		return
	}

	utils.WriteJSON(w, http.StatusCreated, req)
}
