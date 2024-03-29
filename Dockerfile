FROM node:21.6.2-alpine
WORKDIR /app/lef4cart
RUN npm install -g nodemon
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 8081
CMD [ "npm", "start" ]