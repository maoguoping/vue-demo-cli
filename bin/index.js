#! /usr/bin/env node
console.log('vue-demo-cli start');
const clone = require('git-clone');
const program = require('commander');
const shell = require('shelljs');
const log = require('tracer').colorConsole();
program
    .version('1.0.0')
    .description('vue-demo-cli构建工具')
program
    .command('* <tpl> <project>')
    .action(function(tpl, project) {
        if (tpl && project) {
            let pwd = shell.pwd()
            log.info(`正在拉取模板代码，下载位置：${pwd}/${project}/ ...`)
            clone(`https://github.com/maoguoping/${tpl}.git`, pwd + `/${project}`, null, function() {
                shell.rm('-rf', pwd + `/${project}/.git`)
                log.info('模板工程建立完成')
            })
        } else {
            log.error('正确命令例子：vue-demo-cli vue-demo myproject')
        }
    })
program.parse(process.argv)