---
layout: post
keywords: VMWare,VMDebugger,Visual Studio
description: 
title: 修复"外接程序VMDebugger未能加载……"的问题
categories: [软件]
tags: [Visual Studio, Plug-in]
tldr: true
excerpt: 在不影响VMWare Debugger正常使用的且不重装VMWare的情况下修复启动时弹出"外接程序VMDebugger未能加载……"的问题
group: archive
icon: terminal
---

在忍受了很久打开Visual Studio之前都要点一下"外接程序VMDebugger未能加载……"的对话框之后，终于准备开始海搜比较好的解决方案。由于可能需要用到VMDebugger，因此网上通过更改注册表禁止VMDebugger作为加载项加载的方法不适合我。今天在Stackoverflow上发现了一个很棒的方法，原文如下：
<blockquote>For anyone who could not solve this problem by re-installing the VMWare plug-in but do not want to sacrifice all his VS settings, here is a solution that did work for me:</br></br>

•Export 'Menu and Command Bar Customizations' VS settings only using</br><code>Tools => Import and Export Settings... => Export selected environment settings</code></br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•Deselect 'All Settings'</br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•Select only 'All Settings/General Settings/Menu and Command Bar Customizations'</br>
•Open exported <code>.vssettings</code> file in a text editor, scroll to the end and remove the entry </br><code>&lt;add</em>toolbar Menu=... Name=&#39;VMware&#39; .../&gt;</code> in the UserCustomizations section</br>
•Import edited <code>.vssettings</code> file using<code>Tools => Import and Export Settings... => Import selected environment settings</code></br>
and restart Visual Studio to check if the error has gone.</br></br>

<div>answered <span title="2014-05-12 10:33:47Z" class="relativetime">May 12 '14 at 10:33</span> by <a href="http://stackoverflow.com/users/993388/buygrush">buygrush</a></div>
</blockquote>
嗯，如果能看懂的话也不用我再废话了，说得及其简洁；看不懂的可以看我下面翻译：</br></br>
作者的本意也是由于不想因为重装VMWare插件而丢失VS设置，所以找到的这个解决方案：</br>
•通过<code>工具->导入和导出设置->导出选定的环境设置</code>导出"菜单和命令栏自定义"</br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•取消选择"所有设置"</br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•仅选择"所有设置->常规设置->菜单和命令栏自定义"</br>
•使用文本编辑器打开导出的<code>.vssettings</code>文件，移动至末尾，移除UserCustomizations区域内的<code>&lt;add</em>toolbar Menu=... Name=&#39;VMware&#39; .../&gt;</code>部分，这部分在我导出的文件内是这样的<code>&lt;add</em>toolbar Menu=&quot;{000D7B18-CDE4-49F0-B194-FE3E25BBF096}:0000000b&quot; Name=&quot;VMware&quot; MenuType=&quot;toolbar&quot;/&gt;</code></br>
•<code>工具->导入和导出设置->导入选定的环境设置</code>通过导入我们修改后的<code>.vssettings</code>文件</br>
•重启Visual Studio检查是否已经排除故障</br>
