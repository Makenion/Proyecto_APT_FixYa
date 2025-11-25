package sales

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/salesmodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/usermodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/workermodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/utils"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/utils/customserros"
)

type saleService struct {
	saleStore   salesmodel.SaleStore
	workerStore workermodel.WorkerStore
}

// requestBody := map[string]interface{}{
// 		"image_urls": imageUrls,
// 	}

func NewSaleService(saleStore salesmodel.SaleStore, workerStore workermodel.WorkerStore) *saleService {
	return &saleService{saleStore: saleStore, workerStore: workerStore}
}

func (s *saleService) GetReviewsByFilters(ctx context.Context, filters map[string]interface{}) ([]salesmodel.Review, error) {
	return s.saleStore.GetReviewsByFilters(ctx, filters)
}

func (s *saleService) GetRequestsClienteByFilters(ctx context.Context, filters map[string]interface{}) ([]salesmodel.Request, error) {
	return s.saleStore.GetRequestsClienteByFilters(ctx, filters)
}

func (s *saleService) GetRequestsTrabajadorByFilters(ctx context.Context, filters map[string]interface{}) ([]salesmodel.Request, error) {
	return s.saleStore.GetRequestsTrabajadorByFilters(ctx, filters)
}

func (s *saleService) GetValueClientByFilters(ctx context.Context, filters map[string]interface{}) ([]salesmodel.RequestValueWorker, error) {
	claims, ok := ctx.Value(utils.UserContextKey).(*usermodel.UserToken)
	if !ok {
		return nil, customserros.ErrUserDontExists
	}

	filters["user_id"] = claims.Subject

	return s.saleStore.GetValueClientByFilters(ctx, filters)
}

func (s *saleService) GetRequestsByFilters(ctx context.Context, filters map[string]interface{}) ([]salesmodel.Request, error) {
	return s.saleStore.GetRequestsByFilters(ctx, filters)
}

func (s *saleService) GetRequestsWorkersByFilters(ctx context.Context, filters map[string]interface{}) ([]salesmodel.RequestWorker, error) {
	claims, ok := ctx.Value(utils.UserContextKey).(*usermodel.UserToken)
	if !ok {
		return nil, customserros.ErrUserDontExists
	}

	filter := map[string]interface{}{
		"id": claims.Subject,
	}

	worker, _ := s.workerStore.GetWorkerByFilters(ctx, filter)

	filters["worker_id"] = worker[0].ID

	return s.saleStore.GetRequestsWorkersByFilters(ctx, filters)
}

func (s *saleService) SetStatusValueCliente(ctx context.Context, parametros map[string]interface{}) error {
	return s.saleStore.SetStatusValueCliente(ctx, parametros)
}

func (s *saleService) DeleteRequestWorker(ctx context.Context, id uint) error {
	return s.saleStore.DeleteRequestWorker(ctx, id)
}

func (s *saleService) DeleteRequest(ctx context.Context, id uint) error {
	return s.saleStore.DeleteRequest(ctx, id)
}

func (s *saleService) CreateReview(ctx context.Context, payload *salesmodel.RegisterReviewPayload) (*salesmodel.Review, error) {
	review := salesmodel.Review{
		Rating:          payload.Rating,
		Title:           payload.Title,
		Description:     payload.Description,
		CreatedAt:       time.Time{},
		WorkerID:        payload.WorkerID,
		RequestWorkerID: payload.RequestWorkerID,
	}
	err := s.saleStore.CreateReview(ctx, review)

	if err != nil {
		return nil, err
	}

	return &review, nil
}

func (s *saleService) CreateRequest(ctx context.Context, userId uint, payload *salesmodel.RegisterRequestPayload) (*salesmodel.Request, error) {
	images := []salesmodel.RequestImage{}
	notes := []salesmodel.RequestNote{}
	imageUrls := []string{}
	var pythonAnalysis *salesmodel.PythonAnalysisResponse

	for _, image := range payload.Images {
		images = append(images, salesmodel.RequestImage{
			Url:  image.Url,
			Type: image.Type,
		})
		imageUrls = append(imageUrls, image.Url)
	}
	for _, note := range payload.Notes {
		notes = append(notes, salesmodel.RequestNote{
			Url:  note.Url,
			Text: note.Text,
		})
	}

	if len(imageUrls) > 0 {
		var err error
		pythonAnalysis, err = s.callPythonBackendForAnalysis(imageUrls)
		if err != nil {
			// Log del error pero continuar con la creación de la request
			fmt.Printf("Error calling Python backend: %v\n", err)
		} else if pythonAnalysis != nil {
			// Aquí puedes guardar el análisis en la base de datos si lo necesitas
			fmt.Printf("Python analysis received: %+v\n", pythonAnalysis)

		}
	}

	request := salesmodel.Request{
		IsPublic:      *payload.IsPublic,
		Title:         payload.Title,
		Description:   payload.Description,
		SpecialityID:  payload.SpecialityID,
		Value:         payload.Value,
		EndsAt:        payload.EndsAt,
		Status:        payload.Status,
		Location:      payload.Location,
		LocationText:  payload.LocationText,
		UserID:        userId,
		Images:        images,
		Notes:         notes,
		CreatedAt:     time.Time{},
		Complexity:    pythonAnalysis.Summary.AverageComplexity.Level,
		EstimatedTime: pythonAnalysis.Summary.AverageHours,
	}

	err := s.saleStore.CreateRequest(ctx, request)

	if err != nil {
		return nil, err
	}

	return &request, nil
}

func (s *saleService) callPythonBackendForAnalysis(imageUrls []string) (*salesmodel.PythonAnalysisResponse, error) {
	requestBody := map[string]interface{}{
		"image_urls": imageUrls,
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return nil, err
	}

	resp, err := http.Post("http://localhost:5000/predict", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("python backend error: %d", resp.StatusCode)
	}

	var result salesmodel.PythonAnalysisResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &result, nil
}

func (s *saleService) CreateRequestWorker(ctx context.Context, payload *salesmodel.RegisterRequestWorkerPayload) (*salesmodel.RequestWorker, error) {
	request := salesmodel.RequestWorker{
		DateAccepted:   time.Time{},
		StatusClient:   salesmodel.RequestStatusTypeProgress,
		Status:         salesmodel.RequestStatusTypeProgress,
		StatusWorker:   salesmodel.RequestStatusTypeProgress,
		RequestID:      payload.RequestID,
		WorkerDetailID: payload.WorkerID,
	}

	err := s.saleStore.CreateRequestWorker(ctx, request)

	if err != nil {
		return nil, err
	}

	parametros := map[string]interface{}{
		"request_id": payload.RequestID,
		"status":     "rechazado",
	}

	s.saleStore.SetStatusValueCliente(ctx, parametros)

	parametrosValue := map[string]interface{}{
		"id":     payload.RequestID,
		"status": "aceptado",
	}

	req, _ := s.saleStore.GetValueClientByFilters(ctx, parametrosValue)

	updatePayload := salesmodel.UpdateRequestPayload{
		Status: salesmodel.RequestStatusTypeProgress,
		Value:  req[0].ValueProposed,
	}
	s.saleStore.UpdateRequest(ctx, strconv.FormatUint(uint64(payload.RequestID), 10), &updatePayload)

	return &request, nil
}

func (s *saleService) UpdateRequest(ctx context.Context, id string, payload *salesmodel.UpdateRequestPayload) (*salesmodel.Request, error) {
	filters := map[string]interface{}{
		"id":    id,
		"limit": 1,
	}
	requests, err := s.GetRequestsByFilters(ctx, filters)
	if err != nil {
		return nil, err
	}
	if len(requests) == 0 {
		return nil, nil
	}

	request, err := s.saleStore.UpdateRequest(ctx, id, payload)

	if err != nil {
		return nil, err
	}

	return request, nil
}
func (s *saleService) UpdateRequestWorker(ctx context.Context, id string, payload *salesmodel.UpdateRequestWorkerPayload) (*salesmodel.RequestWorker, error) {
	filters := map[string]interface{}{
		"id":    id,
		"limit": 1,
	}
	requests, err := s.GetRequestsWorkersByFilters(ctx, filters)
	if err != nil {
		return nil, err
	}
	if len(requests) == 0 {
		return nil, nil
	}

	r, err := s.saleStore.UpdateRequestWorker(ctx, id, payload)
	if err != nil {
		return nil, err
	}

	return r, nil
}

func (s *saleService) CreateValorPropuesto(ctx context.Context, payload *salesmodel.CreateValorPropuestoPayload) (*salesmodel.RequestValueWorker, error) {

	claims, ok := ctx.Value(utils.UserContextKey).(*usermodel.UserToken)

	if !ok {
		return nil, customserros.ErrUserDontExists
	}

	println("claims.Email")
	println(claims.Email)
	println("claims.Subject")
	println(claims.Subject)

	worker, err := s.workerStore.GetWorkerByFilters(ctx, map[string]interface{}{
		"id": claims.Subject,
	})

	if err != nil {
		return nil, err
	}

	request := &salesmodel.RequestValueWorker{
		ValueProposed:  payload.ValorProposed,
		ProposedAt:     time.Time{},
		RequestID:      payload.RequestID,
		WorkerDetailID: worker[0].ID,
		Active:         "activo",
	}

	value, err := s.saleStore.CreateValorPropuesto(ctx, request)

	if err != nil {
		return nil, err
	}

	return value, nil
}
