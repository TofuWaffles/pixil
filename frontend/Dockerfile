FROM node:22-alpine
WORKDIR /frontend
COPY . .
ARG DOMAIN_URL
ENV VITE_DOMAIN_URL=${DOMAIN_URL}
RUN npm install
RUN npm run build
CMD ["npx", "serve", "-s", "dist"]
