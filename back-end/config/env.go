package config

import (
	"os"
	"strconv"

	"github.com/lpernett/godotenv"
)

type Config struct {
	DirectDatabase string
	//PublicHost             string
	//Port                   string
	//DBAdmin                string
	//DBPasswordAdmin        string
	//DBUserAdmin            string
	//DBPasswordUser         string
	//DBWorkerAdmin          string
	//DBPasswordWorker       string
	//DBLocationAdmin        string
	//DBPasswordLocation     string
	//DBSalesAdmin           string
	//DBPasswordSales        string
	DBAddress string
	DBName    string
	//JWTExpirationInSeconds int64
	//JWTSecret              string
}

var Envs = initConfig()

func initConfig() Config {

	godotenv.Load()
	return Config{
		DirectDatabase: getEnv("DATABASE_URL", "http://localhost"),
		//PublicHost:             getEnv("PUBLIC_HOST", "http://localhost"),
		//Port:                   getEnv("PORT", "8080"),
		//DBAdmin:                getEnv("DBAdmin", "root"),
		//DBPasswordAdmin:        getEnv("DBPasswordAdmin", ""),
		//DBUserAdmin:            getEnv("DBUserAdmin", "user_admin"),
		//DBPasswordUser:         getEnv("DBPasswordUser", "password1234"),
		//DBWorkerAdmin:          getEnv("DBWorkerAdmin", "worker_admin"),
		//DBPasswordWorker:       getEnv("DBPasswordWorker", "password1234"),
		//DBLocationAdmin:        getEnv("DBLocationAdmin", "location_admin"),
		//DBPasswordLocation:     getEnv("DBPasswordLocation", "password1234"),
		//DBSalesAdmin:           getEnv("DBSalesAdmin", "sales_admin"),
		//DBPasswordSales:        getEnv("DBPasswordSales", "password1234"),
		//DBName:                 getEnv("DB_NAME", "uber2"),
		//JWTSecret:              getEnv("JWT_SECRET", "not-secret-secret-anymore?"),
		//JWTExpirationInSeconds: getEnvInt("JWT_EXP", 3600*24*7),
		//DBAddress:              fmt.Sprintf("%s:%s", getEnv("DB_HOST", "127.0.0.1"), getEnv("DB_PORT", "3306")),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}

	return fallback
}

func getEnvInt(key string, fallback int64) int64 {
	if value, ok := os.LookupEnv(key); ok {
		i, err := strconv.ParseInt(value, 10, 64)

		if err != nil {
			return fallback
		}

		return i
	}

	return fallback
}
