FROM node:latest
WORKDIR /app
COPY package.json .
RUN npm install 
RUN mkdir db
RUN mkdir db_test
COPY . /app
RUN npm run populate
CMD ["npm", "run", "dev"]