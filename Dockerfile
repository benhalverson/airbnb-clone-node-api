FROM node:12.12.0

WORKDIR /app

COPY package.json .
RUN npm i
COPY . .
CMD ["npm", "run", "start"]