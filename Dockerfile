FROM node:12.20.1

WORKDIR /app

COPY package.json .
RUN npm i
COPY . .
CMD ["npm", "run", "start"]