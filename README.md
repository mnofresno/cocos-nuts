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
- Hooks dedicados (`useInstruments`, `usePortfolio`) para separar data fetching del render.
- Cálculos de portfolio centralizados en `src/lib/portfolio.ts` para testear métricas clave.
