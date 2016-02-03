---
layout: post
keywords: Baidu，百度云管家
description: 最后一个不限速的百度云管家版本
title: 最后一个不限速的百度云管家版本
categories: [软件]
tags: [Baidu,百度云]
tldr: true
excerpt: 百度云从网页使用IE下载文件速度显示有问题而且奇慢，新版本还有非常大的限速（壮哉我大校园网100M带宽），修改版并不放心使用，之前卸载新版本后用了网页很长时间简直要闹心死了于是还是打算用旧版的百度云并且限制其更新。
group: archive
icon: rocket
---

先贴上摘录内容  

>大家都知道新版百度云管家都搞起会员和迅雷那样的“高速体验”了  
>换言之就是玩限速了，我100M电信光纤给我500K的速度也是醉了  
>不放心各种修改绿色破解版，终于找到了官方版4.6.2，最后一个不限速良心版  
>官方下载地址：http://bcscdn.baidu.com/netdisk/BaiduYunGuanjia_4.6.2.exe  
>估计上面地址撑不了多久，用的人多了肯定要被封杀，特此补档：<a href="http://pan.baidu.com/s/1eQeZwlW">百度云管家4.6.2</a>  
><br/>
>P.S. 安装后不要点击“体验一下”按钮，而是立即到安装目录下删除AutoUpdate文件夹防止出现下面的情况

摘录的原文接下来的内容是到%appdata%目录中删掉AutoUpdate文件夹，其实我感觉对于Windows 8以上用户这个应该不需要重复操作了，因为Program Files目录需要管理员权限使用所以很多软件也都直接安装在当前用户的%appdata%目录中（如果安装时没有弹UAC一般都是这样）  

当然，删掉AutoUpdate目录和去掉当前用户对该目录访问权限效果一样，直接禁用掉权限更彻底一些，尤其适用于以下情况  
<ul>
<li>软件会自动 重建文件夹/更改文件夹权限/下载文件</li>
<li>该文件是必要文件，不可删除</li>
</ul>
比如我之前为防止QQ操作hosts文件的权限禁用自己对hosts文件的全部权限（需要修改时还可以拿回来，改完再撤掉）。话说回来，QQ能在不弹UAC的情况下能够篡改hosts，细思恐极啊……  

很久没发博客了，这篇只是为了这个月不挂零(●'◡'●)  

<i class="fa fa-creative-commons"></i><a href="http://creativecommons.org/licenses/by-nc-sa/3.0/cn/">署名-非商业性使用-相同方式共享 3.0 中国大陆 (CC BY-NC-SA 3.0 CN)</a>  
原始来源：http://www.longtings.com/archives/403  
引用站点：https://www.iwch.me/archives/611.html  
