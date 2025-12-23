module.exports = {
  apps: [
    {
      name: "marxgeek-academy",
      script: "npm",
      args: "run start",
      cwd: "/var/www/marxgeek.com/site",
      interpreter: "node",
      autorestart: false,
      env: {
        NODE_ENV: "production",
        PORT: 3001
      }
    }
  ]
};
