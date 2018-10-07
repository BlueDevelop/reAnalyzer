FROM node:8.12.0-jessie
ENV NODE_ENV dev
WORKDIR /usr/src/app
COPY . .
RUN  npm install -g node-gyp node-pre-gyp
RUN  npm install
RUN cd client && npm install && cd ..
EXPOSE 3000
CMD npm start