# Instrucciones para Codex

## Objetivo
Desarrollar la app del challenge en React Native + TypeScript siguiendo `challenge-definition.md`, con calidad de producción.

## Flujo de trabajo
- Mantener `status.md` sincronizado con tareas del challenge y pedidos del usuario; agregar nuevos pedidos como tareas con casilleros y marcar solo lo finalizado.
- Mantener decisiones técnicas y cómo correr el proyecto en `README.md`.

## Arquitectura y patrones
- Arquitectura hexagonal ligera:
  - Dominio en `src/domain` (órdenes, instrumentos, portfolio, errores, resultados de búsqueda).
  - Puertos en `src/ports.ts`.
  - Casos de uso en `src/application/useCases.ts` + `src/application/container.ts`.
  - Adaptadores HTTP en `src/infrastructure/http/httpClient.ts` (configurable por `EXPO_PUBLIC_API_BASE_URL`).
  - UI (screens/components) consume casos de uso vía hooks en `src/hooks`.
- Código y nombres en inglés; textos visibles al usuario en español.
- Manejo de errores: `HttpError` y `DomainError`; los hooks muestran mensajes de usuario en español y no silencian errores de programación.
- State management: estado local en hooks de vista; requests abortables; se puede reemplazar puertos por dobles para tests.

## Testing
- Preferir `npm test` con cobertura. Mockear `fetch` en e2e unitarios; usar abort controllers para evitar warnings.
- No dejar fallas de act(); envolver actualizaciones async en `waitFor` o `act` cuando corresponda.

## Otras notas
- No revertir cambios existentes del usuario.
- Respetar el idioma y mantener precios en pesos.
- UI debe cumplir con /instruments, /portfolio, /search y órdenes (BUY/SELL, MARKET/LIMIT, monto en pesos, reglas de estado, mostrar id/status).
