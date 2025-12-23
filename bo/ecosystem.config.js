module.exports = {
  apps: [
    {
      name: "marxgeek-academy-bo",
      script: "npm",
      args: "run start",
      cwd: "/var/www/marxgeek/marxgeek.com/bo",
      interpreter: "node",
      autorestart: false,
      env: {
        NODE_ENV: "production",
        PORT: 3002
      }
    }
  ]
};
