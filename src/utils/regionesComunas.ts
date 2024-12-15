

const regionesComunas: Record<string, string[]> = {
    "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Huara", "Camiña", "Colchane", "Pica"],
    "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama"],
    "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Huasco"],
    "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paihuano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Concón", "Quilpué", "Villa Alemana", "Casablanca", "San Antonio", "Cartagena", "El Quisco", "El Tabo", "Algarrobo", "Quillota", "La Calera", "Hijuelas", "La Cruz", "Nogales", "San Felipe", "Los Andes", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Isla de Pascua (Rapa Nui)", "Juan Fernández"],
    "Metropolitana": ["Santiago", "Providencia", "Las Condes", "Vitacura", "La Florida", "Puente Alto", "Maipú", "Pudahuel", "Quilicura", "Conchalí", "Huechuraba", "Recoleta", "Independencia", "Ñuñoa", "La Reina", "Peñalolén", "Lo Barnechea", "Lo Prado", "Cerro Navia", "Quinta Normal", "Estación Central", "Pedro Aguirre Cerda", "San Miguel", "La Cisterna", "Lo Espejo", "San Joaquín", "La Granja", "Macul", "El Bosque", "La Pintana", "San Ramón", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "Melipilla", "Curacaví", "María Pinto", "Talagante", "El Monte", "Isla de Maipo", "Peñaflor", "Padre Hurtado"],
    "O'Higgins": ["Rancagua", "Machalí", "Graneros", "Codegua", "Requínoa", "Rengo", "San Vicente", "Doñihue", "Coinco", "Coltauco", "Las Cabras", "Peumo", "Pichidegua", "Malloa", "San Fernando", "Chimbarongo", "Placilla", "Nancagua", "Santa Cruz", "Lolol", "Paredones", "Pichilemu", "Litueche", "Marchihue", "La Estrella"],
    "Maule": ["Talca", "Constitución", "Curepto", "Maule", "Pencahue", "Pelarco", "Río Claro", "San Clemente", "San Rafael", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas", "Cauquenes", "Chanco", "Pelluhue"],
    "Ñuble": ["Chillán", "Chillán Viejo", "Bulnes", "Cobquecura", "Coelemu", "Quirihue", "Ninhue", "Portezuelo", "Ránquil", "San Carlos", "San Fabián", "San Ignacio", "El Carmen", "Pemuco", "Yungay", "Trehuaco", "Quillón", "Pinto"],
    "Biobío": ["Concepción", "Talcahuano", "Hualpén", "Chiguayante", "San Pedro de la Paz", "Coronel", "Lota", "Tomé", "Penco", "Hualqui", "Santa Juana", "Florida", "Cabrero", "Laja", "San Rosendo", "Yumbel", "Los Ángeles", "Nacimiento", "Negrete", "Mulchén", "Quilaco", "Quilleco", "Santa Bárbara", "Antuco", "Alto Biobío"],
    "La Araucanía": ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Cunco", "Melipeuco", "Vilcún", "Freire", "Lautaro", "Perquenco", "Galvarino", "Cholchol", "Nueva Imperial", "Carahue", "Saavedra", "Toltén", "Teodoro Schmidt", "Pitrufquén", "Gorbea", "Loncoche", "Curarrehue", "Angol", "Renaico", "Collipulli", "Ercilla", "Los Sauces", "Lumaco", "Purén", "Traiguén", "Victoria"],
    "Los Ríos": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "Futrono", "La Unión", "Lago Ranco"],
    "Los Lagos": ["Puerto Montt", "Puerto Varas", "Calbuco", "Cochamó", "Maullín", "Llanquihue", "Fresia", "Frutillar", "Los Muermos", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Ancud", "Castro", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Hualaihué", "Chaitén", "Futaleufú", "Palena"],
    "Aysén": ["Coyhaique", "Puerto Aysén", "Puerto Cisnes", "Guaitecas", "Chile Chico", "Río Ibáñez", "Cochrane", "O'Higgins", "Tortel"],
    "Magallanes y la Antártica Chilena": ["Punta Arenas", "Puerto Natales", "Porvenir", "Primavera", "Timaukel", "Laguna Blanca", "San Gregorio", "Río Verde", "Cabo de Hornos", "Antártica"]
  };
  
  export default regionesComunas;
  