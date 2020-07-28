FROM node:12.18.3

WORKDIR /app

COPY package.json .
RUN npm i
COPY . .
CMD ["npm", "run", "start"]