package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"

	"github.com/go-playground/validator/v10"
)

var Validate = validator.New()

// StandardResponse es la estructura base para todas las respuestas exitosas
type StandardResponse struct {
	Code    int         `json:"code"`
	Data    interface{} `json:"data,omitempty"`
	Message string      `json:"message,omitempty"`
}

// ErrorResponse es la estructura para respuestas de error
type ErrorResponse struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Details interface{} `json:"details,omitempty"`
}

func ParseJSON(r *http.Request, payload any) error {
	if r.Body == nil {
		return fmt.Errorf("missing request body")
	}

	return json.NewDecoder(r.Body).Decode(payload)
}

func StringToUint(s string) (uint, error) {
	val, err := strconv.ParseUint(s, 10, 0)
	if err != nil {
		return 0, fmt.Errorf("falló al convertir '%s' a uint: %w", s, err)
	}
	return uint(val), nil
}

// WriteJSON envía una respuesta JSON estandarizada para casos exitosos
func WriteJSON(w http.ResponseWriter, status int, data interface{}, message ...string) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	msg := ""
	if len(message) > 0 {
		msg = message[0]
	}

	response := StandardResponse{
		Code:    status,
		Data:    data,
		Message: msg,
	}

	return json.NewEncoder(w).Encode(response)
}

// WriteError envía una respuesta de error estandarizada
func WriteError(w http.ResponseWriter, status int, err error, details ...interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	var detail interface{}
	if len(details) > 0 {
		detail = details[0]
	}

	response := ErrorResponse{
		Code:    status,
		Message: err.Error(),
		Details: detail,
	}

	json.NewEncoder(w).Encode(response)
}

type contextKey string

const UserContextKey = contextKey("userClaims")

func MapQueryToJSON(query url.Values) map[string]interface{} {
	result := make(map[string]interface{})
	for key, values := range query {
		if len(values) == 1 {
			result[key] = values[0]
		} else {
			result[key] = values
		}
	}
	return result
}
