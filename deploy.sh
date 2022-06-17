npm run build &&

# Add telemetry
cp tracing.js build/tracing.js
echo "import 'dotenv'" > build/index_.js
echo "import './tracing.js'" >> build/index_.js
cat build/index.js >> build/index_.js
mv build/index_.js build/index.js

zip -r build build &&
scp package.json jorik-vv:~/services/brainlet &&
scp build.zip jorik-vv:~/services/brainlet &&
scp .env jorik-vv:~/services/brainlet/build &&
ssh jorik-vv "cd ~/services/brainlet && bash extract.sh" &&
ssh jorik-vv "cd ~/services/brainlet && npm i" &&
ssh jorik-vv "pm2 restart index --update-env" &&
rm build.zip
