## linux调试
系统状态
```bash
# 指标：
# VIRT 进程申请但可能没有使用的内存；
# RES 实际使用的内存；
# SHR 与其他进程共享的内存（比如两个进程复用了一个系统so）
top
```

查看单个进程状态
```bash
top -p <pid>
```

查看内存占用
```bash
free -m
            total       used       free     shared    buffers     cached
Mem:      49406140   48352948    1053192          0      96524   35946452
-/+ buffers/cache:   12309972   37096168
Swap:            0          0          0

# 49406140：总物理内存
# 48352948：当前被系统调度的内存
# 1053192：未被系统调度的内存
# 96524：用于读取文件时用作缓存的内存
# 35946452：系统会将一大部分内存用于cache，比如用于文件预读等，与buffer相同，这部分内存可以被系统重复调度给新的进程
# 12309972：真正被占用，不能被系统调度的内存
# 37096168：可以被系统调度的内存，等于1053192 + 96524 + 35946452（free + buffers + cached）
```

查看进程详细的系统调用
```bash
strace -t -o ./process_2_log node index.js
# mac可使用dtruss
dtruss <pid>
```

追踪线程信息
```bash
pstack <pid>
```

查看进程操作的fd
```bash
ls /proc/<pid>/fd
```

罗列进程对应的线程，输出的spid就是线程id，linux的线程其实是进程模拟的
```bash
ps -T -p <pid>
```

查看进程的内存映像信息
```bash
pmap -x <pid>
```