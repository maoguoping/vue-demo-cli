#! /usr/bin/env node
console.log('vue-demo-cli start');
const clone = require('git-clone');
const program = require('commander');
const shell = require('shelljs');
const log = require('tracer').colorConsole();
const handlebars = require('handlebars');
const fs = require('fs-extra');
const ora = require('ora');
const inquirer = require('inquirer');
const chalk = require('chalk');
const symbols = require('log-symbols');
const spinner = ora();
program
    .version('1.0.0', "-V, --version")
    .description('vue-demo-cli构建工具')
program
    .command('* <tpl> <project>')
    .action(function(tpl, project) {
        if (tpl && project) {
            let pwd = shell.pwd()
            let projectPath = `${pwd}/${project}`
            let isHasDir = fs.existsSync(projectPath);
            if(isHasDir){
                spinner.fail('当前目录已存在!');
            } else {
                inquirer.prompt([
                    {
                        name: 'description',
                        message: '请输入项目描述'
                    },
                    {
                        name: 'author',
                        message: '请输入作者名称'
                    }
                ]).then(data => {
                    const spinner = ora(`正在拉取模板代码，下载位置：${projectPath}/ ...`);
                    spinner.start();
                    clone(`https://github.com/maoguoping/${tpl}.git`, `${projectPath}`, null, function() {
                        spinner.succeed();
                        shell.rm('-rf', `${projectPath}/.git`)
                        const packageJsonPath = `${projectPath}/package.json`;
                        console.log(symbols.success, chalk.green(`${packageJsonPath}`));
                        const meta = {
                            name: project,
                            description: data.description,
                            author: data.author
                        }
                        if(fs.existsSync(packageJsonPath)){
                            const content = fs.readFileSync(packageJsonPath).toString();
                            const result = handlebars.compile(content)(meta);
                            fs.writeFileSync(packageJsonPath, result);
                            console.log(symbols.success, chalk.green(`修改${packageJsonPath}`));
                        }
                        console.log(symbols.success, chalk.green('项目初始化完成'));
                    })
                }) 
            }
        } else {
            console.log(symbols.fail, chalk.red('正确命令例子：vue-demo-cli vue-demo myproject'));
        }
    })
program.parse(process.argv)