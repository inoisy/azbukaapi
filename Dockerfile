FROM node:11.1.0-alpine

WORKDIR /usr/src/api

RUN echo "unsafe-perm = true" >> ~/.npmrc

# COPY package.json ./

# RUN cd /usr/src/api && npm install --unsafe-perm

# RUN cd /usr/src/api && npm run setup

COPY . .

RUN npm install --unsafe-perm

EXPOSE 8080

COPY healthcheck.js ./

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s \
    CMD node /usr/src/api/healthcheck.js

CMD [ "node", "server.js" ]