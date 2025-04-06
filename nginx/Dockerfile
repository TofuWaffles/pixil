FROM nginx:1.17.8-alpine
COPY ./nginx.conf.template /nginx.conf.template
CMD ["/bin/sh" , "-c" , "envsubst < /nginx.conf > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]
