FROM node:20-alpine

ENV NODE_ENV=production
ENV PORT=10000
ENV HOST=0.0.0.0

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY . .

RUN mkdir -p /app/uploads && chown -R node:node /app

USER node

EXPOSE 10000

CMD ["node", "server.js"]
