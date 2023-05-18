FROM node:16-alpine
WORKDIR /app
COPY package.json .
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \ 
        then ; \
        else npm install --only=production; \
    fi
COPY . ./
CMD [ "node", "index.js" ]