# stage: dependencies
FROM node:20 AS dependencies

WORKDIR /app/
COPY package.json /app/ 
RUN npm install

COPY ./ /app/
CMD node index.js