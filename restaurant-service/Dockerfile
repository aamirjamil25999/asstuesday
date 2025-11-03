FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm i --omit=dev
COPY src ./src
ENV PORT=3002
EXPOSE 3002
CMD ["npm", "start"]