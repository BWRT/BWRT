#!/bin/bash
/usr/bin/apt install awscli
/usr/bin/git clone "https://github.com/iagox86/dnscat2.git"
/usr/bin/git clone "https://github.com/FortyNorthSecurity/EyeWitness.git"
/usr/bin/git clone "https://github.com/robertdavidgraham/masscan.git"
/usr/bin/git clone "https://github.com/breenmachine/httpscreenshot.git"
/usr/bin/git clone "https://github.com/christophetd/censys-subdomain-finder.git"
/usr/bin/git clone "https://github.com/cheetz/sslScrape.git"
/usr/bin/git clone "https://github.com/leebaird/discover"
/usr/bin/git clone "https://github.com/guelfoweb/knock.git"
/usr/bin/git clone "https://github.com/aboul3la/Sublist3r.git"
/usr/bin/git clone "https://github.com/TheRook/subbrute.git"
/usr/bin/git clone "https://github.com/dxa4481/truffleHog.git"
/usr/bin/git clone "https://github.com/anshumanbh/git-all-secrets.git"
/usr/bin/git clone "https://github.com/koenrh/s3enum"
/usr/bin/git clone "https://github.com/anshumanbh/tko-subs.git"
/usr/bin/git clone "https://github.com/nahamsec/HostileSubBruteforcer.git"
/usr/bin/git clone "https://github.com/JordyZomer/autoSubTakeover.git"
/usr/bin/git clone "https://github.com/SimplySecurity/SimplyEmail.git"
/usr/bin/wget "https://rubygems.org/downloads/trollop-2.9.9.gem"
/usr/bin/wget "https://rubygems.org/downloads/salsa20-0.1.2.gem"
/usr/bin/wget "https://rubygems.org/downloads/sha3-1.0.1.gem"
/usr/bin/wget "https://rubygems.org/downloads/ecdsa-1.2.0.gem"
/usr/bin/wget "https://files.pythonhosted.org/packages/e4/96/a598fa35f8a625bc39fed50cdbe3fd8a52ef215ef8475c17cabade6656cb/dnspython-1.15.0.zip"
/usr/bin/wget "https://digi.ninja/files/bucket_finder_1.1.tar.bz2" -O bucket_finder_1.1.tar.bz2
/usr/bin/gem install "/home/ubuntu/trollop-2.9.9.gem"
/usr/bin/gem install "/home/ubuntu/salsa20-0.1.2.gem"
/usr/bin/gem install "/home/ubuntu/sha3-1.0.1.gem"
/usr/bin/gem install "/home/ubuntu/ecdsa-1.2.0.gem"
#/usr/bin/go get  "github.com/koenrh/s3enum"
/usr/bin/tar -xvf bucket_finder_1.1.tar.bz2
make -C dnscat2/
make -C masscan/
/usr/bin/bash "/home/ubuntu/EyeWitness/setup.sh"
/usr/bin/bash "/home/ubuntu/httpscreenshot/install-dependencies.sh"
/usr/bin/bash "/home/ubuntu/SimplyEmail/setup/setup.sh"
/usr/bin/pip install censys
/usr/bin/pip install -r "/home/ubuntu/Sublist3r/requirements.txt" -r "/home/ubuntu/truffleHog/requirements.txt"
/usr/bin/unzip "dnspython-1.15.0.zip"
/usr/bin/python /home/ubuntu/dnspython-1.15.0/setup.py build
/usr/bin/python /home/ubuntu/dnspython-1.15.0/setup.py install
$(sleep 30s)
echo GO TO AWS TO GET A FREE ACCESS KEY AND STORE IT IN A SAFE PLACE ON YOUR COMPUTER
/usr/bin/aws configure
echo PLEASE DO NOT REBOOT
$(sleep 20s)
$(do-release-upgrade)
echo NOW REBOOTING TO APPLY CHANGES EDIT SCRIPTS AND RUN CP
$(reboot)
