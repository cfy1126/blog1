#!/bin/sh
cd /Users/caoxiao/Desktop/blog1/logs
cp access.log $(date +%y-%m-%d).access.log
echo "" > access.log