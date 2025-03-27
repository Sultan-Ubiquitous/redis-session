
# Needed enviornment variables

Redis is set on docker using this command: 
docker run -d --name redis-stack -p <SEND REDIS REQUESTS PORT>:<SEND REDIS REQUESTS PORT> -p <REDIS HOSTED PORT>:<REDIS HOSTED PORT> redis/redis-stack:latest

PORT=

OAUTH_PORT=
OAUTH_CLIENT_ID=
OAUTH_CLIENT_SECRET=
OAUTH_REDIRECT_URL=

REDIS_HOST=
REDIS_PORT=


Please use connect-redis version 6 and redis version 3 only
npm i connect-redis@6 redis@3.0.0
