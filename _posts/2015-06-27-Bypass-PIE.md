---
layout: post
keywords: Android,PIE
description:
title: 绕过Android Lollipop的PIE安全检查
categories: [软件]
tags: [Android, PIE]
tldr: true
excerpt: 绕过了Android L的PIE安全检查，可以执行原生C程序（不是NDK，是linux C程序）
group: archive
icon: android
---

之前在<a href="/软件/2015/05/05/Weibo-Ad-Block.html">通过hosts方式屏蔽安卓微博app广告</a>里面，提到过该问题，当时并没有成功搜索到解决方案。当时遇到的问题就是报错<code>error: only position independent executables (PIE) are supported.</code>，后来不得不借同学Android 4.4的手机来运行tcpdump。

此文章依据及来源为XDADevelopers论坛<a href="http://forum.xda-developers.com/google-nexus-5/development/fix-bypassing-pie-security-check-t2797731">[FIX] [Android 'L'] Bypassing the new PIE security check</a>，作者为<a href="http://forum.xda-developers.com/member.php?u=5293221">cernekee</a>，帖子发布日期为2014年6月28日（现在才看到，闹）。原文引用：  
<blockquote>
<div>
Last month, Chainfire <a href="https://plus.google.com/+Chainfire/posts/ZtXAhw164QD" target="\_blank" rel="nofollow">posted a nice writeup</a> on several new security changes happening upstream in AOSP.  There has been much discussion of the SELinux changes and what that means for root apps, but I'd like to touch on another change that can affect even garden variety non-root apps: mandatory PIE (position-independent executables).  

If you're running the Android "L" developer preview image, you may have noticed that some of your native binaries no longer execute:  

<div style="margin: 5px 20px 20px;">
<div class="smallfont" style="margin-bottom: 2px;">Code: </div>
<pre class="alt2 " style="margin: 0px; padding: 5px; border: 1px inset currentColor; border-image: none; width: 100%; height: 50px; text-align: left; overflow: auto;" dir="ltr">$ ./curl --help                             
error: only position independent executables (PIE) are supported.</pre>
</div>PIE is a useful security feature, as randomizing the address space makes it significantly more difficult for an attacker to exploit bugs in a program.  However, in this case, one must trade off compatibility for security: PIE is only available in JB 4.1 and above, so <b>most app developers targeting a wide range of Android versions have disabled PIE in their builds</b>.  The new PIE check in "L" will cause breakage for most apps that ship native executables.<br>
<br>
As it turns out, even some of the precompiled binaries shipped with Android itself are affected, and Google has <a href="https://android.googlesource.com/platform/bionic/+/d81b3b275dff99561cbe5905ca63a1c72fa54a17" target="\_blank" rel="nofollow">temporarily disabled PIE enforcement</a>.  It is not clear whether they will re-enable it at a later date.  

Since the Android "L" preview images were built prior to Google's latest change, they still have PIE enabled.  I am attaching a flashable "bypass-pie.zip" which overwrites one byte in /system/bin/linker to bypass the PIE check:  

<div style="margin: 5px 20px 20px;">
	<div class="smallfont" style="margin-bottom: 2px;">Code: </div>

<pre class="alt2 " style="margin: 0px; padding: 5px; border: 1px inset currentColor; border-image: none; width: 100%; height: 146px; text-align: left; overflow: auto;" dir="ltr">    3a06:       f8c6 5098       str.w   r5, [r6, #152]  ; 0x98
    3a0a:       f8c6 4100       str.w   r4, [r6, #256]  ; 0x100
    3a0e:       8a0a            ldrh    r2, [r1, #16]
    3a10:       2a03            cmp     r2, #3
    3a12:       d007            beq.n   3a24 // change to e007 (b.n)
    3a14:       4992            ldr     r1, [pc, #584]  ; (3c60)
    3a16:       2002            movs    r0, #2
    3a18:       4479            add     r1, pc</pre>
</div>Use this at your own risk.  It works for me.  The same non-PIE curl binary now runs correctly with the patched linker:<br>
<br>
<div style="margin: 5px 20px 20px;">
	<div class="smallfont" style="margin-bottom: 2px;">Code: </div>

<pre class="alt2 " style="margin: 0px; padding: 5px; border: 1px inset currentColor; border-image: none; width: 100%; height: 146px; text-align: left; overflow: auto;" dir="ltr">$ ./curl --help
Usage: curl [options...] &lt;url&gt;
Options: (H) means HTTP/HTTPS only, (F) means FTP only
     --anyauth       Pick "any" authentication method (H)
 -a, --append        Append to target file when uploading (F/SFTP)
     --basic         Use HTTP Basic Authentication (H)
     --cacert FILE   CA certificate to verify peer against (SSL)
[...]</pre>
</div>This was tested on hammerhead-lpv79-preview-ac1d8a8e.tgz.  If somebody wants to test on razor-lpv79-preview-d0ddf8ce.tgz and post the result, that would be helpful.<br>
<br>
It is not necessary to wipe any caches after flashing, although you may want to "clear data" for any apps that were crashing prior to applying the change so that they can start fresh.<br>
<br>
Update 2014/07/21: AOSP has <a href="https://android.googlesource.com/platform/bionic/+/76e289c026f11126fc88841b3019fd5bb419bb67" target="\_blank" rel="nofollow">re-enabled the PIE check</a> after recompiling their last non-PIE binary.  I filed a <a href="https://code.google.com/p/android-developer-preview/issues/detail?id=888" target="\_blank" rel="nofollow">ticket</a> asking Google to revert this change in order to avoid breaking ABI compatibility.
</div>
</blockquote>
在早期Android L中谷歌就曾经添加过PIE安全检查，PIE是一个很有用的功能，它会随机分配程序的内存地址从而令攻击者更难发现程序的溢出漏洞。 PIE仅在Android 4.1(Jelly Bean)以上系统可用，所以很多面向很宽的系统兼容性的程序都会禁用掉该功能，当然Android L的这个特性会使得使用原生C++代码的程序出现异常，不过这个网上很容易也就找到了解决方法。这里遇到的问题是我需要通过终端执行Linux C/C++程序的二进制文件，所以就被系统的这个安全检查机制拦截了。  
在XDA论坛上的这个人制作了一个卡刷包，它覆盖了/system/bin/linker的一个字节以绕过PIE检查  
<blockquote>Use this at your own risk. It works for me. </blockquote>
作者已经声明若要使用该文件，请自负风险，刷写后不需要清除数据。经本人测试在我的Xperia Z2(L50u - System:D6503)上可以正常工作。  
论坛附件：<a href="http://forum.xda-developers.com/attachment.php?attachmentid=2821644&d=1403933203">bypass-pie.zip</a>，为了避免有打不开xdadevelopers论坛的，提供<a href="/file/post/20150627/bypass-pie.zip">本地链接</a>  

希望此文章能有帮助
