FROM node:latest

WORKDIR /usr/src/app

RUN npm install -g typescript nodemon ts-node @prisma/cli

COPY . .
RUN yarn install
RUN cd www && yarn install && yarn run build
RUN cd server && yarn install

EXPOSE 3000
# CMD [ "ts-node", "./server/index.ts" ]

CMD ["bash", "-c", "prisma migrate deploy --preview-feature && ts-node ./server/index.ts"]