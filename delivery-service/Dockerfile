FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm i --omit=dev
COPY src ./src
ENV PORT=3003
EXPOSE 3003
CMD ["npm", "start"]