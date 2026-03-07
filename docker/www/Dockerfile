FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g typescript nodemon ts-node prisma@5

WORKDIR /usr/src/app

COPY ./package.json .
COPY ./package-lock.json .
COPY ./prisma ./prisma
RUN npm install
COPY ./www ./www
RUN cd www && npm install && npm run build

EXPOSE 80

CMD ["bash", "-c", "cd www && npm run start:production"]
