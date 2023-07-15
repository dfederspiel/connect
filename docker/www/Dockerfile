FROM node:16

RUN npm install -g typescript nodemon ts-node prisma

WORKDIR /usr/src/app

COPY ./package.json .
COPY ./package-lock.json .
COPY ./prisma ./prisma
RUN npm install
COPY ./www ./www
RUN cd www && npm install && npm run build

EXPOSE 80

CMD ["bash", "-c", "cd www && npm run start:production"]
