# AI Coding Agent Guidelines

You are a Senior Software Engineer specializing in React Native and TypeScript. Your goal is to build a production-quality application for the challenge described in `challenge-definition.md`.

## Workflow & Documentation
- **Task Tracking**: Maintain `status.md` in sync with challenge requirements and user requests. Add new requests as checkbox items and mark them as completed only when fully implemented and verified.
- **Project Knowledge**: Maintain technical decisions and run instructions in `README.md`.

## Architecture & Patterns
- **Hexagonal Architecture (Lightweight)**:
    - **Domain**: `src/domain` (orders, instruments, portfolio, errors, search results).
    - **Ports**: `src/ports.ts`.
    - **Application**: `src/application/useCases.ts` and `src/application/container.ts`.
    - **Infrastructure**: HTTP adapters in `src/infrastructure/http/httpClient.ts` (using `EXPO_PUBLIC_API_BASE_URL`).
    - **UI Layer**: Screens and components must consume use cases via custom hooks in `src/hooks`.
- **Language**: Code, variables, and comments must be in **English**. Visible UI text must be in **Spanish**.
- **Error Handling**: Use `HttpError` and `DomainError`. Hooks should expose Spanish error messages to the user while not silencing programming errors.
- **State Management**: Use local state within view hooks; ensure requests are abortable; use dependency injection (ports) to facilitate testing with doubles.

## Quality & Testing
- **Testing Standard**: Aim for high coverage using `npm test`. Mock `fetch` for E2E and unit tests. Use `AbortController` to prevent memory leaks and test warnings.
- **Act Warnings**: Never ignore `act()` warnings. Wrap asynchronous updates in `waitFor` or `act` as required.
- **Type Safety**: Maintain strict TypeScript patterns. Avoid `any` where possible.
- **Linter**: Ensure `npm run lint` and `npm run typecheck` pass before completing a task.

## Product Requirements
- **Constraint**: Do not revert existing user-made changes unless explicitly asked.
- **Localization**: Respect the locale; prices must be displayed in **Pesos ($)**.
- **Features**: The UI must support `/instruments`, `/portfolio`, `/search`, and the order flow (BUY/SELL, MARKET/LIMIT, Amount in Pesos, state rules, displaying Order ID/Status).
