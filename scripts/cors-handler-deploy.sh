tsc lambdas/cors-handler/index.ts
cd lambdas/cors-handler && zip -r  cors-handler.zip * -x *.ts utils/*.ts package-lock.json package.json   && cd ../..
aws lambda update-function-code --function-name cors-handler --region eu-central-1 --zip-file fileb://lambdas/cors-handler/cors-handler.zip --output text
aws lambda wait function-updated --function-name cors-handler
aws lambda update-function-configuration --function-name cors-handler 
aws lambda wait function-updated --function-name cors-handler
VERSION=$(aws lambda publish-version --function-name cors-handler  --output text --query Version)
aws lambda update-alias --function-name cors-handler --name prod --function-version $VERSION