# Cocos Nuts - React Native

[![Tests](https://github.com/mnofresno/cocos-nuts/actions/workflows/tests.yml/badge.svg)](https://github.com/mnofresno/cocos-nuts/actions/workflows/tests.yml)
[![Lint](https://github.com/mnofresno/cocos-nuts/actions/workflows/lint.yml/badge.svg)](https://github.com/mnofresno/cocos-nuts/actions/workflows/lint.yml)
[![Build](https://github.com/mnofresno/cocos-nuts/actions/workflows/build.yml/badge.svg)](https://github.com/mnofresno/cocos-nuts/actions/workflows/build.yml)
[![Typecheck](https://github.com/mnofresno/cocos-nuts/actions/workflows/typecheck.yml/badge.svg)](https://github.com/mnofresno/cocos-nuts/actions/workflows/typecheck.yml)

Scaffold inicial en React Native (Expo + Typescript).

## Requisitos
- Node.js 18+
- Expo CLI (se usa vía `npx`)

## Setup
```bash
npm install
```

## Ejecutar la app
- `npx expo start`
- `npx expo start --android`
- `npx expo start --ios`
- `npx expo start --web`

## Build web y Docker
```bash
npx expo export --platform web
docker build -t cocos-nuts-web .
docker run -p 8080:80 cocos-nuts-web
```

## Tests
```bash
npm test
```

## Decisiones técnicas
- Base mínima con tema en `src/theme`.
- Arquitectura hexagonal ligera:
  - Dominio en `src/domain` (modelos y reglas: órdenes, instrumentos, portfolio).
  - Casos de uso en `src/application/useCases.ts` y puertos en `src/ports.ts`.
  - Adaptadores HTTP en `src/infrastructure/http/httpClient.ts` (configurable por `EXPO_PUBLIC_API_BASE_URL`).
  - UI consume casos de uso vía hooks (`useInstruments`, `usePortfolio`, `useSearch`, `useSubmitOrder`).
- Cálculos de portfolio centralizados en `src/lib/portfolio.ts` para testear métricas clave.
- Buscador `/search` con hook `useSearch` (mínimo 2 caracteres, manejo de loading/error/empty) y `SearchResultRow` reutilizando `calculateReturnPct`.
- Manejo de errores: adaptador HTTP lanza `HttpError` y los hooks presentan mensajes locales en español sin filtrar errores de programación.
- State management: estado local en hooks de vista; peticiones abortables para evitar updates tras unmount y permitir reemplazar fácilmente adaptadores o cache layer en el futuro.
- Tests unitarios y E2E cubriendo pantalla de búsqueda, componentes y hooks (además de instrumentos/portfolio).

## Preguntas abiertas / mejoras futuras
- API de instrumentos y portfolio: no se detecta paginado; la UI asume que la API devuelve la lista completa en una sola página. Si la API fuera paginada habría que agregar parámetros y controles de carga incremental.
- Órdenes: la API devuelve solo `id` y `status`. El motivo de un `REJECTED`/`FILLED` no está expuesto, y el frontend solo valida que el status coincida con el tipo (reglas en `ensureOrderStatusAllowed`). Sería útil mostrar la razón de rechazo o confirmación si el backend la provee.
- Órdenes: hoy se envía la petición directamente sin reintentos ni cola offline; si se requiere resiliencia habría que agregar reintentos, cancelación explícita o persistencia temporal.
