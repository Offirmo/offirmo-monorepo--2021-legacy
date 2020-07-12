# Not needed! Heroku will launch npm start by default
# https://devcenter.heroku.com/articles/nodejs-support#default-web-process-type

# But we may want an optimization:
# http://blog.heroku.com/archives/2015/11/10/node-habits-2016#7-avoid-garbage
web: node --optimize_for_size --max_old_space_size=460 --gc_interval=100 dist/src.es2019.cjs/index.js
