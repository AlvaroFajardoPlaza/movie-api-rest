FROM node:18

#RUN npm install -y

COPY src/app.js /app.js

CMD ["src/app.js" ]