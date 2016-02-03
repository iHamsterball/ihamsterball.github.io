---
layout: post
keywords: Github, calendar-map
description: 显示Github风格canlendar-map
title: 工作时间记录器
categories: [网络]
tags: [calendar-map]
tldr: true
excerpt: 一直很喜欢Github的contributions记录的绿色方块，想搬到博客上，于是就有了这么一个东西，利用<a href="http://d3js.org/">d3.js</a>生成svg矢量图来显示出来。<del>不过Github上的提交记录实在惨不忍睹，</del>不过感觉用来记录每天的工作时长效果会更好一点，不过嘛具体怎么利用这个东西有时间再想。
group: archive
icon: github
---

一直很喜欢Github的contributions记录的绿色方块，想搬到博客上，于是就有了这么一个东西，利用<a href="http://d3js.org/">d3.js</a>生成svg矢量图来显示出来。<del>不过Github上的提交记录实在惨不忍睹，</del>感觉用来记录每天的工作时长效果会更好一点，不过嘛具体怎么<del>优雅地</del>使用这个东西有时间再想。  
下面这个图是用脚本从Github上爬来的Github提交数据显示出来的，当然从颜色上也能看出我有多么的懒\_(:3」∠)\_
<script src="//cdn.bootcss.com/d3/3.5.14/d3.min.js"></script>
  <style>
  .day {
    stroke: #fff;
  }
  .month {
    fill: none;
    stroke: #000;
    stroke-width: 2px;
  }
  </style>
<div class="calendar-map"></div>
<script type="text/javascript" src="/js/calendarmap.js"></script>
用来爬数据的脚本是随手写的，感觉BeautifulSoup好好用的说~
{% highlight python %}
# Author: Hamster<ihamsterball@gmail.com>
# Created on 14:03 2016/1/22
import requests
import BeautifulSoup

def prase(item):
    date = item['data-date']
    year = date[0:4]
    month = date[5:7]
    day = date[8:10]
    print '\"' + year + month + day + '\":' + item['data-count'] + ','

def main():
    session = requests.Session()
    url = "https://github.com/users/iHamsterball/contributions"
    response = session.get(url)
    print response.text
    s = BeautifulSoup.BeautifulSoup(response.text)
    l = s.findAll('rect')
    for item in l:
        if item['data-count']!='0':
            prase(item)

if __name__ == "__main__":
    main()
{% endhighlight %}
不过嘛刚才也提到了这个问题就是Github的惨淡数据，所以，可以换一个思路比如来显示每天工作的时间。这个工作时间嘛说起来倒也是想怎么算都可以的所以还是最好有一个统计工具，比如我用了一段时间的RescueTime软件，可以很方便的统计日常使用电脑的活动，<del>虽然用了的话依旧每周的娱乐时间超标除了考试周</del>。具体要怎么处理以后有时间再考虑，毕竟还要涉及到从RescueTime的统计网页上扒数据再格式化所以也是有点任务量的。  
嗯嗯，就这样~
