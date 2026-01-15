FROM node:24-alpine3.22 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM httpd:2.4-alpine AS runner
COPY --from=builder /app/dist /usr/local/apache2/htdocs/

COPY httpd.conf /usr/local/apache2/conf/extra/doula-app.conf
RUN printf '\nIncludeOptional conf/extra/doula-app.conf\n' >> /usr/local/apache2/conf/httpd.conf

EXPOSE 3000
CMD ["httpd-foreground"]
