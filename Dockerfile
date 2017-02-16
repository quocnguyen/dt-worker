FROM node:7.5-alpine
MAINTAINER quocnguyen <quocnguyen@clgt.vn>
WORKDIR /src
RUN apk add --no-cache make gcc g++ python
COPY package.json /src
RUN npm install
COPY . /src
EXPOSE 6969
CMD ["npm","start"]
