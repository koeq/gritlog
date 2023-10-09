cd api/ && npm run build &&
cd cors-handler/dist && zip -r cors-handler.zip * && cd ../../.. &&
aws lambda update-function-code --function-name cors-handler --region eu-central-1 --zip-file fileb://api/cors-handler/dist/cors-handler.zip --output text
aws lambda wait function-updated --function-name cors-handler
aws lambda update-function-configuration --function-name cors-handler 
aws lambda wait function-updated --function-name cors-handler
VERSION=$(aws lambda publish-version --function-name cors-handler  --output text --query Version)
