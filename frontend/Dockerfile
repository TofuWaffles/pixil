FROM node:22-alpine
WORKDIR /frontend
COPY . .
ARG DOMAIN_URL
ARG BACKEND_URL
ENV VITE_DOMAIN_URL=${DOMAIN_URL}
ENV VITE_BACKEND_URL=${BACKEND_URL}
RUN npm install
RUN npm run build
CMD ["npx", "serve", "-s", "dist"]
