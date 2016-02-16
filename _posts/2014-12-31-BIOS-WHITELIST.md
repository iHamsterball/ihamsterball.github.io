---
layout: post
keywords: BIOS, WhiteList
description: 刷BIOS白名单使本本支持新的无线网卡
title: 刷BIOS白名单使本本支持新的无线网卡
categories: [硬件]
tags: [BIOS, 无线网卡]
tldr: true
excerpt: 折腾BIOS白名单简要备忘，新网卡不在主板白名单里通不过开机自检，刷白名单使其通过
group: archive
icon: code
---

2015年就快到了，写篇博客纪念下~

最近买的一块无线网卡下午到货了，然后装到电脑上很无奈地看到了Unauthorized card bla bla...（说好的能直接用呢）。不过虽说店家同意给退还有运费险，但是我的一贯原则是除非是假货否则加钱或折腾都不退货，于是就踏上了折腾BIOS的不归路。好了不废话了直接上教程，也顺便留作备

首先呢我们需要准备的东西有：
<ol>
<li>BIOS BACKUP TOOLKIT或官方的BIOS升级程序如果能提取到固件也行用于提取或备份你原来的固件</li>
<li>EZH2O等固件加载及修改程序用于加载固件</li>
<li>WinHex等16进制编辑器</li>
<li>FPT全称是Flash Programming Tool就是在DOS下强行写入BIOS的</li>
</ol>

备注：
<ol>
<li>FPT也可以用来备份BIOS的，开始的时候弄错fpart.txt文件了所以不认我的板</li>
<li>其他的比如PhoenixTool如果有经验也可以使用，不过这个家伙在内存里修改VEN DEV SUBSYS之后也不起作用不知道为什么所以只能选用户编辑模块然后在DUMP文件夹里找文件改（如果你的机型和我一样比较冷门那就基本上没有可能找到的）。</li>
</ol>

用于备份的下载链接为：<a href="http://pan.baidu.com/s/1c0guEkw">百度云</a> <a href="https://drive.google.com/file/d/0B5K-1xj0JmwkdXNaZS1ISGFvNEU/view?usp=sharing">谷歌网盘</a> <a href="http://1drv.ms/1yXJZvu">OneDrive</a>

具体步骤呢，首先看一下两块网卡的VEN DEV SUBSYS等信息，一般就这三个，最后的那个REV好像不重要
例如，我原先的网卡Broadcom 802.11网络适配器（型号是BCM什么的懒得查了），信息是<img src="/image/post/20141231/Broadcom.png">
新的网卡Intel Centrino 2230的是<img src="/image/post/20141231/Intel.PNG">这个可以像在图里这么查，换网卡的时候睡眠即可（休眠关机通通的不行，过不了开机自检）
然后获取到的这串东西我们需要转化一下，例如Broadcom的这个
<code>PCI\VEN&#95;14E4&DEV&#95;4727&SUBSYS&#95;051B14E4&REV&#95;01</code>
就把每一串16进制数反向写然后记下来，就是：
VEN的14E4变成E414，DEV的4727变成2747，SUBSYS的051B14E4变成E4141B05，REV就一位不用动，最后的HEX串就变成了
<code>E4142747E4141B05</code>
用来搜索的就是这个HEX串了，用于替换的同理

然后呢用BIOS备份软件备份一下本机的BIOS，然后用EZH2O加载，加载后这个固件就存在于软件内存里了，用WinHex以管理员权限打开内存，找到EZH2O的私有内存，寻找上面的HEX串，替换之，然后回到EZH2O保存之

现在呢这个保存出来的固件就是已经能支持新网卡的了，不过如果还有换回原网卡的可能，可以修改前后的支持网卡数据，这个看需要

然后就是把这个修改后的固件刷进主板了，据说有EFI Shell下能用的刷写软件，就是那种后缀为EFI的主板程序，不过就这么地吧

FPT备份和刷入的指令为
<pre><code>fpt -bios -d 保存的文件名
fpt -f 刷入的文件名 -bios
</code></pre>
然后不出意外应该就可以过开机自检了

刷写BIOS的时候一定要把官方的也放到里面万一刷到一半报错这个时候主板已经不正常了

常见的刷入错误是无权访问和没有找到对应芯片型号
无权访问一般是厂商限制，先运行一下PRR
没有找到对应芯片型号就是你的芯片不在它提供的fpart.txt文件上，如果你知道的话添加进去就可以了（这怎么可能知道）

基本就酱，大家元旦快乐
