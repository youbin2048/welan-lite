FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY dist/index.html /usr/share/nginx/html/index.html
COPY dist/app.css /usr/share/nginx/html/app.css
COPY dist/app.js /usr/share/nginx/html/app.js
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chmod 644 /usr/share/nginx/html/index.html \
    /usr/share/nginx/html/app.css \
    /usr/share/nginx/html/app.js

EXPOSE 80
