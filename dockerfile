FROM node:8.12.0-jessie
ENV NODE_ENV dev
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "tsconfig.json", "./"]
RUN  npm install -g node-gyp node-pre-gyp
RUN  npm install  && mv node_modules ../
COPY . .
EXPOSE 3000
CMD npm start