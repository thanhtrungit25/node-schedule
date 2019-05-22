# Clone this project
$ git clone
# Install dependenciees
$ npm install

# Create config file from config folder
$ touch default.js

# Config constructure
{
  "appId" : [YOUR APP ID]",
  "appSecret": [YOUR APP SECRET]",
  "sessionSecret" : "[SESSION SECRET]",
  "callbackURL" : "https://localhost:8888/login/facebook/callback",
  "scheduler_timezone" : "Asia/Karachi"
}

# Run app
- run server
$ npm run dev-server
- run client
$ npm run watch

![schedule login facebook](https://github.com/thanhtrungit25/images/blob/master/schedule_login_fb.png)
![schedule post create](https://github.com/thanhtrungit25/images/blob/master/schedule_post_create.png)
![schedule posts](https://github.com/thanhtrungit25/images/blob/master/schedule_posts.png)

