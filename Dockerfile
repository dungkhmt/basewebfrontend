FROM node:8 as react-build
WORKDIR /app
COPY . ./
RUN npm i
RUN npm run build

FROM nginx:alpine
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
