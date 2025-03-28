# Create Clean Architecture CLI

Una herramienta CLI para generar proyectos Node.js siguiendo los principios de Clean Architecture en un formato workspace multirepo.

## Características

- ✨ Genera una estructura completa de Clean Architecture
- 📦 Configuración de workspace con 5 módulos independientes
- 🚀 Soporte completo para TypeScript
- 🔄 Inyección de dependencias configurada
- 📝 Tests configurados para cada módulo

## Instalación

```bash
npm install -g create-clean-arch-cli
```

## Uso

```bash
create-clean-arch
```

El CLI te guiará a través del proceso de creación solicitando:
- Nombre del proyecto

## Estructura generada

```
proyecto/
├── packages/
│   ├── domain/
│   │   ├── src/
│   │   │   ├── entities/
│   │   │   ├── value-objects/
│   │   │   └── interfaces/
│   │   └── tests/
│   ├── core/
│   │   ├── src/
│   │   │   ├── use-cases/
│   │   │   └── interfaces/
│   │   └── tests/
│   ├── infrastructure/
│   │   ├── src/
│   │   │   ├── repositories/
│   │   │   └── services/
│   │   └── tests/
│   ├── ioc/
│   │   ├── src/
│   │   │   ├── containers/
│   │   │   └── modules/
│   │   └── tests/
│   └── presentation/
│       ├── src/
│       │   ├── controllers/
│       │   ├── middlewares/
│       │   └── routes/
│       └── tests/
├── package.json
└── tsconfig.json
```

## Módulos

- **Domain**: Entidades y reglas de negocio core
- **Core**: Casos de uso e implementación de la lógica de negocio
- **Infrastructure**: Implementaciones concretas de repositorios y servicios
- **IoC**: Configuración de la inyección de dependencias
- **Presentation**: API REST, controladores y rutas

## Scripts disponibles

```bash
# Construir todos los módulos
npm run build

# Ejecutar tests en todos los módulos
npm run test
```

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría realizar.

## Licencia

MIT
