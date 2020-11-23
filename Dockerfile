FROM node:14.15.1-alpine3.10
WORKDIR /app
ADD package*.json /app/package.json
RUN yarn config set registry https://registry.npm.taobao.org
RUN yarn
ADD . /app
RUN yarn run build
EXPOSE 3000
CMD ["yarn","run","start:prod"]