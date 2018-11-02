### profile文件
- ./etc/profile:是全局profile文件，设置后会影响到所有用户
- /home/username/.profile或.bash_profile是针对特定用户的，可以针对用户，来配置自己的环境变量
注意:profile是unix上才有的;bash_profile是Linux下有的(Linux下，用户目录没有.profile文件)

### profile文件加载顺序
- 先执行全局的/etc/profile
- 接着bash会检查使用者的HOME目录中，是否有 .bash_profile 或者 .bash_login或者 .profile，若有，则会执行其中一个，执行顺序为：.bash_profile 最优先 > .bash_login其次 > .profile 最后

profile类文件是用户登录是会加载的文件

### ~/.bashrc、~/zshrc

rc类文件是打开bash、zsh命令行时，会加载的文件
