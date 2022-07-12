FROM node AS builder

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/build .

CMD ["nginx", "-g", "daemon off;"]