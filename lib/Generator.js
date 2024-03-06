/*
 * @Author: rk
 * @Description:
 * @Date: 2024-03-06 11:07:44
 * @LastEditors: rk
 * @LastEditTime: 2024-03-06 12:21:03
 */

const { getRepoList, getTagList } = require("./http");
const ora = require("ora");
const inquirer = require("inquirer");
const util = require("util");
const path = require("path")
const downloadGitRepo = require("download-git-repo"); // 不支持promise
const chalk = require("chalk");

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  // 使用ora初始化，传入信息message
  const spinner = ora(message);
  // 开始加载动画
  spinner.start();

  try {
    // 执行传入方法fn
    const result = await fn(...args);
    // 状态为修改成功
    spinner.succeed();
    return result;
  } catch (error) {
    // 状态修改为失败
    spinner.fail("Resquest failed,refetch ...");
  }
}

class Generator {
  constructor(name, targetDir) {
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;

    // 对download-git-repo进行promise化改造
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  // 获取用户选择的模板
  // 1、从远程拉去模板数据
  // 2、用户选择自己新下载的模板名称
  // 3、return 用户选择的名称
  async getRepo() {
    // 从远程拉取模板数据
    const repoList = await wrapLoading(getRepoList, "waiting fetch template");
    if (!repoList) return;

    // 过滤我们需要的模板名称
    const repos = repoList.map((item) => item.name);

    // 用户选择自己新下载的模板名称
    const { repo } = await inquirer.prompt({
      type: "list",
      name: "repo",
      message: "请选择要下载的模板",
      choices: repos,
    });

    // return 用户选择的名称
    return repo;
  }

  // 获取用户选择的版本
  // 1、基于repo的结果，远程拉取对应的tag列表
  // 2、用户选择自己需要下载的tag
  // 3、return 用户选择的tag
  async getTag(repo) {
    // 基于repo的结果，远程拉取对应的tag列表
    const tags = await wrapLoading(getTagList, "waiting fetch tag", repo);
    if (!tags) return;

    // 过滤我们需要的tag名称
    const tagList = tags.map((item) => item.name);

    // 用户选择自己需要下载的tag
    const { tag } = await inquirer.prompt({
      type: "list",
      name: "tag",
      message: "请选择要下载的模板",
      choices: tagList,
    });
    // return 用户选择的tag
    return tag;
  }
  // 核心创建逻辑
  // 1、获取模板名称
  // 2、获取tag名称
  // 3、下载模板到模板目录

  // 下载远程模板
  // 1、拼接下载地址
  // 2、调用下载方法
  async download(repo, tag) {
    // 拼接下载地址
    const requestUrl = `ec-cli/${repo}${tag ? "#" + tag : ""}`;

    // 调用下载方法
    await wrapLoading(
      this.downloadGitRepo,
      "waiting download template",
      requestUrl,
      path.resolve(process.cwd(), this.targetDir)
    );
  }

  async create() {
    // 获取模板名称
    const repo = await this.getRepo();

    // 获取tag名称
    const tag = await this.getTag(repo);

    // 下载模板到模板目录
    await this.download(repo, tag);

    // 模板使用提示
    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
    console.log(`\r\n cd ${chalk.cyan(this.name)}`)
    console.log(' npm run dev\r\n')
  }
}

module.exports = Generator;
