#!/bin/bash

timestamp=$(date +"%Y-%m-%d %T")

git add . 
git commit -m "updated circle ci file ${timestamp}" 
git push origin master