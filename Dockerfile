
FROM node:16
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=8085
EXPOSE $PORT
CMD ["node", "Server.js"]
