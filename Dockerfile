FROM ubuntu:focal

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update -y \
&& apt-get install -y curl gnupg ca-certificates xvfb libgl1-mesa-dev build-essential libxi-dev libglu-dev libglew-dev pkg-config git python
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - 
RUN apt-get install -y nodejs

WORKDIR /app

COPY package.json ./
RUN npm install --production
COPY draw.js ./
COPY glUtil.js ./

ENV DISPLAY :0
CMD [ "sh", "-c", "xvfb-run -s '-ac -screen 0 1280x1024x24' node /app/draw.js" ]