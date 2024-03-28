<!--
 * @Author: rk
 * @Description:
 * @Date: 2024-03-01 18:23:34
 * @LastEditors: rk
 * @LastEditTime: 2024-03-06 17:26:21
-->

## 搭建 ec-cli 脚手架

说明：该脚手架可以创建三套后台管理模板，分别是[vue2Template](https://github.com/ec-cli/vue2Template)、[vue3Template](https://github.com/ec-cli/vue3Template)、[vue3TsTemplate](https://github.com/ec-cli/vue3TsTemplate)。

### 安装

```shell
# use npm
npm install -g ec-cli

# or yarn
yarn global add ec-cli
```

### 使用

#### 快速开始

```shell
ec create <name> [-f|--force]
```

#### 选项

-`-f,--force`: 如果项目存在则重写
