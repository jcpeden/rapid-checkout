FROM node:lts
LABEL maintainer "Ray Ch<i@iraycd.com>"
# Set the working directory
WORKDIR /app
# Copy project specification and dependencies lock files
COPY package.json yarn.lock ./

RUN yarn

# Copy app sources
COPY . .

# Expose application port
EXPOSE 3000
# In production environment
ENV NODE_ENV production
RUN yarn run build
# Run
CMD ["yarn", "start"]
