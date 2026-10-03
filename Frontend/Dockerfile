FROM node:20-alpine AS build

ARG VITE_API_URL=http://localhost:5000

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ENV NODE_ENV=production
ENV VITE_API_URL=${VITE_API_URL}

RUN echo "Building with VITE_API_URL=${VITE_API_URL}" \
    && case "${VITE_API_URL}" in *localhost*) echo "WARNING: VITE_API_URL points to localhost. Set it to your deployed backend URL (e.g. https://your-backend.onrender.com) before deploying." ;; esac \
    && npm run build

FROM nginx:alpine

ENV PORT=10000

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 10000

CMD ["nginx", "-g", "daemon off;"]
