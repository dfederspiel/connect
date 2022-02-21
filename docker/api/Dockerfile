FROM node:14.15.4

WORKDIR /usr/src/app

RUN npm install -g typescript nodemon ts-node prisma

COPY ./package.json .
COPY ./package-lock.json .
COPY ./tsconfig.json .
COPY ./prisma ./prisma
COPY ./lib ./lib
RUN npm install
RUN prisma generate
COPY ./api ./api
RUN cd api && npm install

EXPOSE 3000

CMD ["bash", "-c", "cd api && npm run start:production"]