// ecosystem.config.js
module.exports = {
    apps: [
      {
        name: "marxgeek-api",
        script: "index.js",        // version compilée
        cwd: "/var/www/marxgeek/marxgeek.com/api",
        watch: false,
        env: {
          NODE_ENV: "production",
          PORT: 5000,
        },
      },
    ],
  };
  