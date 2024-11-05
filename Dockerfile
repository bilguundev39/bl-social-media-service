FROM node:18.16.0-alpine
RUN mkdir /home/node/social-media-service
WORKDIR /home/node/social-media-service
COPY . /home/node/social-media-service/
ENV NODE_ENV=dev
RUN npm install
RUN npm update
RUN npm audit --fix
CMD ["npm", "run", "start-dev"]