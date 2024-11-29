FROM node:22

# Create app directory
WORKDIR /usr/src/app

# Enable Corepack and prepare Yarn version
RUN corepack enable
RUN corepack prepare yarn@4.5.2 --activate

# Install app dependencies
COPY package*.json yarn.lock ./

RUN yarn install --frozen-lockfile

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "yarn", "start" ]