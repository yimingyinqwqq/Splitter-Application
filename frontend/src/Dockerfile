FROM  node:17-alpine as builder
WORKDIR /app
RUN apk update && apk add git
COPY package*.json .
RUN ls -l
RUN npm install
RUN yarn build
COPY . .

FROM nginx:1.19.0
WORKDIR /user/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]