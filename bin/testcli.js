#!/usr/bin/env node
const program = require("commander");

program
  .version(require("../package").version)
  .usage("<command> [options] 快速启动项目"); //-h 打印的用户提示

program
  .command("init [project_name]")
  .description("init a new project")
  .option('-pv, --project_version <project_version>', 'project version')//选项
  .alias("i")
  .action((project_name, options) => {
    require('./testcli-init')(project_name, options)
  });

program
  .command("build <env> <size>")
  .description("build web site for deployment")
  .option("--ev [version]", "env version")
  .action((env, size, options) => {
    console.log("build-env", env);
    console.log("build-size", size);
    console.log("build-options", options);
    return;
  });

program
  .command("deploy")
  .description("deploy web site to production")
  .action(() => {
    console.log("deploy");
  });

program.parse(process.argv);

const options = program.opts();
const args = program.args;

// console.log("----- options", options);
// console.log("----- args", args);
