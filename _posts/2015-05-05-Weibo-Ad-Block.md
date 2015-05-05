---
layout: post
keywords: hosts,iptables
description: 
title: 通过hosts方式屏蔽安卓微博app广告
categories: [软件]
tags: [Android, 网络]
tldr: true
excerpt: 在已经root的安卓设备上屏蔽微博app广告相关
group: archive
icon: android
---

####免责声明：使用此方式屏蔽微博广告为个人行为，仅限于测试和技术交流使用。

##首先声明此方法的负面影响：
在清除微博后台或重新启动后，打开微博时大概有十几或几十秒时间无法刷新主页的微博，但是之后即可正常刷新。</br></br>

##具体实现原理：
根据抓包得到的地址，微博app广告来源网址为<code>u1.img.sina.cn</code>，因此像正常hosts屏蔽网站的方式一样，将其重定向到127.0.0.1或0.0.0.0即可（这里提出一个保留问题，如果定向到一个可以访问的网站的IP，是否可以通过HTTP Error 404缩短超时时间）</br></br>

##具体操作方法：
首先，在安卓的hosts文件中（目录/system/etc/hosts），将<code>u1.img.sina.cn</code>网址屏蔽，重启设备；</br>
然后，在内置存储卡设备中，删除<code>.wbadcache</code>文件夹，刷新微博应当可以实现屏蔽。</br></br>

##尚存在的问题：
每次当微博后台被停止后，都需要等待较长时间，据分析可能是等待广告网址响应超时</br>
可能存在的崩溃问题，不过鉴于本人使用的是公测版微博客户端，可能是公测版bug</br></br>

如果有人有更好的方法，请在评论区提出，欢迎交流讨论；</br>
用安卓端的连接分析工具，分析了微博的连接，曾试过iptables挨个尝试屏蔽看效果但是误伤很严重所以后来用的tcpdump抓包分析的，现在问题来了：Android Lollipop的原生C++程序运行会报错<code>error: only position independent executables (PIE) are supported.</code>，寻求解决方法，注意不是NDK编译安卓app，是直接运行Linux程序，寻求解决方案中~