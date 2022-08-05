echo "Deploy starting..."

yarn || exit

mkdir -p temp

BUILD_DIR=temp yarn build || exit

if [ ! -d "temp" ]; then
  echo '\033[31m temp Directory not exists!\033[0m'  
  exit 1;
fi

rm -rf .next

cp -rf temp .next

pm2 reload nami-exchange-web-v2

echo "Deploy done."