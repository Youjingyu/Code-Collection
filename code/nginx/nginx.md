## nginx启动https反向代理
/etc/nginx/nginx.config
```bash
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log warn;
error_log  /var/log/nginx/error.log notice;
error_log  /var/log/nginx/error.log info;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #配置共享会话缓存大小，视站点访问情况设定
    ssl_session_cache   shared:SSL:10m;
    #配置会话超时时间
    ssl_session_timeout 10m;
    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}
```
/etc/nginx/conf.d/*.conf
```bash
server {
    listen  443 ssl;
    server_name  www.test.com;
    ssl_certificate path/server.crt;
    ssl_certificate_key path/server.key;

    keepalive_timeout   70;
    # ssl_protocols  SSLv2 SSLv3 TLSv1;
    # ssl_ciphers  ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
    ssl_prefer_server_ciphers   on;

    #减少点击劫持
    add_header X-Frame-Options DENY;
    #禁止服务器自动解析资源类型
    add_header X-Content-Type-Options nosniff;
    #防XSS攻擊
    add_header X-Xss-Protection 1;

    #charset koi8-r;
    # access_log  /var/log/nginx/host.access.log  main;

    location /repos/ {
      proxy_pass https://api.github.com;
      rewrite ^(.*)$ $1?client_id=xxxx&xxxxx break;
    }
    location /myraw/ {
      proxy_pass https://raw.githubusercontent.com;
      rewrite /myraw/(.*) /$1  break;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}
```