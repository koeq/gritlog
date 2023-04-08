tsc lambdas/auth-handler/index.ts
cd lambdas/auth-handler && zip -r  auth-handler.zip * -x *.ts utils/*.ts package-lock.json package.json   && cd ../..
aws lambda update-function-code --function-name auth-handler --region eu-central-1 --zip-file fileb://lambdas/auth-handler/auth-handler.zip --output text
aws lambda wait function-updated --function-name auth-handler
aws lambda update-function-configuration --function-name auth-handler 
aws lambda wait function-updated --function-name auth-handler
VERSION=$(aws lambda publish-version --function-name auth-handler --description 'prod' --output text --query Version)
aws lambda update-alias --function-name auth-handler --name prod --function-version $VERSION