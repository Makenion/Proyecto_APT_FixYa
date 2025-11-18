package api

import (
	"net/http"

	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/service/location"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/service/middleware"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/service/sales"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/service/user"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/service/worker"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

type APIServer struct {
	addr           string
	user_admin     *gorm.DB
	worker_admin   *gorm.DB
	sales_admin    *gorm.DB
	location_admin *gorm.DB
}

func NewAPIServer(addr string, user_admin *gorm.DB, worker_admin *gorm.DB, sales_admin *gorm.DB, location_admin *gorm.DB) *APIServer {
	return &APIServer{
		addr:           addr,
		user_admin:     user_admin,
		worker_admin:   worker_admin,
		sales_admin:    sales_admin,
		location_admin: location_admin,
	}
}

func (s *APIServer) Run() error {
	router := mux.NewRouter()

	mux.CORSMethodMiddleware(router)

	subrouter := router.PathPrefix("/api/v1").Subrouter()

	// Stores
	userStore := user.NewStore(s.user_admin)
	locationStore := location.NewStore(s.location_admin)
	workerStore := worker.NewStore(s.worker_admin)
	saleStore := sales.NewStore(s.sales_admin)

	// Services
	userService := user.NewUserService(userStore, locationStore)
	locationService := location.NewLocationService(locationStore)
	workerService := worker.NewWorkerService(workerStore)
	saleService := sales.NewSaleService(saleStore)

	// MiddleWare
	middleWare := middleware.NewMiddleWare(userService)

	// Routers
	userRouter := user.NewHandler(userService)
	userSubrouter := subrouter.PathPrefix("/user").Subrouter()
	userRouter.RegisterRouter(userSubrouter, middleWare)

	locationRouter := location.NewHandler(locationService)
	locationSubrouter := subrouter.PathPrefix("/location").Subrouter()
	locationRouter.RegisterRouter(locationSubrouter, middleWare)

	workerRouter := worker.NewHandler(workerService)
	workerSubrouter := subrouter.PathPrefix("/worker").Subrouter()
	workerRouter.RegisterRouter(workerSubrouter, middleWare)

	saleRouter := sales.NewHandler(saleService)
	saleSubrouter := subrouter.PathPrefix("/sale").Subrouter()
	saleRouter.RegisterRouter(saleSubrouter, middleWare)

	return http.ListenAndServe(s.addr, router)
}
