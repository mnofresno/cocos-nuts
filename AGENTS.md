# Instrucciones para Codex

## Objetivo del proyecto
Desarrollar la app de challenge en React Native + TypeScript según `challenge-definition.md`, priorizando calidad de producción.

## Flujo de trabajo
- Mantener `status.md` actualizado con las tareas del challenge y pedidos del usuario.
- Agregar nuevos pedidos del usuario como tareas con casilleros de check.
- Marcar como completadas solo las tareas finalizadas.
- Mantener decisiones técnicas claras en `README.md`.

## Estado de tareas (duplicado intencional de `status.md`)
- [x] Scaffold react native project structure
- [x] Basic CI to run tests
- [x] CI: linter TypeScript y React
- [x] CI: workflows separados (tests, lint, build, typecheck)
- [x] README: badges por workflow (tests, lint, build, typecheck)
- [x] CI: versionado automatico de la app
- [x] CI: release APK Android en GitHub Releases
- [x] API base URL configurable via variable de entorno para releases
- [x] Pantalla /instruments: listar ticker, nombre, ultimo precio y retorno (ultimo precio vs cierre)
- [ ] Pantalla /portfolio: listar ticker, cantidad, valor de mercado, ganancia y rendimiento total (usar avg_cost_price)
- [ ] Pantalla /search: buscador por ticker
- [ ] Ordenes: modal con formulario (BUY/SELL, MARKET/LIMIT, cantidad, precio solo para LIMIT) y POST /orders
- [ ] Ordenes: mostrar id y status devuelto (PENDING, REJECTED, FILLED)
- [ ] Ordenes: validar reglas de estado segun tipo (LIMIT -> PENDING/REJECTED, MARKET -> REJECTED/FILLED)
- [ ] Ordenes: permitir cantidad exacta o monto en pesos (calcular cantidad max sin fracciones con ultimo precio)
- [ ] Precios mostrados en pesos
- [ ] Calculos portfolio: valor de mercado = quantity * last_price; ganancia y rendimiento usando avg_cost_price
- [ ] README.md: instrucciones de instalacion/ejecucion y decisiones tecnicas
- [ ] Arquitectura: estructura mantenible y escalable
- [ ] Manejo de errores robusto
- [ ] State management adecuado
- [ ] Unit tests si aplica
- [x] Stabilize portfolio screen test by mocking API service
