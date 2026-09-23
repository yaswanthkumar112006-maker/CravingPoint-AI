# Build and Run Stage
FROM node:20-alpine
WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build Vite client and backend server bundle
RUN npm run build

EXPOSE 3050
ENV PORT=3050
ENV NODE_ENV=production

CMD ["npm", "start"]
