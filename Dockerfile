FROM node:11.1.0-alpine

WORKDIR /usr/src/api

RUN echo "unsafe-perm = true" >> ~/.npmrc

# COPY package.json package-lock.json ./
RUN cd /usr/src/api

COPY package.json ./

RUN yarn

COPY . .

EXPOSE 1337

COPY healthcheck.js ./

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s \
    CMD node /usr/src/api/healthcheck.js

CMD [ "node", "server.js" ]