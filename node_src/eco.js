module.exports = {
  apps: [{
    name: 'ols-api',
    script: 'babel-node ./index.js', // Your entry point
    instances: 2,
    autorestart: true, // THIS is the important part, this will tell PM2 to restart your app if it falls over
    max_memory_restart: '1G'
  }]
}