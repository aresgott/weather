FROM node:alpine
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

WORKDIR /app/dist
EXPOSE 3000

CMD ["node", "main.js"]