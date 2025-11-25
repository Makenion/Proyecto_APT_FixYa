package customserros

import "errors"

// Errores de User
var (
	ErrInvalidUserType    = errors.New("invalid user type")
	ErrUserExists         = errors.New("user with this email already exists")
	ErrUserDontExists     = errors.New("user with this email doenst exists")
	ErrPasswordDontMatch  = errors.New("incorrect password")
	ErrWeakPassword       = errors.New("password does not meet requirements")
	ErrInvalidEmail       = errors.New("invalid email format")
	ErrNotFound           = errors.New("resource not found")
	ErrUnauthorized       = errors.New("unauthorized access")
	ErrValidationFailed   = errors.New("validation failed")
	ErrUserTypeDontExists = errors.New("userType with this id doesnt exist")
	ErrNoUpdateUser       = errors.New("no se actualizo ni un usuario")
)

// Errores de Worker
var (
	ErrWorkerEmailDifferent      = errors.New("the gmail send is different from the jwt")
	ErrSpecialityNotFound        = errors.New("speciality with that id not found")
	ErrCertificateTypeDontExists = errors.New("certificate type with that id not found")
	MissingStateValue            = errors.New("state missing")
)

// Errores de Location
var (
	ErrComunaDontExists = errors.New("comuna with this id doesnt exist")
	ErrRegionDontExists = errors.New("region with this id doesnt exist")
	ErrCalleDontExists  = errors.New("calle with this name doesnt exist")
	ErrCantCreateCalle  = errors.New("failed to create calle")
)

// Errores de infraestructura
var (
	ErrDatabase        = errors.New("database error")
	ErrExternalService = errors.New("external service error")
)
