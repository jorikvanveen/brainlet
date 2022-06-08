npm run build &&
zip -r build build &&
scp package.json jorik-vv:~/services/brainlet &&
scp build.zip jorik-vv:~/services/brainlet &&
scp .env jorik-vv:~/services/brainlet/build &&
ssh jorik-vv "cd ~/services/brainlet && bash extract.sh" &&
ssh jorik-vv "cd ~/services/brainlet && npm i" &&
#ssh jorik-vv "cd ~/services/brainlet && pm2 restart index.js"
rm build.zip
