---
layout: post
keywords: JavaScript, Ajax
description: 使用 jQuery 发送 Ajax 请求
title: Zhihu Digger 填坑系列 1：使用 jQuery 发送 Ajax 请求
categories: [网络]
tags: [JavaScript, Ajax]
tldr: true
excerpt: 传统网页与服务器通信往往需要通过提交整个表单来实现，这样用户不得不每次在提交表单时刷新整个页面，带来很不好的用户体验，在这个背景下 Ajax 应运而生。AJAX 即 Asynchronous JavaScript and XML（异步的 JavaScript 和 XML）。Ajax 不是新的编程语言，而是一种使用现有标准的新方法。Ajax 能在不重新加载整个页面的情况下，与服务器进行数据交换，实现网页局部刷新。
group: archive
icon: google
---

### 简介
传统网页与服务器通信往往需要通过提交整个表单来实现，这样用户不得不每次在提交表单时刷新整个页面，带来很不好的用户体验，在这个背景下 Ajax 应运而生。  
AJAX 即 Asynchronous JavaScript and XML（异步的 JavaScript 和 XML）。Ajax 不是新的编程语言，而是一种使用现有标准的新方法。Ajax 能在不重新加载整个页面的情况下，与服务器进行数据交换，实现网页局部刷新。Ajax 的基本概念和语法可以参考<a href="http://www.w3school.com.cn/ajax/index.asp">W3School Ajax 教程</a>。  
使用 JavaScript 发送 Ajax 请求需要使用 XMLHttpRequest 对象，但是这种方式比较繁琐，需要较大的代码量。jQuery 是 JavaScript的一个库，极大简化了 JS 的编程，其中就包含了对 Ajax 请求的封装。  

### 使用
丢锅啦，将近一年时间的锅了就不捡了（2017-07-11
反正 Ajax 会丢掉正常的网页的历史啊什么的，如果不用 HTML5 API 来操纵浏览器历史纪录的话，体验也会很糟糕。毕设的项目里也大量用到了 Ajax 方法，也初步地成功使用 HTML5 API 来加强体验，虽然毕设实在是太多东西要做了最终还是丢锅了好多，不过起码把前端界面整个重制了一下，还实现了一些新功能，也可以了。
