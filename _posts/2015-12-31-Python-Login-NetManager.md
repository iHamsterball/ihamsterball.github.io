---
layout: post
keywords: Python, Web
description: 作为之前MFC版的轻量版
title: Python版通用网络计费系统基础操作实现
categories: [软件]
tags: [Python, Web]
tldr: true
excerpt: 新年前的最后一篇文章，Python版登陆北林通用网络计费系统程序，作为实时监测网络流量的基础，在跨年前赶工完毕（虽然博客写的有点晚但这么地吧~）明年还会接着写实时监测的部分
group: archive
icon: hand-o-right
---

照例作为跨年之前的最后一篇文章~  
今天发的是使用Python写北林通用网络计费系统基础操作类的代码，毕竟之前写的MFC版本的感觉还是太大了，代码看起来也很冗余（主要还是懒得维护了，感觉好浪费生命），这次写完Python版本的再做一个循环检测的逻辑，以及开机自启，就可以配置在全寝室人的电脑上了。  
说到底，根本动力还是：流量各种刷爆，不欠费不断网\_(:3」∠)\_。其实看代码里的日期应该也能猜到我只是今天来填坑而已(●ˇ∀ˇ●)。  
就酱，以下是代码，有同样需求的可以直接搬走~  
{% highlight python %}
# Author: Hamster<ihamsterball@gmail.com>
# Created on 16:24 2015/7/12
import requests

class NetManager(object):
    def __init__(self):
        self.session = requests.Session()
        self.userid = ''
        # Get Current IP Address
        headers = {
            "Accept": "text/html, application/xhtml+xml, image/jxr, */*",
            "Accept-Language": "zh-Hans-CN,zh-Hans;q=0.8,zh-Hant-HK;q=0.7,zh-Hant;q=0.5,en-GB;q=0.3,en;q=0.2",
            "Host": "202.204.122.1",
            "Cache-Control": "no-cache",
            "Connection": "Keep-Alive",
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": "http://202.204.122.1/",
            "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; InfoPath.3; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729)",
            }
        url = 'http://202.204.122.1/'
        self.session.headers.update(headers)
        tmp = self.session.get(url).text
        self.ip = tmp[tmp.find('<span')+24 : tmp.find('</span>')]
        print self.ip

    def param(self, username, password):
        self.username = username
        self.password = password

    def login(self):
        # Login
        url = 'http://202.204.122.1/checkLogin.jsp'
        params = {}
        params["username"] = self.username
        params["password"] = self.password
        params["ip"] = self.ip
        params["action"] = "admin"
        self.session.post(url, data = params)
        # Get userid
        url = 'http://202.204.122.1/user/right.jsp'
        tmp = self.session.get(url).text
        self.userid = tmp[tmp.find('userid')+7 : tmp.find('ip')-1]

    def connect(self):
        url = 'http://202.204.122.1/user/network/connect_action.jsp?'
        url += 'userid=' + self.userid + '&ip=' + self.ip + '&tyep=2'
        response = self.session.get(url)

    def disconnect(self):
        url = 'http://202.204.122.1/user/network/disconnect_action.jsp?'
        url += 'userid=' + self.userid + '&ip=' + self.ip + '&tyep=3'
        response = self.session.get(url)

def main():
    base = NetManager()
    # Add some code here

if __name__ == "__main__":
    main()
{% endhighlight %}
