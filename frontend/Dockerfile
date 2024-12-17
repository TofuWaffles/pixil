FROM node:22-alpine
WORKDIR /pixil-frontend
COPY . .
RUN npm install
RUN npm run build
CMD ["npx", "serve", "dist"]
