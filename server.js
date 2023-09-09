var exec = require("child_process").exec;

const fs = require('fs');
const os = require("os");
const path = require("path");

const startScriptPath = './nezha.sh';
try {
  fs.chmodSync(startScriptPath, 0o777);
  console.log(`赋权成功: ${startScriptPath}`);
} catch (error) {
  console.error(`赋权失败: ${error}`);
}


// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // set this to true for detailed logging:
  logger: false,
});

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// fastify-formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// point-of-view is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

// Our main GET home page route, pulls from src/pages/index.hbs
fastify.get("/", function (request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = {
    greeting: "Hello Node!",
  };
  // request.query.paramName <-- a querystring example
  return reply.send("hello world !");
});

// A POST route to handle form submissions
fastify.post("/", function (request, reply) {
  let params = {
    greeting: "Hello Form!",
  };
  // request.body.paramName <-- a form post example
  return reply.send("hello world !!");
});

// Run the server and report out to the logs
fastify.listen(
    { port: process.env.PORT, host: "0.0.0.0" },
    function (err, address) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Your app is listening on ${address}`);
    }
);

fastify.get("/nezha", function (request, reply) {

  let cmdStr = "/bin/bash nezha.sh >/dev/null 2>&1 &";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      reply.send("哪吒客户端部署错误：" + err);
    } else {
      reply.send("哪吒客户端执行结果：" + "启动成功!");
    }
  });
});

fastify.get("/status", function (request, reply) {
  let cmdStr = "ps -ef";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      reply.type("html").send("<pre>命令行执行错误：\n" + err + "</pre>");
    } else {
      reply.type("html").send("<pre>系统进程表：\n" + stdout + "</pre>");
    }
  });
});

fastify.get("/info", function (req, res) {
  let cmdStr = "cat /etc/*release | grep -E ^NAME";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.send("命令行执行错误：" + err);
    }
    else {
      res.send(
          "命令行执行结果：\n" +
          "Linux System:" +
          stdout +
          "\nRAM:" +
          os.totalmem() / 1000 / 1000 +
          "MB"
      );
    }
  });
});

let cmdStr = "/bin/bash nezha.sh >/dev/null 2>&1 &";
exec(cmdStr, function (err, stdout, stderr) {
  if (err) {
    reply.send("哪吒客户端部署错误：" + err);
  } else {
    reply.send("哪吒客户端执行结果：" + "启动成功!");
  }
});

