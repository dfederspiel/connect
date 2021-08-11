FROM node:14.15.4

WORKDIR /usr/src/app

RUN npm install -g typescript nodemon ts-node prisma

COPY ./package.json .
COPY ./yarn.lock .
COPY ./tsconfig.json .
COPY ./prisma ./prisma
COPY ./lib ./lib
RUN yarn install
RUN prisma generate
COPY ./api ./api
RUN cd api && yarn install

EXPOSE 3000

CMD ["bash", "-c", "cd api && yarn run start:production"]