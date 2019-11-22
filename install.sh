#!/bin/bash
apt-get update
echo 'export PATH=$HOME/local/bin:$PATH' >> ~/.bashrc
. ~/.bashrc
mkdir ~/local
mkdir ~/node-latest-install
cd ~/node-latest-install
curl http://nodejs.org/dist/node-latest.tar.gz | tar xz --strip-components=1
./configure --prefix=~/local
make install 
curl https://www.npmjs.org/install.sh | sh
sudo npm install npm@latest -g
sudo npm install pm2 -g 
sudo npm install -g create-react-app
npm install 
npm start
