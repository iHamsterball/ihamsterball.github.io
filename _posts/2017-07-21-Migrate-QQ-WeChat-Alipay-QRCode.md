---
layout: post
keywords: Nginx, Web
description: 合并支付宝、微信、QQ收款码
title: 合并支付宝、微信、QQ收款码
categories: [网络]
tags: [nginx, Web]
tldr: true
excerpt: 最近有个需要用到收款码的地方，想起之前看过用一个服务器来识别 User-Agent 进而让一个二维码能够同时被微信和支付宝扫码的文章，所以打算自己也做一下。印象里前两年还没有怎么样，但是从今年开始合并付款二维码的服务一下子就多了起来。不过反过来并不是很敢使用这些服务，毕竟用这些服务器不在自己手里的第三方服务并不放心。另外之前在弄 Nginx 的其他配置时，看到了可以读取 User-Agent，那么从另一种思路来讲根本就不需要一个网页，也用不到 JavaScript。
group: archive
icon: wechat
---

### 简介
最近因为需要用，所以折腾了下合并收款码。虽然已经有了很多第三方服务，不过一是不敢用，而是觉得有的第三方服务或者其他的教程有些行为不太必要。当然可能会有比我更简便的方法，有知道的大佬请务必告诉我，嗯嗯。

### 原理
跟其他的服务一样，用一个服务器来检查 User-Agent 后，返回302，跳转到对应的支付链接。Nginx 本身就可以判断 User-Agent，所以直接改它配置。

### 工具
- Simple QRCode Creater -- Edi.Wang 的简单号用的二维码制作器
- 在线的或者其他你喜欢的二维码扫描器，这个就多的是了

### 分析
支付宝的收款码里面的内容大概是这样的 `HTTPS://QR.ALIPAY.COM/FKX07586SP67FM7AJXKL5D?t=1535983448548`，从网上搜到的 UA 中必然包含 `Alipay`（嗯偷懒了下，在日志里看了下 UA 巨长


微信的收款码里面的内容大概是这样的 `wxp://f2f0ml2dCWYTnUWbiJecMDmgnDTL1lYmi9Ju`，UA 中包含 `MicroMessenger`


QQ的收款码里面的内容大概是这样的 `https://i.qianbao.qq.com/wallet/sqrcode.htm?m=tenpay&f=wallet&a=1&ac=9E9975C8017A17982386A81B0333B8738BA85A1099B2F5F3197F4CEAF1ECA068&u=635114964&n=%E4%BB%93%E9%BC%A0`，嗯超级长，后面 URI Encode 的文本是中文的我的 QQ 昵称，UA 中包含 `QQ`


于是 Nginx 的配置就可以出来了：
{% highlight nginx %}
location /pay {
    if ( $http_user_agent ~* "MicroMessenger" ) {
        return 302 "wxp://f2f0ml2dCWYTnUWbiJecMDmgnDTL1lYmi9Ju";
    }
    if ( $http_user_agent ~* "Alipay" ) {
        return 302 "HTTPS://QR.ALIPAY.COM/FKX04705GEHQXEUWUIMTB1";
    }
    if ( $http_user_agent ~* "QQ" ) {
        return 302 "https://i.qianbao.qq.com/wallet/sqrcode.htm?m=tenpay&f=wallet&a=1&ac=9E9975C8017A17982386A81B0333B8738BA85A1099B2F5F3197F4CEAF1ECA068&u=635114964&n=%E4%BB%93%E9%BC%A0";
    }
    return 403;
}
{% endhighlight %}


但是这个其实只有支付宝能用（坑#1：支付宝请保持大写，转成小写会出问题，不知道支付宝那边怎么写的代码）。微信和 QQ 则完全无法弹出页面，页面是白的什么都没有出来，搜索了下发现微信和 QQ 只能用支付接口来直接收款，要求好像还很多要审核什么的。不过长按二维码还是可以扫收款码来收款的，所以，直接做出来收款码的图片，简单 PS 一下，然后扔到服务器上，把跳转链接改为图片即可。


坑#2：配置中判断条件两边要有空格，不然语法检查过不了


![QRCode for WeChat](/image/post/20170721/wechat.png){:height="35%" width="35%"}![QRCode for QQ](/image/post/20170721/qq.png){:height="35%" width="35%"}

配置现在就变成了
{% highlight nginx %}
location /pay {
    if ( $http_user_agent ~* "MicroMessenger" ) {
        return 302 "https://static.cother.org/pay/wechat.png";
    }
    if ( $http_user_agent ~* "Alipay" ) {
        return 302 "HTTPS://QR.ALIPAY.COM/FKX04705GEHQXEUWUIMTB1";
    }
    if ( $http_user_agent ~* "QQ" ) {
        return 302 "https://static.cother.org/pay/qq.png";
    }
    return 403;
}
{% endhighlight %}

于是现在给配置的路径和所在域名生成一个二维码即可。
![Pay QRCode](/image/post/20170721/pay.png){:height="25%" width="25%"}