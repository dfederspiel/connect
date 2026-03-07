FROM node:20-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g typescript nodemon ts-node prisma@5

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
