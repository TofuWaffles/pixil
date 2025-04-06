FROM nginx:1.17.8-alpine
COPY ./nginx.conf /nginx.conf
CMD ["/bin/sh" , "-c" , "envsubst < /nginx.conf > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]
