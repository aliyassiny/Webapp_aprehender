# MindBridge - Plataforma de Gestión de Terapias Online

Sistema web para la gestión integral de sesiones terapéuticas, pacientes y terapeutas en un entorno de salud mental online.

## 🎯 Descripción

MindBridge es una plataforma que facilita la coordinación entre terapeutas, pacientes y coordinadores, permitiendo la gestión de sesiones, notas clínicas, reportes y notificaciones en tiempo real.

## 🏗️ Arquitectura

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: NestJS + TypeScript + Prisma ORM
- **Base de Datos**: PostgreSQL
- **Infraestructura**: Docker + Docker Compose

## 👥 Roles del Sistema

- **Coordinador**: Administra usuarios, sesiones y genera reportes
- **Terapeuta**: Gestiona sus pacientes, sesiones y notas clínicas
- **Paciente**: Visualiza sus sesiones y terapeutas asignados

## 🚀 Instalación y Ejecución

### Prerequisitos

- Docker y Docker Compose instalados
- Node.js 20+ (para desarrollo local)

### Opción 1: Docker (Recomendado)

#### Backend + Base de Datos
```bash
cd Backend
docker-compose up -d --build
```

El backend estará disponible en `http://localhost:3000`

#### Frontend
```bash
cd Frontend
docker-compose up -d --build
```

El frontend estará disponible en `http://localhost:5173`

### Opción 2: Desarrollo Local

#### Backend
```bash
cd Backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

#### Frontend
```bash
cd Frontend
npm install
npm run dev
```

## 📦 Servicios

### Backend (Puerto 3000)
- API REST con autenticación JWT
- WebSocket para notificaciones en tiempo real
- Control de acceso basado en roles (RBAC)
- Rate limiting y validación de datos

### Frontend (Puerto 5173)
- Interfaz responsive y accesible
- Dashboards personalizados por rol
- Gestión de sesiones y pacientes
- Sistema de notificaciones en tiempo real

### Base de Datos (Puerto 5433)
- PostgreSQL con Prisma ORM
- Migraciones automáticas
- Volumen persistente para datos

## 🔐 Variables de Entorno

### Backend (.env)
```env
DATABASE_URL="postgresql://usuario:password@localhost:5433/MindBridgeDB"
POSTGRES_USER=usuario
POSTGRES_PASSWORD=password
POSTGRES_DB=MindBridgeDB
JWT_SECRET=tu_secreto_jwt
```

## 📚 Documentación Adicional

- [DIAGRAMS_INSTRUCTIONS.md](./DIAGRAMS_INSTRUCTIONS.md) - Especificaciones de arquitectura
- [DEVELOPMENT_PROCESS.md](./DEVELOPMENT_PROCESS.md) - Proceso de desarrollo detallado

## 🛠️ Tecnologías Principales

**Frontend:**
- React 18, TypeScript, Vite
- Shadcn/ui, Tailwind CSS
- React Query, React Router
- Socket.io-client, Axios

**Backend:**
- NestJS 11, TypeScript
- Prisma ORM, PostgreSQL
- JWT, bcryptjs
- Socket.io, class-validator

## 📄 Licencia

Proyecto privado - Todos los derechos reservados
