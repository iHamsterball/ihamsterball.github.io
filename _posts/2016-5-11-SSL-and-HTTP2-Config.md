---
layout: post
keywords: SSL, HTTP/2, nginx
description: 配置安全连接及HTTP/2访问
title: 配置nginx安全连接及HTTP/2访问
categories: [网络]
tags: [nginx, HTTP/2, TLS]
tldr: true
excerpt: 其实如果不是因为之前刚搭博客时Namecheap的那个Github Promo Code用不了的话，应该很早就配置好TLS安全连接和HTTP/2了。嘛~现在能用了就顺手配置一下好了
group: archive
icon: lock
---

在最开始配置 Namecheap 的域名的时候，曾经试图用过 Github 上 Namecheap 的那个安全证书的 Promo Code，然而当时无论怎么试都用不了这个 Code 就放弃了。今天突然想起来的时候，就顺手试了下发现可以用了就<del>愉快地</del>开始配置了。  
另外，在这个 VPS 上的 nginx 我之前曾经折腾过 HTTP/2 的组件，所以不需要再包括一遍 HTTP/2 相关的模块重新编译一遍 nginx 了（最开始编译就把这个编译进去了，只不过受限于没有安全连接所以没有用 HTTP/2）。

---

### HTTP/2配置
<blockquote>HTTP/2（超文本传输协议第2版，最初命名为 HTTP 2.0），是 HTTP 协议的的第二个主要版本，使用于万维网。HTTP/2 是 HTTP 协议自 1999 年 HTTP 1.1 发布后的首个更新，主要基于 SPDY 协议。它由互联网工程任务组（IETF）的 Hypertext Transfer Protocol Bis（httpbis）工作小组进行开发。该组织于2014年12月将 HTTP/2 标准提议递交至 IESG 进行讨论，于2015年2月17日被批准。HTTP/2 标准于2015年5月以 RFC 7540 正式发表。——维基百科</blockquote>
Nginx 在2015年09月22日发布的1.9.5版本中开始支持了 HTTP/2，当然我用的比这个版本要高所以当然没问题，如果 nginx 版本比较低需要升级一下。  
因为 DO 的 VPS 上直接 apt-get 的 nginx 版本很低我也懒得折腾这个了所以就干脆自己编译了，另外我的 nginx 配置里有谷歌镜像站所以不需要的可以忽略。接下来是配置日志部分：  
<pre><code>--user=www --group=www --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module --with-http_gzip_static_module --with-ipv6 --with-http_sub_module --with-http_v2_module --with-openssl=../openssl-1.0.2e --with-zlib=../zlib-1.2.8 --add-module=../ngx_http_google_filter_module --add-module=../ngx_http_substitutions_filter_module</code></pre>
以上是我的 nginx 编译配置，可以用作参考。需要下载 openssl、zlib、gzip、pcre 的源码并解压然后写在这个配置里，根据自己版本调整，需要用到其他参数的根据自己需要增减，跟 HTTP/2 有关的就是<code>--with-http_v2_module</code>以及安全连接相关的配置了，<code>--add-module=../ngx_http_google_filter_module --add-module=../ngx_http_substitutions_filter_module</code>是谷歌镜像的配置，配置 HTTP/2 可以忽略。  
如果之前已经配置好了安全连接，这里直接把 nginx 的配置文件 nginx.conf 中安全连接的部分
<pre><code>server {
    listen 443 ssl http2;

    ssl_certificate server.crt;
    ssl_certificate_key server.key;
}</code></pre>改成这样就好了（加个http2），其他安全连接的部分不用动。  

---

### 安全连接配置
如果是像我这样安全连接都没有配置的，那就要把安全连接配置好了才能用 HTTP/2 了。
<blockquote>CA(Certificate Authority)：数字证书认证中心的简称，是指发放、管理、废除数字证书的机构。CA的作用是检查证书持有者身份的合法性，并签发证书(在证书上签字)，以防证书被伪造或篡改，以及对证书和密钥进行管理。<br/>
<br/>
SSL(Secure Sockets Layer)：安全套接层，它指定了在应用程序协议(如HTTP、Telnet、FTP)和TCP/IP之间提供数据安全性分层的机制，它是在传输通信协 议(TCP/IP)上实现的一种安全协议，采用公开密钥技术，它为TCP/IP连接提供数据加密、服务器认证、消息完整性以及可选的客户机认证。<br/>
<br/>
证书链(certificate chain)：包含信任锚(CA 证书)和已签名证书。Web浏览器已预先配置了一组浏览器自动信任的根CA证书。来自其他证书授权机构的所有证书都必须附带证书链，以检验这些证书的有效 性。证书链是由一系列CA证书发出的证书序列，最终以根CA证书结束。</blockquote>
具体步骤如下：  
首先确保openssl在1.0.1h以上  

#### 创建CSR和私钥
<pre><code>openssl req -new -newkey rsa:2048 -nodes -keyout hamsterball.me.key -out hamsterball.me.csr</code></pre>
运行后得到两个文件，私钥 hamsterball.me.key 以及 csr 文件 hamsterball.me.csr，其中 csr 文件里面的内容在激活证书的时候需要提交。

#### 购买证书并激活
在选择的证书提供商那里购买证书，对于我这个情况就是一个 Domain Validation 型的证书，因为我申请的是根域名所以 www.hamsterball.me 也可以用这个证书。  
提交证书后需要激活，目的是证明你是域名管理员。激活的话一般有三种，邮件、HTTP 和 DNS。邮件验证就是使用 admin@domain.com 之类的管理员域名收一封邮件；HTTP 验证就是把指定文件放到网站根目录，一小时内证书提供商会试图下载；DNS 验证就是按服务提供商要求设置一个 CNAME 记录，等生效或是服务商检查成功后即可激活。

#### 下载证书文件
下载的证书文件通常是一个压缩包，有些是2个文件，有些是4个文件。  
如果是2个文件，是这样的：  
<pre><code>www_domain_net.ca-bundle
www_domain_net.crt</code></pre>
如果是4个文件，通常都是这样的：  
<pre><code>www_domain_net.crt
COMODORSADomainValidationSecureServerCA.crt
COMODORSAAddTrustCA.crt
AddTrustExternalCARoot.crt</code></pre>
其中 www_domain_net.ca-bundle 就是自动合并了其他3个文件的产物，一个道理。  
像我得到的就是两个文件，hamsterball_me.ca-bundle 和 hamsterball_me.crt。

#### 合并证书
合并，得到证书文件。
<pre><code>cat hamsterball_me.crt hamsterball_me.ca-bundle > hamsterball.me.crt</code></pre>

#### 部署证书
把证书放到你能找到的地方（嗯……找不到当我没说），然后修改 nginx.conf 文件。  
例如我的配置是这样的：  
<pre><code>server {
    listen       443 ssl http2;
    listen       [::]:443 ssl http2;
    server_name  hamsterball.me;

    ssl_certificate      ../ssl/hamsterball.me.crt;
    ssl_certificate_key  ../ssl/hamsterball.me.key;

    ssl_session_cache    shared:SSL:10m;
    ssl_session_timeout  10m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers  EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_prefer_server_ciphers  on;

    location /generate_204 { return 204; }
    location / {
        root   site;
        index  index.html index.htm;
    }
}</code></pre>
SSLv3 不安全就不要了，加密算法里面不安全的也不要了，把 crt 文件和之前的 key 文件放到你能找到的地方，例如 conf 文件夹或者像我一样建一个 ssl 文件夹。

#### 测试nginx配置文件并重启
测试配置
<pre><code>./nginx -t</code></pre>
无误后重启
<pre><code>./nginx -s reload</code></pre>

---

### 其他
这样 HTTP/2 和 HTTPS 就都配置完了，当然网站通过安全连接的访问速度慢了一点，毕竟安全连接要多些握手过程。可以写配置让 HTTP 连接重定向到 HTTPS 连接，把 80 端口的监听改为
<pre><code>server
{
    listen 80;
    listen [::]:80;
    server_name hamsterball.me;
    location /generate_204 { return 204; }
    location / { rewrite ^/(.\*) https://hamsterball.me/$1 permanent; }
}</code></pre>就可以了，所有非安全连接都会重定向到安全连接。  
嗯，大概就是这样了~
