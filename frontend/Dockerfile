FROM node:21

ENV GENERATE_SOURCEMAP=false \
    WDS_SOCKET_PORT=10134

WORKDIR /app

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]