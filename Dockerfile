FROM node:12.12.17
WORKDIR /app
COPY package.json .
RUN npm install 
RUN mkdir db
RUN mkdir db_test
COPY . /app
RUN npm run populate
RUN npm test
CMD ["npm", "run", "dev"]