# Cocos Nuts - React Native

[![CI](https://github.com/mnofresno/cocos-nuts/actions/workflows/ci.yml/badge.svg)](https://github.com/mnofresno/cocos-nuts/actions/workflows/ci.yml)

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

Con docker compose:
```bash
docker compose up --build
```

## Tests
```bash
npm test
```

## Decisiones técnicas
- Base mínima con tema en `src/theme`.
