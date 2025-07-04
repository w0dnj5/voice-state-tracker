# Voice State Tracker Bot

Discord.js, Node.js, Prisma 및 MySQL을 사용하여 구축된 간단한 Discord 봇입니다.

# 기능

- 음성 채널 활동 로그 기록: 사용자의 음성 채널 접속 및 이탈 시간을 데이터베이스에 자동으로 기록합니다.

- 주기적인 데이터베이스 동기화: 30초마다 수집된 음성 로그 데이터를 배치 처리하여 데이터베이스에 효율적으로 저장합니다.

- 리더보드: 1시간마다 접속시간 로그를 분석하여 순위표에 반영합니다.

- Discord 명령어 처리: /명령어를 통해 봇과 상호작용하고 서버 내 접속시간 순위를 확인할 수 있습니다.

- 데이터베이스 삭제: 봇이 서버에서 추방 시 해당 서버의 기록을 삭제합니다.

# 명령어

`/랭크` - 서버 내 음성채널 접속시간 TOP 3를 알려줍니다.

# 사용 방법

### 1. 필수 설치 요소

- Node.js
- MySQL 데이터베이스 서버
- Git

### 2. Git 복제

```
git clone https://github.com/w0dnj5/voice-state-tracker
cd voice-state-tracker
```

### 3. 환경 변수 설정 (`.env`)


```
DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN_HERE
CLIENT_ID=YOUR_CLIENT_ID_HERE
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
```

### 4. Prisma 마이그레이션

```
npx prisma migrate dev --name init
```

### 5. 봇 슬래시 명령어 업로드

```
node deploy-commands.js
```


### 6. 실행

```
node index.js
```