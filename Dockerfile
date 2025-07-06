# ---- Build Stage ----
FROM node:lts-alpine AS build

WORKDIR /app

# Install dependencies (including devDependencies)
COPY package*.json ./
RUN npm install

# Copy all files for build context
COPY . .

USER 1000:1000
FROM node:lts-alpine AS production

WORKDIR /app

# Only copy production node_modules and app files from build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/public ./public
COPY --from=build /app/server.js ./

EXPOSE 6001

CMD ["node", "server.js"]