echo "Deploy starting..."

git pull

yarn || exit

BUILD_DIR=temp yarn build || exit

if [ ! -d "temp" ]; then
  echo '\033[31m temp Directory not exists!\033[0m'
  exit 1;
fi

rm -rf build

mv temp build

pm2 restart ecosystem.config.js

echo "Deploy done."
