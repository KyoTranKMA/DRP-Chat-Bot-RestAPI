## DRP API 

**Use Coze to create ChatBot for assitants food.**


## Services
- Login with JWT
- Sign up with Email send OTP
- Chatting with Bot
- Chatting with History Conversations
- Update Profile

## Deployment
### Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://drpteam.up.railway.app)


### Zeabur
[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://drpteam.zeabur.app)

### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://drpteam.vercel.app)

**Note:** Vercel's serverless functions have a 10-second timeout limit and it not avaiable for chatting with non-streaming services.


### Local Deployment
1. Set the environment variable on `.env` file
```bash
PORT = XXXX
## Tokens for App
ACCESS_TOKEN_SECRET_KEY = "YOUR_ACCESS_TOKEN_KEY"
REFRESH_TOKEN_SECRET_KEY = "YOUR_REFRESH_TOKEN_KEY"
## Coze Config
COZE_API_KEY = "pat_YOUR_COZE_API_KEY"
COZE_API_URL = "https://api.coze.com/open_api/v2/chat"
BOT_ID = "YOUR_COZE_BOT_ID"
## MongoDB Config
MONGO_URI = "URL_TO_CONNECT_WITH_MONGODB"
## SMPT Config
SMPT_HOST=smtp.gmail.com
SMPT_PORT=465
SMPT_SERVICE=gmail
SMPT_MAIL=YOUR_MAIL
SMPT_APP_PASS=YOUR_APP_PASSWORD



```

2. Install dependencies 
```bash
npm install
```

3. Run the project
```bash
npm start
```

## Usage
1. API Document
- [![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)](https://app.swaggerhub.com/apis/TranQuangDieu/API_Doc_Mobile_App/1.0.0#)


## Roadmap
**Coming Soon**
*   Streaming Chat
*   Image support
*   Audio-to-text
*   Text-to-audio
*   Docker support

**Available Now**
*   Continuous dialogue with the history of chat
*   Zeabur & Vercel & Railway deployment
## Overview Project
<img width="841" alt="Database Server" src="https://github.com/KyoTranKMA/DRP-Chat-Bot-RestAPI/assets/125230579/79d68904-3324-43e4-b77c-7ae5492d9f38">
