#!/bin/bash

# Define the directory containing your Lambda function handlers
HANDLER_DIR="src/handlers"

# Create a dist directory if it doesn't exist
mkdir -p dist

# Loop through each TypeScript file in the handlers directory
for HANDLER_FILE in $HANDLER_DIR/*.ts; do
  # Get the base name of the handler file (e.g., getProfile from getProfile.ts)
  HANDLER_NAME=$(basename "$HANDLER_FILE" .ts)

  echo "Packaging $HANDLER_NAME..."

  # Compile the specific handler to JavaScript
  yarn tsc --outDir dist/$HANDLER_NAME --module commonjs $HANDLER_FILE

  # Navigate to the handler's compiled JavaScript directory
  cd dist/$HANDLER_NAME

  # Zip the contents into a deployment package
  zip -r ../$HANDLER_NAME.zip .

  # Return to the root directory
  cd ../..
done
