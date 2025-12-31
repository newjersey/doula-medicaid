FROM node:24-alpine3.22 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM httpd:2.4-alpine AS runner
COPY --from=builder /app/dist /usr/local/apache2/htdocs/
# Copy custom config to conf/extra and include it from the main httpd.conf
COPY httpd.conf /usr/local/apache2/conf/extra/doula.conf
RUN printf '\n# Include doula app custom config\nIncludeOptional conf/extra/doula.conf\n' >> /usr/local/apache2/conf/httpd.conf
EXPOSE 8080
CMD ["httpd-foreground"]
