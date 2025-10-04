// PM2 Ecosystem Configuration for CSR Dashboard
module.exports = {
  apps: [
    {
      name: 'csr-dashboard',
      script: 'npx',
      args: 'wrangler pages dev dist --ip 0.0.0.0 --port 3000',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false, // Disable PM2 file monitoring (wrangler handles hot reload)
      instances: 1, // Development mode uses only one instance
      exec_mode: 'fork',
      max_restarts: 3,
      restart_delay: 1000
    }
  ]
}