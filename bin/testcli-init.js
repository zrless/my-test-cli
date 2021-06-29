#!/usr/bin/env node

// /Users/macuser/.nvm/versions/node/v14.15.4/bin/node
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const inquirer = require("inquirer");
const dirs = process.cwd().split("/");
const chalk = require("chalk");
const program = require("commander");
const download = require("download-git-repo");
const rimraf = require("rimraf");
const ora = require("ora");
console.log();
const init = async (projectName, options) => {
  console.log(projectName, options);
  console.log(`
  ${chalk.bold.blueBright("Hello My Cli!")}
  - 这是我的第一个脚手架
  `);
  let promptList = [];
  if (!projectName) {
    promptList.push({
      type: "input",
      message: "设置一个项目名:",
      name: "title",
      default: "test-cli", // 默认值
    });
  }

  promptList = promptList.concat([
    {
      type: "input",
      message: "设置一个用户名:",
      name: "name",
      default: "admin", // 默认值
    },
    {
      type: "list",
      message: "设置性别:",
      name: "sex",
      choices: ["👦男", "👩女"],
      validate: (val) => {
        if (!val) {
          return "请输入性别";
        } else {
          return true;
        }
      },
    },

    {
      type: "input",
      message: "设置公司:",
      name: "company",
      default: "收钱吧",
    },
    {
      type: "checkbox",
      message: "你的爱好:",
      name: "hobby",
      choices: [
        {
          name: "吃饭",
          checked: true, // 默认选中
        },
        {
          name: "睡觉",
        },
        {
          name: "打豆豆",
        },
      ],
      validate: (val) => {
        if (!val.length) {
          return "请选择你的爱好";
        } else {
          return true;
        }
      },
    },
    {
      type: "input",
      message: "请输入手机号:",
      name: "phone",
      validate: (val) => {
        if (!val.match(/\d{11}/g)) {
          // 校验位数
          return "请输入11位数字";
        } else {
          return true;
        }
      },
      default: "15050156656",
    },
    {
      type: "password",
      message: "请输入密码:",
      name: "password",
      validate: (val, answers) => {
        const { phone } = answers;
        if (!val) {
          return "请输入密码";
        } else if (val === "1" && phone === "15050156656") {
          return true;
        } else {
          return "密码错误";
        }
      },
    },
  ]);

  /**
   * 1.inquirer 先交互获取用户输入信息并校验
   * 2.获取读取目录templates路径,读取目录下的文件
   * 3.文件循环
   *    1) ejs.renderFile - 把读取目录下的文件中的变量替换渲染
   *    2) fs.writeFileSync - 渲染后的结果写入文件目标目录
   * @returns
   */

  // const answers = await inquirer.prompt(promptList);
  inquirer
    .prompt(promptList)
    .then((res) => {
      const answers = { title: projectName, ...res };
      downloadGitFile()
        .then((res) => {
          //文件读取目录
          const templatesDir = path.resolve(__dirname, "../download-templates");
          //文件写入目标目录
          const destDir = process.cwd();
          readDirsAndFiles(templatesDir, destDir, answers);
        })
        .catch((err) => {
          console.error("下载捕捉到的异常: ", err);
        });
      // //文件读取目录
      // const templatesDir = path.resolve(__dirname, "../templates");
      // //文件写入目标目录
      // const destDir = process.cwd();
      // const files = fs.readdirSync(templatesDir);
      // if (files && files.length) {
      //   files.forEach((file) => {
      //     const filePath = path.join(templatesDir, file);
      //     ejs.renderFile(filePath, answers, (err, res) => {
      //       if (err) {
      //         throw err;
      //       }
      //       const writeFilePath = path.join(destDir, file);
      //       fs.writeFileSync(writeFilePath, res);
      //     });
      //   });
      // }
    })
    .catch((err) => {
      console.error("捕捉到的异常: ", err);
    });

  const readDirsAndFiles = (targetDir, destDir, answers) => {
    fs.readdir(targetDir, (err, files) => {
      if (err) {
        console.warn(err);
      } else {
        if (files && files.length) {
          files.forEach((file) => {
            const filePath = path.join(targetDir, file);
            const writeFilePath = path.join(destDir, file);
            fs.stat(filePath, (err, stats) => {
              if (err) {
                throw new Error(err);
              } else {
                if (stats.isFile()) {
                  if (file.match(/\.(png|jpg)$/)) {
                    fs.writeFileSync(writeFilePath, fs.readFileSync(filePath));
                  } else {
                    ejs.renderFile(filePath, answers, (err, res) => {
                      if (err) {
                        throw err;
                      }
                      fs.writeFileSync(writeFilePath, res);
                    });
                  }
                  // ejs.fileLoader
                  // ejs.resolveInclude
                }
                if (stats.isDirectory()) {
                  console.log(writeFilePath);
                  fs.mkdirSync(writeFilePath);
                  readDirsAndFiles(filePath, writeFilePath, answers);
                }
              }
            });
          });
        }
      }
    });
  };

  const downloadGitFile = () => {
    return new Promise((resolve, reject) => {
      const downloadDir = path.resolve(__dirname, "../download-templates");
      const spinner = ora("Downloading git files!").start();
      if (fs.existsSync(downloadDir)) {
        rimraf(downloadDir, (err) => {
          if (err) {
            chalk.redBright(err);
          }
        });
        // fs.rmdirSync(downloadDir);
      }
      download(
        "direct:https://github.com/zrless/test-webpack-react-demo.git",
        downloadDir,
        { clone: true },
        (err) => {
          console.log(err ? "download Error" : "download Success");
          if (err) {
            reject(err);
          } else {
            // spinner.color = "yellow";
            // spinner.text = "Loading rainbows";
            spinner.succeed("download Success");
            resolve("download Success");
          }
        }
      );
    });
  };
};

module.exports = (...args) => {
  return init(...args).catch((err) => {
    console.error(err);
  });
};
