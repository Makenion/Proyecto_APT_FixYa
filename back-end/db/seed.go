package db

import (
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/locationmodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/usermodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/workermodel"
	"gorm.io/gorm"
)

func SeedDB(db *gorm.DB) {

	var userTypes = []usermodel.UserType{
		{
			ID:   1,
			Name: "admin",
		},
		{
			ID:   2,
			Name: "cliente",
		},
		{
			ID:   3,
			Name: "trabajador",
		},
	}
	for _, item := range userTypes {
		db.FirstOrCreate(&item, usermodel.UserType{Name: item.Name})
	}

	var specialities = []workermodel.Speciality{
		{
			Name:        "Albañil",
			Description: "Especialista en obras de ladrillo, bloque, hormigón y cemento; levanta muros, cimientos y tabiques.",
		},
		{
			Name:        "Carpintero",
			Description: "Encargado de moldajes (encofrados), techumbres y estructuras de madera en la obra gruesa.",
		},
		{
			Name:        "Fierrero",
			Description: "Prepara, corta y coloca las armaduras de hierro (enfierradura) dentro de los moldajes de hormigón.",
		},
		{
			Name:        "Plomero",
			Description: "Instala y repara sistemas de tuberías de agua potable, alcantarillado, desagües y grifería.",
		},
		{
			Name:        "Electricista",
			Description: "Instala, mantiene y repara cableado, paneles, tomas de corriente, iluminación y sistemas eléctricos.",
		},
		{
			Name:        "Gasfiter",
			Description: "A menudo se usa como sinónimo de fontanero, pero a veces se especializa en instalaciones y fugas de gas.",
		},
		{
			Name:        "Pintor",
			Description: "Prepara superficies, aplica pinturas, barnices y selladores en interiores y exteriores.",
		}, {
			Name:        "Yesero o Estucador",
			Description: "Aplica yeso o estuco para revestir muros y techos, dándoles un acabado liso y uniforme.",
		},
		{
			Name:        "Carpintero de Terminaciones",
			Description: "Instala puertas, ventanas, marcos, zócalos, molduras y realiza muebles a medida.",
		},
		{
			Name:        "Maestro de Revestimientos",
			Description: "Coloca cerámicas, porcelanatos, azulejos y otros revestimientos de pisos y muros.",
		},
		{
			Name:        "Parquetista / Maestro de Piso Flotante",
			Description: "Especialista en la instalación y restauración de pisos de madera y laminados.",
		}, {
			Name:        "Soldador",
			Description: "Une metales usando calor y materiales de aporte (arco eléctrico, TIG, MIG, etc.).",
		},
		{
			Name:        "Técnico en Climatización",
			Description: "Instala y mantiene sistemas de aire acondicionado, calefacción y ventilación (HVAC).",
		},
		{
			Name:        "Cristalero",
			Description: "Corta, instala y repara vidrios, espejos y cristales en ventanas, puertas y estructuras.",
		},
		{
			Name:        "Cerrajero",
			Description: "Instala, repara y abre cerraduras, pestillos y sistemas de seguridad de acceso.",
		},
		{
			Name:        "Maestro Techeumbre",
			Description: "Instala y mantiene sistemas de aire acondicionado, calefacción y ventilación (HVAC).",
		},
	}
	for _, item := range specialities {
		db.FirstOrCreate(&item, workermodel.Speciality{Name: item.Name})
	}

	regionValparaiso := locationmodel.Region{
		Name: "Valparaiso",
	}
	db.FirstOrCreate(&regionValparaiso, locationmodel.Region{Name: regionValparaiso.Name})

	regionMetropolitana := locationmodel.Region{
		Name: "Santiago",
	}
	db.FirstOrCreate(&regionMetropolitana, locationmodel.Region{Name: regionMetropolitana.Name})

	var comunas = []locationmodel.Comuna{
		{
			Name:     "Valparaíso",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Viña del Mar",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Concón",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Quintero",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Puchuncaví",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Casablanca",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Juan Fernández",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Quilpué",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Villa alemana",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Limache",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Olmué",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Quillota",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "La Calera",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Hijuelas",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "La Cruz",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Nogales",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "San Antonio",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Cartagena",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "El Quisco",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "El Tabo",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Algarrobo",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Santo Domingo",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "La Ligua",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Cabildo",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Papudo",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Petorca",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Zapallar",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Los Andes",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "San Esteban",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Calle Larga",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Rinconada",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "San Felipe",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Catemu",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Llaillay",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Panquehue",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Putaendo",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Santa Maria",
			RegionID: regionValparaiso.ID,
		},
		{
			Name:     "Santiago",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Cerrillos",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Cerro Navia",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Conchalí",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "El Bosque",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Estación Central",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Huechuraba",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Independencia",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "La Cisterna",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "La Florida",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "La Granja",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "La Pintana",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "La Reina",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Las Condes",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Lo Barnechea",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Lo Espejo",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Lo Prado",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Macul",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Maipu",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Ñuñoa",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Pedro Aguirre Cerda",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Peñalolén",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Providencia",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Pudahuel",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Quilicura",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Quinta Normal",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Recoleta",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Renca",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "San Joaquín",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "San Miguel",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "San Ramón",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Vitacura",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Colina",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Lampa",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Til-Til",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Puente Alto",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Pirque",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "San José de Maipo",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "San Bernardo",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Buin",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Calera de Tango",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Paine",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Melipilla",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Alhué",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Curacaví",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "María Pinto",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "San Pedro",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Talagante",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "El Monte",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Isla de Maipo",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Padre Hurtado",
			RegionID: regionMetropolitana.ID,
		},
		{
			Name:     "Peñaflor",
			RegionID: regionMetropolitana.ID,
		},
	}

	for _, item := range comunas {
		db.FirstOrCreate(&item, locationmodel.Comuna{
			Name:     item.Name,
			RegionID: item.RegionID,
		})
	}
}
