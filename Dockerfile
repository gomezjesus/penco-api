FROM node:lts

COPY ["package.json","package-lock.json","/usr/src/"]

WORKDIR /usr/src

ENV app_password=1234

RUN npm install

EXPOSE 5000

CMD ["npx","nodemon","index.js"]