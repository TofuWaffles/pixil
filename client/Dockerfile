FROM node:22-alpine
WORKDIR /pixil-client/
COPY package.json ./
COPY package-lock.json ./
COPY public/ ./public/
COPY src/ ./src/
RUN npm install
RUN npm run build
CMD ["npx", "serve", "dist"]
