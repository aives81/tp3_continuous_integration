FROM node:22

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json yarn.lock ./

# Activer Corepack pour gérer la version de Yarn
RUN corepack enable && corepack prepare yarn@4.5.2 --activate && yarn install

RUN yarn install --frozen-lockfile

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "yarn", "start" ]