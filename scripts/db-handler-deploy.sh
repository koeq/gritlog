tsc lambdas/db-handler/index.ts
cd lambdas/db-handler && zip -r  db-handler.zip * -x *.ts utils/*.ts package-lock.json package.json   && cd ../..
aws lambda update-function-code --function-name db-handler --region eu-central-1 --zip-file fileb://lambdas/db-handler/db-handler.zip --output text
#DEV
aws lambda wait function-updated --function-name db-handler
aws lambda update-function-configuration --function-name db-handler  --output text
aws lambda wait function-updated --function-name db-handler
VERSION=$(aws lambda publish-version --function-name db-handler --description 'dev' --output text --query Version)
aws lambda update-alias --function-name db-handler --name dev --function-version $VERSION
#PROD
aws lambda wait function-updated --function-name db-handler
aws lambda update-function-configuration --function-name db-handler 
aws lambda wait function-updated --function-name db-handler
VERSION=$(aws lambda publish-version --function-name db-handler --description 'prod' --output text --query Version)
aws lambda update-alias --function-name db-handler --name prod --function-version $VERSION