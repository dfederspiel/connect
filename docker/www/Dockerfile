FROM node:14.15.4

RUN npm install -g typescript nodemon ts-node prisma

WORKDIR /usr/src/app

COPY ./package.json .
COPY ./prisma ./prisma
RUN yarn install
COPY ./www ./www
RUN cd www && yarn install && yarn run build

EXPOSE 80

CMD ["bash", "-c", "cd www && yarn run start:production"]
