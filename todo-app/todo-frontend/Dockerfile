# The first FROM is now a stage called build-stage
FROM node:16 AS base

WORKDIR /usr/src/app

COPY package.json package.json
COPY package-lock.json package-lock.json

FROM base as test
RUN npm ci
COPY . .
ENV CI=true
RUN npm test

FROM base as prod
COPY . .
ENV REACT_APP_BACKEND_URL=http://localhost:8080/api
RUN npm ci --production
RUN npm run build

FROM nginx:1.20-alpine
COPY --from=prod /usr/src/app/build /usr/share/nginx/html