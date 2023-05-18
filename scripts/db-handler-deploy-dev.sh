cd lambdas/ && npm run build &&
cd db-handler/dist && zip -r db-handler.zip * && cd ../../.. &&
aws lambda update-function-code --function-name db-handler --region eu-central-1 --zip-file fileb://lambdas/db-handler/dist/db-handler.zip --output text
aws lambda wait function-updated --function-name db-handler
aws lambda update-function-configuration --function-name db-handler  --output text
aws lambda wait function-updated --function-name db-handler
VERSION=$(aws lambda publish-version --function-name db-handler --description 'dev' --output text --query Version)
aws lambda update-alias --function-name db-handler --name dev --function-version $VERSION