# API REST + WebSocket — referencia puntual

**Base:** `http://<host>:<PORT>/api` · **PORT** por defecto `3000` · **JSON** `Content-Type: application/json`

**JWT:** cabecera obligatoria en rutas protegidas:

`Authorization: Bearer <accessToken>`

**Públicas (sin JWT):** solo `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`.

---

## Auth — `/api/auth`

| Método | Ruta | JWT | Cuerpo |
|--------|------|-----|--------|
| POST | `/api/auth/register` | No | `{"email":"string@email.com","password":"string (mín. 8)"}` |
| POST | `/api/auth/login` | No | `{"email":"string@email.com","password":"string"}` |
| POST | `/api/auth/refresh` | No | `{"refreshToken":"string"}` |
| POST | `/api/auth/logout` | Sí | `{"refreshToken":"string"}` opcional · cabecera `Authorization: Bearer <access>` obligatoria |

---

## Users — `/api/users`

**Rol:** `COORDINATOR` · JWT sí

| Método | Ruta | Cuerpo |
|--------|------|--------|
| POST | `/api/users` | Ver tabla siguiente |
| GET | `/api/users` | — |
| GET | `/api/users/:id` | — |
| PATCH | `/api/users/:id` | Igual que POST pero **todos los campos opcionales** |
| DELETE | `/api/users/:id` | — |

**POST `/api/users`**

```json
{
  "username": "string",
  "email": "string@email.com",
  "password": "string (mín. 8)",
  "role": "COORDINATOR | THERAPIST | PATIENT",
  "isActive": true,
  "therapistProfile": { "specialization": "string opcional" },
  "patientProfile": { "dateOfBirth": "ISO-8601 opcional", "phone": "string opcional" }
}
```

---

## Therapists — `/api/therapists`

**Rol:** `THERAPIST` · JWT sí

| Método | Ruta | Cuerpo |
|--------|------|--------|
| POST | `/api/therapists/patients` | `{"patientId":"uuid","therapistId":"uuid"}` |
| GET | `/api/therapists/:id` | — |
| GET | `/api/therapists/:id/patients` | — |
| GET | `/api/therapists/:id/sessions` | — |
| GET | `/api/therapists/:id/clinical-notes` | — |

---

## Patients — `/api/patients`

**Rol:** `PATIENT` · JWT sí

| Método | Ruta | Cuerpo |
|--------|------|--------|
| GET | `/api/patients/:id` | — |
| GET | `/api/patients/:id/clinical-notes` | — |
| GET | `/api/patients/:id/sessions` | — |
| GET | `/api/patients/:id/therapists` | — |

---

## Sessions — `/api/sessions`

**Roles (uno u otro):** `THERAPIST` **o** `COORDINATOR` · JWT sí

| Método | Ruta | Cuerpo |
|--------|------|--------|
| POST | `/api/sessions` | Ver tabla siguiente |
| GET | `/api/sessions` | — |
| GET | `/api/sessions/:id` | — |
| PATCH | `/api/sessions/:id` | Misma forma que POST; **todos los campos opcionales** |
| DELETE | `/api/sessions/:id` | — |

**POST `/api/sessions`**

```json
{
  "therapistId": "uuid",
  "patientId": "uuid",
  "startTime": "fecha-hora (ISO-8601 recomendado)",
  "endTime": "fecha-hora (ISO-8601 recomendado)",
  "meetingLink": "string",
  "status": "SCHEDULED | COMPLETED | CANCELED | ABSENT",
  "notes": [{ "content": "string" }]
}
```

`notes` opcional.

---

## Clinical notes — `/api/clinical-notes`

JWT sí · sin `@Roles` en controlador (solo middleware)

| Método | Ruta | Cuerpo |
|--------|------|--------|
| POST | `/api/clinical-notes` | Ver tabla siguiente |
| GET | `/api/clinical-notes/:id` | — |
| PATCH | `/api/clinical-notes/:id` | Todos los campos del POST **opcionales** |
| DELETE | `/api/clinical-notes/:id` | — |

**POST `/api/clinical-notes`**

```json
{
  "sessionId": "uuid",
  "patientId": "uuid",
  "therapistId": "uuid",
  "content": "string"
}
```

---

## Reports — `/api/reports`

JWT sí

| Método | Ruta | Cuerpo |
|--------|------|--------|
| POST | `/api/reports` | `{}` (DTO vacío en código; ampliar cuando definas campos) |
| GET | `/api/reports` | — |
| GET | `/api/reports/:id` | — · `:id` numérico |
| PATCH | `/api/reports/:id` | `{}` o campos parciales cuando existan en DTO |
| DELETE | `/api/reports/:id` | — |

---

## Enums (Prisma)

| Enum | Valores |
|------|---------|
| `Role` | `COORDINATOR`, `THERAPIST`, `PATIENT` |
| `SessionStatus` | `SCHEDULED`, `COMPLETED`, `CANCELED`, `ABSENT` |
| `NotificationType` | `REMINDER`, `CANCELLATION`, `CONFIRMATION` |
| `NotificationStatus` | `SENT`, `FAILED`, `READ` |

---

## WebSocket — Socket.IO (notificaciones)

- **URL:** mismo origen que el HTTP (ej. `http://localhost:3000`), namespace por defecto `/`.
- **Cliente:** `socket.io-client` → `io(baseUrl)`.

| Evento emitido por el cliente | Payload recomendado (un solo objeto JSON) | Comportamiento en backend |
|-------------------------------|-------------------------------------------|---------------------------|
| `createNotification` | `{"userId":"uuid","type":"REMINDER\|CANCELLATION\|CONFIRMATION","message":"string","status":"SENT\|FAILED\|READ"}` | Crea notificación; persistencia usa principalmente `type` y `message` (estado por defecto en BD `SENT`). |
| `findAllNotifications` | `{"userId":"uuid"}` o string `userId` según alineación con gateway | Lista notificaciones del usuario. |
| `findOneNotification` | `{"id":"uuid notificación","userId":"uuid"}` | Devuelve una notificación. |
| `removeNotification` | `{"id":"uuid","userId":"uuid"}` | Marca la notificación como `READ` (no borra fila). |

> El gateway actual declara varios parámetros por handler; Socket.IO envía **un único mensaje**. Conviene que el frontend envíe **siempre un objeto** con las claves anteriores; si algo falla, alinear el `notifications.gateway.ts` para leer solo `@MessageBody() payload` y desestructurar.

**Escuchar (ejemplo):** `socket.on('<nombreEvento>', (data) => …)` según emisiones futuras del servidor.
