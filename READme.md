npm init 
npm install --save-dev nodemon chai mocha sinon 
npm install -g win-node-env
npm i dotenv
npm i express express-validator body-parser mongoose mongoose-unique-validator bcryptjs jsonwebtoken 
npm i fast-two-sms cors passport cookie-session passport-google-oauth20 helmet compression morgan 


# authentication 
    -http://localhost:5000/auth/google =>auth with google acc and create acc for you in our web app 
    -http://localhost:5000/user/signup =>normal auth send yor data in req.body {name,email,pass,number}