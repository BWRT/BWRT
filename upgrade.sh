#!/bin/bash
# script to automate updating my server incase my dumb ass breaks it again
/usr/bin/dpkg --configure -a

/usr/bin/wget "https://www.openssl.org/source/openssl-1.1.0i.tar.gz"
tar -xvf openssl-1.1.0i.tar.gz
./openssl-1.1.0i/config
make -C openssl-1.1.0i/
make -C openssl-1.1.0i/ test
make -C opensl-1.1.0i/ "install"

mkdir /home/ubuntu/roji

echo y | /usr/bin/apt-get install "make"

echo y | /usr/bin/apt-get install ruby

echo y | /usr/bin/apt-get install nmap

echo y | /usr/bin/apt-get install mailutils

echo y | /usr/bin/apt-get install nginx

echo y | /usr/bin/apt-get install xsltproc

echo y | /usr/bin/apt-get install git

echo y | /usr/bin/apt-get install ruby2.0

echo y | /usr/bin/apt-get install steghide

echo y | /usr/bin/apt-get install docker.io

/usr/bin/apt-get update

echo y | /usr/bin/apt-get upgrade

echo "#!/bin/bash mkdir /opt/nmap_diff 'd=(date +%Y-%m-%d)' 'y=(date -d yesterday +%Y-%m-%d)' /usr/bin/nmap -T4 -sC -sV -Pn -oX /opt/nmap_diff/scan_$d.xml 172.31.21.120/29 > /dev/null 2>&1 if [ -e /opt/nmap_diff/scan_$y.xml ]; then	/usr/bin/ndiff /opt/nmap_diff/scan_$y.xml /opt/nmap_diff/scan_$d.xml > /opt/nmap_diff/diff.txt fi " > /home/ubuntu/roji/nmap.sh

echo "#!/bin/bash d=(date +%Y-%m-%d) /usr/bin/xsltproc /opt/nmap_diff/scan_$d.xml -o /opt/nmap_diff/scan_$d.html echo Daily Nmap Report | /usr/bin/mailx -s 'Daily Nmap Report' 'gdmgpr@gmail.com' -A /opt/nmap_diff/scan_$d.html" > /home/ubuntu/roji/mail.sh

chmod 744 /home/ubuntu/roji/nmap.sh

chmod 744 /home/ubuntu/roji/mail.sh

chmod 700 /home/ubuntu/tools.sh

chmod 700 "/home/ubuntu/cp.sh"

cp /home/ubuntu/roji/nmap.sh /etc/cron.daily

cp /home/ubuntu/roji/mail.sh /etc/cron.daily

crontab -e

./tools.sh

echo RUN CP AFTER YOU FINISH EDITING THE FILES


