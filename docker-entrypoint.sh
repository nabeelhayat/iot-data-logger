#!/bin/sh

# Wait for the database to be ready
echo "Waiting for database to be ready..."
/usr/src/app/node_modules/.bin/wait-on $DATABASE_URL -t 60000

# Run Prisma migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting the application..."
yarn start:dev