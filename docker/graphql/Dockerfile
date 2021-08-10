FROM node:14.15.4

WORKDIR /usr/src/app

RUN npm install -g typescript nodemon ts-node prisma

COPY ./package.json .
COPY ./yarn.lock .
COPY ./prisma ./prisma
RUN yarn install
RUN prisma generate
COPY ./graphql ./graphql
RUN cd graphql && yarn install

EXPOSE 4000

CMD ["bash", "-c", "cd graphql && yarn run start:production"]
