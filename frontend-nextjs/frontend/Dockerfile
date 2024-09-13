FROM node:20
WORKDIR /app
COPY . /app
WORKDIR /app/travelsite
RUN npm install
EXPOSE 3000
CMD npm --prefix /app/travelsite run dev
