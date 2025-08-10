FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --quiet
COPY . .
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "src/index.js"]