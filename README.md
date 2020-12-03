# GaGaBot :robot:

Discord Bot for the G²B crew server

## How to install and run the bot on server

- create empty directory where the files will be cloned:
`mkdir /var/www/gagabot`

- init bare repo somewhere else:
`git init --bare ~/gagabot.git`

- create/edit the `post-receive` hook:
`nano ~/gagabot.git/hooks/post-receive`

```bash
#!/bin/bash
TARGET="/var/www/gagabot"
GIT_DIR="/home/ubuntu/gagabot.git"
BRANCH="master"

while read oldrev newrev ref
do
        # only checking out the master (or whatever branch you would like to deploy)
        if [ "$ref" = "refs/heads/$BRANCH" ];
        then
                echo "Ref $ref received. Deploying ${BRANCH} branch to production..."
                git --work-tree=$TARGET --git-dir=$GIT_DIR checkout -f $BRANCH
                cd $TARGET && npm install
                # pm2 restart RD72_Bot
        else
                echo "Ref $ref received. Doing nothing: only the ${BRANCH} branch may be deployed on this server."
        fi
done
```

- add new remote on local repo:
`git remote add production USER@IP:gagabot.git`

- push some changes to new remote to trigger the `post-receive` hook on server:
`git push production`

- if needed, create the `.env` file in the cloned directory

- start a new named task with PM2:
`pm2 start /var/www/gagabot/index.js --name "GaGaBot"`

- check that process is running along with others if applicable:
`pm2 list`

- save PM2 processes:
`pm2 save`

- uncomment line 14 in the `post-receive` hook to automatically restart the process when changes are pushed

