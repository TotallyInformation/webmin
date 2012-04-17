#! /bin/bash
rm /root/.forever/forever-webmin-https.log

rm logs/forever-out-1.log
mv logs/forever-out.log logs/forever-out-1.log

rm logs/forever-err-1.log
mv logs/forever-err.log logs/forever-err-1.log

forever -w -l forever-webmin-https.log -o logs/forever-out.log -e logs/forever-err.log start app.js 
