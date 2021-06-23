
FROM node:14.17.1 AS build-env
ADD . /app
WORKDIR /app

RUN npm ci --only=production

FROM gcr.io/distroless/nodejs:14.17.1
COPY --from=build-env /app /app
WORKDIR /app
CMD [ "node", "./dist/main.js" ]
