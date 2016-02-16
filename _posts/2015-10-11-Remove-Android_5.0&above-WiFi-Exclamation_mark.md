---
layout: post
keywords: Android,WiFi
description:
title: 关于 Android 5.0 及以上系统网络图标上的感叹号及其解决办法
categories: [软件]
tags: [Android,WiFi]
tldr: true
excerpt: 由于Android 5.0及以上系统检测WiFi状态如是否需要登录等需要连接被屏蔽的谷歌服务器，因此需要做出相应修改去除之并保证正常功能
group: archive
icon: android
---

本文全文转载于<a href="http://www.noisyfox.cn/">狐狸的小小窝</a><a href="http://www.noisyfox.cn/45.html">关于 android 5.0 网络图标上的感叹号及其解决办法</a>，感谢原作者的长期努力  
原站的文件下载服务似乎有下载次数统计服务，因此并没有将程序文件转移到本站  
虽然是全文引用但是针对本站对文章进行了相关修改以达到合适的显示效果  

升级了安卓5.0的同学们一定对网络图标上面的那个感叹号感到十分郁闷。安卓5.0引入了一种新的网络评估机制来评估网络状况，当你有网络请求时会自动选择网络连接条件最好的一个网络进行连接。该机制的代码实现如下：
<img src="/image/post/20151011/1.png"><i class="fa fa-spiner"></i>
简要来说就是，如果该网络是VPN，那么直接使用这个网络进行连接，否则调用 isCaptivePortal() 函数进行网络状况的判定，再根据判定结果决定是否选用此网络。 而罪魁祸首就是这个 isCaptivePortal() 函数，它会访问 clients3.google.com/generate_204 并根据返回结果来判断网络联通状况。正是这个google的网址被墙导致安卓没有办法评估网络，这样就导致了那个蛋碎的感叹号一直存在，以及wifi用着用着突然自动连回数据连接了。  
本来我想直接把 isCaptivePortal() 函数给屏蔽掉，让他一直返回成功，但是看了下google的代码，发现这个函数是非常有用处的，为什么呢？这个函数有个非常重要的作用，那就是判断当前网络是否需要登录。  
想必大家都连接过那些需要验证才能使用的wifi热点吧，当你们连接这些热点的时候，android会自动弹出提示询问你是否需要登录。而这个功能就是依靠了 isCaptivePortal() 这个函数才得以实现，具体原理如下：
<img src="/image/post/20151011/2.png"><i class="fa fa-spiner"></i>

###那么下面就给出解决方法（无需root）：

1.完全屏蔽网络检查功能，最简单快速，但是就没有办法提示wifi登录：
<pre><code>adb shell "settings put global captive_portal_detection_enabled 0"</code></pre>
2.用国内的服务器替换掉google的服务器：
<pre><code>adb shell "settings put global captive_portal_server noisyfox.cn"</code></pre>
这个服务器是我自己建的，也就是本站：http://noisyfox.cn/ 我在服务器上写了个简单的204页面，网址是 http://noisyfox.cn/generate_204 只要用这个网址替换掉google的网址，就可以正常访问并检测网络状态了。不过由于本人的服务器速度并不快，所以感叹号还是会显示一小会儿的，不过应该很快就会消失。  
如果你对本站提供的服务速度不满意，可以在文末找到网友提供的其它服务地址。  
经过靠谱的确认，改修改方式具有持久性，重启依旧有效，除非刷机或者清除数据。

###如何建立自己的服务器

1.对于apache服务器，如果你的服务器安装了rewrite模块，那么只需要在网站的.htaccess中加入以下代码：
```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_URI} /generate_204$
  RewriteRule $ / [R=204]
</IfModule>
```

2.对于nginx，直接加入以下设置即可：
<pre><code>location /generate_204 { return 204; }</code></pre>
3.如果以上方法都无效，那么就要利用代码中的一个小trick来完成，直接在网站的根目录下建立一个叫做“generate\_204”的空文件即可，因为安卓的源码中写了如果返回的内容为空那么也会当成204（毕竟一个空的页面怎么想都不可能是登录页面嘛！）。

###一键设置工具（需要root）

锵锵锵！由于有些人不太熟悉adb之类的操作，因此就做了一个小工具方便大家直接在手机上设置！  
<img src="/image/post/20151011/Screenshot_20151010-235013.png" width="337.5" height="600"><i class="fa fa-spiner"></i>  

####下载地址

NoExclamation Portal Server 修改器 1.2 &nbsp;<a title="NoExclamation Portal Server 修改器 1.2" href="http://www.noisyfox.cn/?smd_process_download=1&amp;download_id=363" data-slimstat-tracking="false" data-slimstat-callback="true" data-slimstat-type="2">下载地址</a>  
NoExclamation Portal Server 修改器 1.5 &nbsp;<a title="NoExclamation Portal Server 修改器 1.5" href="http://www.noisyfox.cn/?smd_process_download=1&amp;download_id=318" data-slimstat-tracking="false" data-slimstat-callback="true" data-slimstat-type="2">下载地址</a>  
叹号杀手 &nbsp;1.5
<ul>
<li>修正了应用崩溃的问题</li>
</ul>
1.4
<ul>
<li>增加图标</li>
<li>替换网址为英文网址</li>
<li>优化了重置网址功能</li>
<li>优化界面，在修改网址时不会导致界面卡顿</li>
</ul>

###一些其它服务网址

我会尽我所能提供长期有效的服务，但是由于本站服务器不是很快，而且网络状况有时候会不稳定，因此无法保证100%可靠的服务。不过有一些热心网友提供了其它服务网址，速度和稳定性或许会比本站要好。故在此特别列出供大家选用。如果给提供者带来不便之处请回复告知，我会及时删除。  
by fengz: www.v2ex.com V2EX建立的服务，速度不错，稳定性也很不错  
by lkebin: liukebin.avosapps.com 架设于LeanCloud服务器，据lkebin称是永久有效  
by Zohar: www.iwch.me 热心网友的个人站点  
