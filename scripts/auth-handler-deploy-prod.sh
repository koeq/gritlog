cd api/ && npm run build &&
cd auth-handler/dist && zip -r auth-handler.zip * && cd ../../.. &&
aws lambda update-function-code --function-name auth-handler --region eu-central-1 --zip-file fileb://api/auth-handler/dist/auth-handler.zip --output text
aws lambda wait function-updated --function-name auth-handler
aws lambda update-function-configuration --function-name auth-handler  --output text
aws lambda wait function-updated --function-name auth-handler
VERSION=$(aws lambda publish-version --function-name auth-handler --description 'prod' --output text --query Version)
aws lambda update-alias --function-name auth-handler --name prod --function-version $VERSION