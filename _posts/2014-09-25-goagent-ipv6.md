---
layout: post
keywords: GoAgent, IPv6, 免流量上网
description: 使用GoAgent在按流量计费的网络免流量上网
title: 绕过流量计费系统
categories: [Web]
tags: [GoAgent, IPv6]
tldr: true
excerpt: 简要介绍一下GoAgent的另类用法，使用IPv6以绕过流量计费系统上网
group: archive
icon: coffee
---

首先，按天计费的孩纸们自动忽略，这里主要是针对IPv4网络按流量计费IPv6网络免费的孩纸们

既然在校园网，就不能浪费100M的带宽和得天独厚的IPv6网络
IPv6现在在中国还是试行，在校园内也不对IPv6的流量进行计费，所以要用趁早……

而GoAgent最早被广泛了解还是用来搭梯子爬墙的，对于安装过程不再冗述，网上一堆，GoAgent建议在Github上下载
这里主要提及的就是修改配置文件proxy.ini中[gae]部分里的profile选项，改成ipv6，然后就正常使用了；这时就绝对不走ipv4的流量了

之所以弄出这么个蛋疼办法，主要还是因为在寝室里所有人的网络账号都用完之后，断网5天的悲剧情况下憋出来的＞﹏＜；当然由于GoAgent的局限性，或者说QQ的局限性（都无所谓了），纯ipv6的网络环境下是完全上不去QQ的，如有大神能够成功在纯ipv6下上QQ请告知我，感激不尽（Veno、六飞除外）

基本也就这样了，在有网的情况下可以通过这种方式下下东西（注意GoAgent的流量限制）来节省一下寝室流量；真到月末虽然可以这样上网但还是挺痛苦的，大家悠着点

就酱，大家看着办吧