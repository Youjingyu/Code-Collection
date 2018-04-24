## docker
- 配置docker加速镜像
Docker For Mac  
右键点击桌面顶栏的 docker 图标，选择 Preferences ，在 Daemon 标签（Docker 17.03 之前版本为 Advanced 标签）下的 Registry mirrors 列表中加入镜像地址: http://密匙.m.daocloud.io，密匙是http://www.daocloud.io提供的  
或者在pull时加上镜像地址：  
```bash
docker pull registry.docker-cn.com/myname/myrepo:mytag
```