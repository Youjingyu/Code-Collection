- git多个ssh
```bash
ssh-keygen -t rsa -C "github邮箱"
ssh-keygen -t rsa -C "公司gitlab邮箱"
ssh-add ~/.ssh/github_rsa
ssh-add ~/.ssh/gitlab_rsa
// 复制公匙到github和gitlab
cat github_rsa.pub
cat gitlab_rsa.pub
```
添加config文件
```bash
#github
Host github.com
HostName github.com
User 735284268@qq.com
IdentityFile ~/.ssh/github_rsa

#gitlab
Host gitlab.weibo.cn
HostName gitlab.weibo.cn
User jingyu16@staff.sina.com.cn
IdentityFile ~/.ssh/gitlab_rsa
```
测试
```bash
ssh -T git@github.com
```