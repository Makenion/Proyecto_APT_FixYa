package user

import (
	"context"
	"strconv"
	"time"

	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/locationmodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/usermodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/utils/customserros"
	"github.com/dgrijalva/jwt-go/v4"
	"golang.org/x/crypto/bcrypt"
)

const SecretKey = "secret"

type userService struct {
	userStore     usermodel.UserStore
	locationStore locationmodel.LocationStore
}

// VerifyJWT implements usermodel.UserService.
func (s *userService) VerifyJWT(ctx context.Context, tokenString string) (*usermodel.UserToken, error) {

	token, err := jwt.ParseWithClaims(tokenString, &usermodel.UserToken{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil {
		return nil, customserros.ErrUnauthorized
	}
	claims := token.Claims.(*usermodel.UserToken)

	if claims.IssuedAt == nil {
		return nil, customserros.ErrUnauthorized
	}

	if claims.IssuedAt.Time.After(time.Now()) {
		return nil, customserros.ErrUnauthorized
	}

	if claims.ExpiresAt == nil {
		return nil, customserros.ErrUnauthorized
	}

	if claims.ExpiresAt.Time.Before(time.Now()) {
		return nil, customserros.ErrUnauthorized
	}

	// if claims.Issuer == "" {
	//	return nil, customserros.ErrUnauthorized
	// }

	// if claims.Issuer != "User_Admin" {
	//	return nil, customserros.ErrUnauthorized
	// }

	if claims.Subject == "" {
		return nil, customserros.ErrUnauthorized
	}

	filters := map[string]interface{}{
		"id": claims.Subject,
	}
	_, err = s.GetUserByFilters(ctx, filters)

	if err != nil {
		return nil, customserros.ErrUnauthorized
	}

	return claims, nil

}

func NewUserService(userStore usermodel.UserStore, locationStore locationmodel.LocationStore) *userService {
	return &userService{userStore: userStore, locationStore: locationStore}
}

func (s *userService) RegisterUser(ctx context.Context, user *usermodel.RegisterUserPayload) (string, *usermodel.User, error) {
	filters := map[string]interface{}{
		"email": user.Email,
		"limit": 1,
	}
	userExists, err := s.GetUserByFilters(ctx, filters)

	if err != customserros.ErrUserDontExists && err != nil {
		return "", nil, err
	}
	if userExists != nil && userExists.Email == user.Email {
		return "", nil, customserros.ErrUserExists
	}

	// Agregar mas validaciones a futuro
	password, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 14)

	comunaFilters := map[string]interface{}{
		"id": user.Comuna,
	}
	comunaExists, err := s.locationStore.GetComunaByFilters(ctx, comunaFilters)

	if err != nil {
		return "", nil, err
	}

	if comunaExists == nil {
		return "", nil, customserros.ErrComunaDontExists
	}

	regionFilters := map[string]interface{}{
		"id": user.Region,
	}
	regionExists, err := s.locationStore.GetRegionByFilters(ctx, regionFilters)

	if err != nil {
		return "", nil, err
	}

	if regionExists == nil {
		return "", nil, customserros.ErrRegionDontExists
	}

	newCalle, err := s.locationStore.CreateCalle(ctx, user.Calle, user.Comuna)

	if err != nil {
		return "", nil, err
	}

	newUser := &usermodel.User{
		UserTypeID:   uint(user.UserType),
		FullName:     user.FullName,
		IsActive:     true,
		Phone:        user.Phone,
		BankIdentity: user.BankIdentity,
		Email:        user.Email,
		Password:     password,
		CreatedAt:    time.Time{},
		Calle:        newCalle,
		DateBirth:    user.DateBirth,
	}

	dbUser, err := s.userStore.CreateUser(ctx, *newUser)
	if err != nil {
		return "", nil, err
	}

	return GenerateJWT(dbUser)
}

func (s *userService) GetUserByFilters(ctx context.Context, filters map[string]interface{}) (*usermodel.User, error) {
	return s.userStore.GetUserByFilters(ctx, filters)
}

func GenerateJWT(user *usermodel.User) (string, *usermodel.User, error) {
	clams := jwt.NewWithClaims(jwt.SigningMethodHS256,
		usermodel.UserToken{
			StandardClaims: jwt.StandardClaims{
				Subject:   strconv.Itoa(int(user.ID)),
				ExpiresAt: &jwt.Time{Time: time.Now().Add(time.Hour * 24 * 30 * 6)},
				IssuedAt:  &jwt.Time{Time: time.Now()},
			},
			Email: user.Email,
			Type:  user.UserType.Name,
		})

	token, err := clams.SignedString([]byte(SecretKey))

	if err != nil {
		return "", nil, err
	}

	return token, user, nil
}
func (s *userService) Login(ctx context.Context, payload usermodel.LoginUserPayload) (string, *usermodel.User, error) {
	filters := map[string]interface{}{
		"email": payload.Email,
	}
	user, err := s.GetUserByFilters(ctx, filters)
	if err != nil {
		return "", nil, customserros.ErrUserDontExists
	}

	err = bcrypt.CompareHashAndPassword(user.Password, []byte(payload.Password))

	if err != nil {
		return "", nil, customserros.ErrPasswordDontMatch
	}
	return GenerateJWT(user)
}

func (s *userService) GetUserByJWT(ctx context.Context, cookie string) (*usermodel.User, error) {

	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil {
		return nil, customserros.ErrUnauthorized
	}

	claims := token.Claims.(*jwt.StandardClaims)

	filters := map[string]interface{}{
		"id": claims.Subject,
	}
	user, err := s.userStore.GetUserByFilters(ctx, filters)

	if err != nil {
		return nil, err
	}

	return user, nil

}

func (s *userService) UpdateUserByEmail(ctx context.Context, email string, payload *usermodel.UpdateUserPayload) (*usermodel.User, error) {
	filters := map[string]interface{}{
		"email": email,
	}
	_, err := s.GetUserByFilters(ctx, filters)

	if err != nil {
		return nil, customserros.ErrUserDontExists
	}
	var hashedPassword []byte

	if payload.Password != "" {
		hashedPassword, err = bcrypt.GenerateFromPassword([]byte(payload.Password), 14)
		if err != nil {
			return nil, err // Error al hashear
		}
	}

	var newCalle *locationmodel.Calle = nil
	var calleID uint = 0

	if payload.Calle != "" && payload.Comuna != 0 {
		newCalle, err = s.locationStore.CreateCalle(ctx, payload.Calle, payload.Comuna)
		calleID = newCalle.ID
	}

	if err != nil {
		return nil, err
	}

	targetEmail := email

	// 2. Si el payload contiene un email válido, sobrescribe la variable.
	if payload.Email != "" {
		targetEmail = payload.Email
	}

	metadata := []usermodel.UserMetadata{}

	if payload.HouseType != "" {
		metadata = append(metadata, usermodel.UserMetadata{
			Value: payload.HouseType,
			Type:  "casa",
		})
	}

	if len(payload.ServicesTypes) > 0 {
		for _, service := range payload.ServicesTypes {
			metadata = append(metadata, usermodel.UserMetadata{
				Value: service,
				Type:  "servicio",
			})
		}
	}

	datos := &usermodel.UpdateUserService{
		Email:     targetEmail,
		Password:  hashedPassword,
		Metadatas: metadata,
	}

	if calleID != 0 {
		datos.CalleID = calleID
	}

	if payload.DateBirth != nil {
		datos.DateBirth = payload.DateBirth
	}
	if payload.BankIdentity != nil {
		datos.BankIdentity = payload.BankIdentity
	}
	if payload.BankNumber != nil {
		datos.BankNumber = payload.BankNumber
	}
	if payload.Phone != nil {
		datos.Phone = payload.Phone
	}

	user, err := s.userStore.UpdateUserByEmail(ctx, email, datos)

	if err != nil {
		return nil, err
	}

	return user, nil
}
