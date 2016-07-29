---
layout: post
keywords: JavaScript, Tampermonkey
description: 使用 Tampermonkey 脚本修正 Ingress Mission Map 谷歌地图偏移
title: 使用 Tampermonkey 脚本修正 Ingress Mission Map 谷歌地图偏移
categories: [网络]
tags: [JavaScript, Tampermonkey]
tldr: true
excerpt: 类似于 Ingress Intel Map，由 Lzumoya Hompo 制作的 Ingress Mission Map 由于同样使用 Google Maps 的 API，因此在中国地区也会发生相同的偏移现象。故仿照 breezewish 写的 IITC 插件，对该网站进行相应的调整，以修正地图偏移。
group: archive
icon: google
---

### 简介
类似于 Ingress Intel Map，由 Lzumoya Hompo 制作的 Ingress Mission Map 由于同样使用 Google Maps 的 API，因此在中国地区也会发生相同的偏移现象。故仿照 breezewish 写的 IITC 插件，对该网站进行相应的调整，以修正地图偏移。

### 背景

#### GCJ-02 坐标系统
>GCJ-02 坐标系统是国家测绘局以国家安全为由，用法律的手段对天朝所发行的地图类产品强制性加入偏移算法，使原本标准的WGS84坐标系统变为国家保密的自定义坐标系统，这个坐标系统官方的称法是02坐标系统，常见的说法是加密坐标系统。

#### WGS-84 坐标系统
>WGS-84 是为GPS全球定位系统使用而建立的坐标系统。通过遍布世界的卫星观测站观测到的坐标建立，其初次WGS84的精度为1-2m，在1994年1月2日，通过10个观测站在GPS测量方法上改正，得到了WGS84（G730），G表示由GPS测量得到，730表示为GPS时间第730个周。

谷歌地图在中国以外的地区使用的是 WGS-84 坐标系统，而在中国使用的是 GCJ-02 坐标系统（卫星地图除外）。因此如果使用 WGS-84 坐标系统的坐标请求 GCJ-02 中国地区的地图，显然无法得到正确的结果。而且，由于该转换算法是国家保密内容，故不可能有官方的转换算法；目前存在的算法，都是根据两个坐标系数据拟合出来的近似算法。  
目前存在的纠偏手段，基本上都是通过将 WGS-84 坐标系统转化成 GCJ-02 坐标系统，根据转换之后的坐标请求地图数据，以此消除地图偏移。

### 关于此插件
类似于 IITC 的相应插件，此插件采用覆写地图操作函数，在请求数据前插入坐标转换（WGS-84 to GCJ-02），来实现纠偏。  
目前主要存在两个问题：

+   Google Hybrid 地图，由于卫星地图是 WGS-84 坐标系统，因此卫星地图本身就是正确的。而道路使用的 GCJ-02 坐标系统，如果进行偏移，那么卫星地图也会受到影响
+   Ingress 内的对象，例如 Portal 和任务起始点，虽然可以通过坐标转换进行纠偏，但是刷新这些内容所使用的函数，需要获取到地图的边界等数据，然而这些数据已经是 GCJ-02 坐标系统的坐标了。由于我们没有合适的方法进行转换，所以请求到的数据可能会不完整（想象一下请求到数据之后，整体向右上方偏移，这样左下方就没有数据了）。

以上两个问题，暂时没有什么解决方法。如果你有什么想法，欢迎联系我一起改进。  
插件地址：<a href="https://github.com/iHamsterball/ingress-mission-map-plugin-fix-googlemap-china-offset">GitHub</a>
