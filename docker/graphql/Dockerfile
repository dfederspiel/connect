FROM node:16

WORKDIR /usr/src/app

RUN npm install -g typescript nodemon ts-node prisma

COPY ./package.json .
COPY ./package-lock.json .
COPY ./tsconfig.json .
COPY ./prisma ./prisma
COPY ./lib ./lib
RUN npm install
RUN prisma generate
COPY ./graphql ./graphql
RUN cd graphql && npm install

EXPOSE 4000

CMD ["bash", "-c", "cd graphql && npm run start:production"]
