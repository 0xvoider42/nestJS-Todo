FROM node:18-alpine

WORKDIR /main

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm","run", "start:dev"]