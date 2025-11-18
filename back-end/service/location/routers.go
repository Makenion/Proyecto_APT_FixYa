package location

import (
	"net/http"

	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/service/middleware"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/locationmodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/utils"
	"github.com/gorilla/mux"
)

type Handler struct {
	service locationmodel.LocationService
}

func NewHandler(service locationmodel.LocationService) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterRouter(router *mux.Router, middleware *middleware.MiddleWare) {
	router.HandleFunc("/comuna/{id}", h.GetComunaByID).Methods("GET")
	router.HandleFunc("/comunas", h.GetComunas).Methods("GET")
	router.HandleFunc("/region/{id}", h.GetRegionByID).Methods("GET")
	router.HandleFunc("/regions", h.GetRegions).Methods("GET")
	protectedRoutes := router.PathPrefix("").Subrouter()
	protectedRoutes.Use(middleware.JWTMiddleware)
	protectedRoutes.HandleFunc("/calle/{id}", h.GetCalleByID).Methods("GET")
}

func (h *Handler) GetComunaByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idStr := r.URL.Query().Get("id")

	if idStr == "" {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}
	filters := map[string]interface{}{
		"id": idStr,
	}
	comuna, err := h.service.GetComunaByFilters(ctx, filters)
	if err != nil {
		// Manejo de errores si no se encuentra la comuna
		utils.WriteError(w, 400, err)
		return
	}

	utils.WriteJSON(w, 200, comuna, "Comuna encontrada")

}

func (h *Handler) GetComunas(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	queryFilters := utils.MapQueryToJSON(r.URL.Query())
	comunas, err := h.service.GetComunasByFilters(ctx, queryFilters)
	if err != nil {
		utils.WriteError(w, 400, err)
		return
	}

	utils.WriteJSON(w, 200, comunas, "Comunas encontradas")

}

func (h *Handler) GetRegions(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	queryFilters := utils.MapQueryToJSON(r.URL.Query())
	regions, err := h.service.GetRegionsByFilters(ctx, queryFilters)
	println("regions", regions)
	if err != nil {
		utils.WriteError(w, 400, err)
		return
	}

	utils.WriteJSON(w, 200, regions, "Regiones encontradas")

}

func (h *Handler) GetRegionByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}
	filters := map[string]interface{}{
		"id": idStr,
	}
	comuna, err := h.service.GetRegionByFilters(ctx, filters)
	if err != nil {
		utils.WriteError(w, 400, err)
		return
	}

	utils.WriteJSON(w, 200, comuna, "Comuna encontrada")

}

func (h *Handler) GetCalleByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idStr := r.URL.Query().Get("id")

	if idStr == "" {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}
	filters := map[string]interface{}{
		"id": idStr,
	}
	calle, err := h.service.GetCalleByFilters(ctx, filters)
	if err != nil {
		utils.WriteError(w, 400, err)
		return
	}

	utils.WriteJSON(w, 200, calle, "Comuna encontrada")

}
