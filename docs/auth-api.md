# Auth API: Register & Login

How the frontend talks to the backend auth endpoints.
Backend source: `backend/src/auth/`.

## How it works

| When | Frontend sends | Backend returns |
| --- | --- | --- |
| Register / login | `POST` with the form fields | `{ accessToken, user }` + a `refresh_token` cookie |
| Any protected call | `Authorization: Bearer <accessToken>` | The data |
| Page reload, or access token expired | `POST /auth/refresh` (no body) | A new `{ accessToken, user }` + a new cookie |
| Logout | `POST /auth/logout` | `204`, cookie cleared |

There are two tokens:

- **Access token**: lasts 15 minutes. Keep it in memory only (a zustand store without `persist`). Never put it in `localStorage`.
- **Refresh token**: lasts 7 days. It's an `httpOnly` cookie, so JavaScript can't read it. The browser sends it to `/auth/*` by itself. The frontend never touches it.

---

## 1. Setup: API URL and cookies

The backend allows CORS from `http://localhost:5173`, with cookies. The frontend calls the API directly at `http://localhost:3000`.

1. Create `frontend/.env`:
   ```
   VITE_API_URL=http://localhost:3000
   ```
2. **Every request must use `credentials: 'include'`.** Without it, the browser doesn't save the refresh cookie after login and doesn't send it to `/auth/refresh` or `/auth/logout`. The `api.ts` below already does this.

> Open the app at `http://localhost:5173`, not `http://127.0.0.1:5173`. The backend only allows that exact address. Any other address gets a CORS error.

> Running the frontend on another port? Set `CORS_ORIGIN` in the backend `.env` to match, then restart the backend.

---

## 2. Register

`POST /auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Secret#123"
}
```

| Field | Rules |
| --- | --- |
| `name` | Required, max 100 characters |
| `email` | A valid email. Case doesn't matter, it's saved in lowercase |
| `password` | 8 to 64 characters, with at least 1 letter, 1 number, and 1 symbol (anything that isn't A–Z, a–z or 0–9) |

> **Send only these 3 fields.** The API rejects any unknown field with `400`.
> The register form has `confirmPassword`: compare it on the frontend, then leave it out of the body.
> Don't send `Object.fromEntries(formData)`.

> The backend trims spaces around `name` and `email`. A name made only of spaces is rejected with `name should not be empty`.

### Success: `201 Created`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6730f1c2a1b2c3d4e5f60718",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

The response also sets the `refresh_token` cookie. The user is logged in right away, so don't call login after register.

### Errors

| Status | `message` | What to show |
| --- | --- | --- |
| `400` | Array of strings (list below) | The messages under the form |
| `409` | `"Email already in use"` | "This email already has an account." + a link to `/login` |
| `429` | `"ThrottlerException: Too Many Requests"` | "Too many attempts. Wait a minute and try again." |

All possible `400` messages:

```
name must be a string
name should not be empty
name must be shorter than or equal to 100 characters
email must be an email
password must be longer than or equal to 8 characters
password must be shorter than or equal to 64 characters
password must contain at least one letter
password must contain at least one number
password must contain at least one special character
property confirmPassword should not exist      ← you sent an extra field
```

---

## 3. Login

`POST /auth/login`

```json
{
  "email": "john@example.com",
  "password": "Secret#123"
}
```

Login doesn't check the password strength rules. It only checks that the email is valid and the password isn't empty (max 64 characters).

### Success: `200 OK`

Same body and same cookie as register.

### Errors

| Status | `message` | What to show |
| --- | --- | --- |
| `400` | Array, e.g. `["email must be an email"]` | The messages under the form |
| `401` | `"Invalid email or password"` | The same text. The API doesn't say which one is wrong, on purpose. |
| `429` | `"ThrottlerException: Too Many Requests"` | "Too many attempts. Wait a minute and try again." |

---

## 4. Error format

Every error is JSON. `message` is an **array** for `400` and a **string** for everything else:

```json
{ "message": ["email must be an email"], "error": "Bad Request", "statusCode": 400 }
```

```json
{ "message": "Invalid email or password", "error": "Unauthorized", "statusCode": 401 }
```

The `ApiError` class below turns both into a `string[]`.

**Rate limit:** 10 requests per minute per IP, per endpoint. `/auth/login` and `/auth/register` are counted separately.

---

## 5. Staying logged in

The access token lives in memory, so a page reload loses it. The cookie survives, so:

1. **When the app starts:** call `POST /auth/refresh`. `200` means logged in: save `accessToken` and `user`. `401` means logged out.
2. **On protected calls:** send `Authorization: Bearer <accessToken>`. On `401`, call refresh once and retry the request. If refresh also returns `401`, send the user to `/login`.
3. **Logout:** `POST /auth/logout` returns `204`. Then clear the store.

> ⚠️ **Never run two refresh calls at the same time.**
> Each refresh replaces the cookie with a new one. If a second request arrives with the old cookie, the backend treats it as a stolen token and ends the session, so the user gets logged out.
> React StrictMode runs effects twice in development, so a plain `useEffect(() => { refresh() }, [])` triggers this.
> The `refresh()` function below shares one request between all callers, which avoids the problem.

---

## 6. Code to copy

### `src/lib/api.ts`

```ts
import { useAuthStore } from '../stores/auth.ts'

export interface User {
  id: string
  name: string
  email: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

/** An error from the API. `messages` is always an array, ready to show under a form. */
export class ApiError extends Error {
  status: number
  messages: string[]

  constructor(status: number, messages: string[]) {
    super(messages[0])
    this.status = status
    this.messages = messages
  }
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

async function post<T>(path: string, body?: object): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    credentials: 'include', // save and send the refresh token cookie
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    const message: unknown = data?.message
    const messages = Array.isArray(message)
      ? message.map(String)
      : [String(message ?? 'Something went wrong')]
    throw new ApiError(response.status, messages)
  }

  return response.status === 204 ? (undefined as T) : response.json()
}

export function register(input: { name: string; email: string; password: string }) {
  // Build the body by hand: the API rejects unknown fields like confirmPassword.
  return post<AuthResponse>('/auth/register', {
    name: input.name.trim(),
    email: input.email.trim(),
    password: input.password,
  })
}

export function login(input: { email: string; password: string }) {
  return post<AuthResponse>('/auth/login', {
    email: input.email.trim(),
    password: input.password,
  })
}

let refreshInFlight: Promise<AuthResponse> | null = null

/** Safe to call many times at once: every caller shares the same request. */
export function refresh() {
  refreshInFlight ??= post<AuthResponse>('/auth/refresh').finally(() => {
    refreshInFlight = null
  })
  return refreshInFlight
}

export function logout() {
  return post<void>('/auth/logout')
}

/** fetch() for protected routes: adds the token, and refreshes it once on 401. */
export async function authFetch(path: string, init: RequestInit = {}) {
  const send = () => {
    const headers = new Headers(init.headers)
    headers.set('Authorization', `Bearer ${useAuthStore.getState().accessToken}`)
    return fetch(`${API_URL}${path}`, { ...init, headers, credentials: 'include' })
  }

  const response = await send()
  if (response.status !== 401) return response

  try {
    useAuthStore.getState().setAuth(await refresh())
  } catch {
    useAuthStore.getState().clearAuth()
    return response
  }
  return send()
}
```

### `src/stores/auth.ts`

```ts
import { create } from 'zustand'
import type { AuthResponse, User } from '../lib/api.ts'

interface AuthState {
  accessToken: string | null
  user: User | null
  setAuth: (auth: AuthResponse) => void
  clearAuth: () => void
}

// No `persist` on purpose: the access token stays in memory only.
export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  user: null,
  setAuth: ({ accessToken, user }) => set({ accessToken, user }),
  clearAuth: () => set({ accessToken: null, user: null }),
}))
```

### Register page (`handleSubmit`)

```tsx
const navigate = useNavigate()

async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const data = new FormData(e.currentTarget)

  if (data.get('password') !== data.get('confirmPassword')) {
    setError('Passwords do not match.')
    return
  }

  setError('')
  try {
    const auth = await register({
      name: String(data.get('name')),
      email: String(data.get('email')),
      password: String(data.get('password')),
    })
    useAuthStore.getState().setAuth(auth)
    navigate('/')
  } catch (err) {
    setError(err instanceof ApiError ? err.messages.join('\n') : 'Could not reach the server.')
  }
}
```

The login page is the same, with `login({ email, password })` and no `confirmPassword` check.

> `error.messages.join('\n')` needs `whitespace-pre-line` on the error `<p>` to show each message on its own line.

### On app start

```tsx
useEffect(() => {
  refresh()
    .then((auth) => useAuthStore.getState().setAuth(auth))
    .catch(() => useAuthStore.getState().clearAuth())
}, [])
```

Until this finishes you don't know yet if the user is logged in. Show a loader instead of redirecting to `/login` too early.

### Logout

```ts
await logout()
useAuthStore.getState().clearAuth()
navigate('/login')
```

---

## 7. Production

- Backend: set `CORS_ORIGIN` to the real frontend address, e.g. `https://app.example.com`.
- Frontend: set `VITE_API_URL` to the real API address, e.g. `https://api.example.com`.
- The refresh cookie is `SameSite=Strict` and HTTPS-only in production. The frontend and the API must be on the **same site**, like `app.example.com` and `api.example.com`. On two unrelated domains the browser won't send the cookie, and users are logged out on every reload.
