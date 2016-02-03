---
layout: post
keywords: LZW
description: LZW算法
title: LZW压缩算法原理和实现
categories: [软件]
tags: [编程, LZW]
tldr: true
excerpt: LZW压缩算法学习笔记
group: archive
icon: code
---

##LZW算法
LZW编码算法，一种实现方式是对单一字符进行编码，压缩后数据需包含单一字符编码词典；另一种实现方式不需要包含词典，解压时由压缩后数据还原词典。
这里使用的是第二种实现方法，词典不需要同被压缩后的数据一同发送。这种方法中，0~255类似第一种实现方法中的单个字符词典；以下这段摘自维基百科
<blockquote>与霍夫曼编码相比，LZW编码被视作将不同长度字串以固定长的码编辑（霍夫曼编码将固定长度字元用不同长度的码编辑）。其优点在于此方法只需储存一个相当小的表格，即可储存资料还原时相对应的值，所以所需成本相对地低；然而，这种算法的设计著重在实现的速度，由于它并没有对数据做任何分析，所以并不一定是最好的演算法。</blockquote>

##一些约定
因为LZW广泛用于GIF图片格式压缩，且可用于（可选）TIFF图片压缩，在GIF中使用的LZW压缩定义了256为<code>CLEAR</code>，257为<code>END</code>，这里遵循此约定；</br>
GIF中采用的编码长度为12位，LZW允许9位到16位可变，待实现时依据效率等因素调整
##基本实现
###压缩
每次读到下一个字符时，在编码表内查找当前的prevcode与当前字符，如果找到，则更新prevcode为找到的编码表位置，否则将prevcode和当前字符写入编码表下一个位置并更新prevcode为当前字符；编码表满后，写入<code>CLEAR</code>，并重新初始化编码表；进行到文件末尾时，写入当前字符和<code>END</code>。
###解压缩
每次读到下一个编码时，判断该编码是否在0~255内</br>
如果在，则直接输出，并将前一个编码与其写入编码表下一个位置；</br>
如果不在，则再判断该编码是否在编码表内</br>
如果在，则输出其对应字符或字符串，输出时遇到0~255外的编码则继续向编码表内查找</br>
如果不在，则该字符串必然为其前一个编码所对应字符串+该字符串第一个字符</br>
遇到<code>CLEAR</code>时，清空并重新初始化编码表，遇到<code>END</code>时写入文件。

##注意
这个笔记仅说明了LZW编码的原理，实际实现过程中可能还会遇到一些细节问题；在项目中，对于该算法可以根据需要进行相应改进

##压缩和解压过程示例
<table class="table table-striped table-hover table-bordered" id="about-me">
    <tbody>
      <tr>
        <td colspan="6"><span>编码</span></td>
        <td colspan="5"><span>解码</span></td>
      </tr>
      <tr>
        <td width="9.09%"><span>prevcode</span></td>
        <td width="9.09%"><span>输入</span></td>
        <td width="9.09%"><span>位置</span></td>
        <td width="9.09%"><span>prev</span></td>
        <td width="9.09%"><span>c</span></td>
        <td width="9.09%"><span>输出</span></td>
        <td width="9.09%"><span>输入</span></td>
        <td width="9.09%"><span>位置</span></td>
        <td width="9.09%"><span>prev</span></td>
        <td width="9.09%"><span>c</span></td>
        <td width="9.09%"><span>输出</span></td>
      </tr>
      <tr>
        <td><span></span></td>
        <td><span>a</span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span>a</span></td>
        <td><span></span></td>
        <td><span>a</span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span>a</span></td>
        <td><span>a</span></td>
      </tr>
      <tr>
        <td><span>a</span></td>
        <td><span>b</span></td>
        <td><span>258</span></td>
        <td><span>a</span></td>
        <td><span>b</span></td>
        <td><span>a</span></td>
        <td><span>b</span></td>
        <td><span>258</span></td>
        <td><span>a</span></td>
        <td><span>b</span></td>
        <td><span>b</span></td>
      </tr>
      <tr>
        <td><span>b</span></td>
        <td><span>b</span></td>
        <td><span>259</span></td>
        <td><span>b</span></td>
        <td><span>b</span></td>
        <td><span>b</span></td>
        <td><span>b</span></td>
        <td><span>259</span></td>
        <td><span>b</span></td>
        <td><span>b</span></td>
        <td><span>b</span></td>
      </tr>
      <tr>
        <td><span>b</span></td>
        <td><span>a</span></td>
        <td><span>260</span></td>
        <td><span>b</span></td>
        <td><span>a</span></td>
        <td><span>b</span></td>
        <td><span>258</span></td>
        <td><span>260</span></td>
        <td><span>b</span></td>
        <td><span>258</span></td>
        <td><span>ab</span></td>
      </tr>
      <tr>
        <td><span>a</span></td>
        <td><span>b</span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span>261</span></td>
        <td><span>261</span></td>
        <td><span>258</span></td>
        <td><span>260</span></td>
        <td><span>aba</span></td>
      </tr>
      <tr>
        <td><span>258</span></td>
        <td><span>a</span></td>
        <td><span>261</span></td>
        <td><span>258</span></td>
        <td><span>a</span></td>
        <td><span>258</span></td>
        <td><span>c</span></td>
        <td><span>262</span></td>
        <td><span>261</span></td>
        <td><span>c</span></td>
        <td><span>c</span></td>
      </tr>
      <tr>
        <td><span>a</span></td>
        <td><span>b</span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span>257</span></td>
      </tr>
      <tr>
        <td><span>258</span></td>
        <td><span>a</span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span></span></td>
      </tr>
      <tr>
        <td><span>261</span></td>
        <td><span>c</span></td>
        <td><span>262</span></td>
        <td><span>261</span></td>
        <td><span>c</span></td>
        <td><span>261</span></td>
      </tr>
      <tr>
        <td><span>c</span></td>
        <td><span>EOF</span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span>c</span></td>
      </tr>
    </tbody>
  </table>
<table class="table table-striped table-hover table-bordered" id="about-me">
    <tbody>
      <tr>
        <td colspan="6"><span>编码</span></td>
        <td colspan="5"><span>解码</span></td>
      </tr>
      <tr>
        <td width="9.09%"><span>prevcode</span></td>
        <td width="9.09%"><span>输入</span></td>
        <td width="9.09%"><span>位置</span></td>
        <td width="9.09%"><span>prev</span></td>
        <td width="9.09%"><span>c</span></td>
        <td width="9.09%"><span>输出</span></td>
        <td width="9.09%"><span>输入</span></td>
        <td width="9.09%"><span>位置</span></td>
        <td width="9.09%"><span>prev</span></td>
        <td width="9.09%"><span>c</span></td>
        <td width="9.09%"><span>输出</span></td>
      </tr>
     <tr>
        <td><span></span></td>
        <td><span>a</span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span>a</span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span>a</span></td>
        <td><span>a</span></td>
     </tr>
     <tr>
        <td><span>a</span></td>
        <td><span>b</span></td>
        <td><span>258</span></td>
        <td><span>a</span></td>
        <td><span>b</span></td>
        <td><span>a</span></td>
        <td><span>b</span></td>
        <td><span>258</span></td>
        <td><span>a</span></td>
        <td><span>b</span></td>
        <td><span>b</span></td>
     </tr>
     <tr>
        <td><span>b</span></td>
        <td><span>a</span></td>
        <td><span>259</span></td>
        <td><span>b</span></td>
        <td><span>a</span></td>
        <td><span>b</span></td>
        <td><span>258</span></td>
        <td><span>259</span></td>
        <td><span>b</span></td>
        <td><span>258</span></td>
        <td><span>ab</span></td>
     </tr>
     <tr>
        <td><span>a</span></td>
        <td><span>b</span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span>c</span></td>
        <td><span>260</span></td>
        <td><span>258</span></td>
        <td><span>c</span></td>
        <td><span>c</span></td>
     </tr>
     <tr>
        <td><span>258</span></td>
        <td><span>c</span></td>
        <td><span>260</span></td>
        <td><span>258</span></td>
        <td><span>c</span></td>
        <td><span>258</span></td>
        <td><span>d</span></td>
        <td><span>261</span></td>
        <td><span>c</span></td>
        <td><span>d</span></td>
        <td><span>d</span></td>
     </tr>
     <tr>
        <td><span>c</span></td>
        <td><span>d</span></td>
        <td><span>261</span></td>
        <td><span>c</span></td>
        <td><span>d</span></td>
        <td><span>c</span></td>
        <td><span>e</span></td>
        <td><span>262</span></td>
        <td><span>d</span></td>
        <td><span>e</span></td>
        <td><span>e</span></td>
     </tr>
     <tr>
        <td><span>d</span></td>
        <td><span>e</span></td>
        <td><span>262</span></td>
        <td><span>d</span></td>
        <td><span>e</span></td>
        <td><span>d</span></td>
        <td><span>f</span></td>
        <td><span>263</span></td>
        <td><span>e</span></td>
        <td><span>f</span></td>
        <td><span>f</span></td>
     </tr>
     <tr>
        <td><span>e</span></td>
        <td><span>f</span></td>
        <td><span>263</span></td>
        <td><span>e</span></td>
        <td><span>f</span></td>
        <td><span>e</span></td>
        <td><span>g</span></td>
        <td><span>264</span></td>
        <td><span>f</span></td>
        <td><span>g</span></td>
        <td><span>g</span></td>
     </tr>
     <tr>
        <td><span>f</span></td>
        <td><span>g</span></td>
        <td><span>264</span></td>
        <td><span>f</span></td>
        <td><span>g</span></td>
        <td><span>f</span></td>
        <td><span>263</span></td>
        <td><span>265</span></td>
        <td><span>g</span></td>
        <td><span>263</span></td>
        <td><span>ef</span></td>
     </tr>
     <tr>
        <td><span>g</span></td>
        <td><span>e</span></td>
        <td><span>265</span></td>
        <td><span>g</span></td>
        <td><span>e</span></td>
        <td><span>g</span></td>
        <td><span>g</span></td>
        <td><span>266</span></td>
        <td><span>263</span></td>
        <td><span>g</span></td>
        <td><span>g</span></td>
     </tr>
     <tr>
        <td><span>e</span></td>
        <td><span>f</span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span>257</span></td>
     </tr>
     <tr>
        <td><span>263</span></td>
        <td><span>g</span></td>
        <td><span>266</span></td>
        <td><span>263</span></td>
        <td><span>g</span></td>
        <td><span>263</span></td>
     </tr>
     <tr>
        <td><span>g</span></td>
        <td><span>EOF</span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span></span></td>
        <td><span>g</span></td>
     </tr>
    </tbody>
  </table>
##压缩和解压流程图
（图片为矢量图形[每张50KB左右]，看不清可以在新页面打开放大）
<a href="/image/post/20150415/LZW_Compression.svg" target="\_blank">
<img src="/image/post/20150415/LZW_Compression.svg" width="100%" height="100%">
</a>
<a href="/image/post/20150415/LZW_Decompression.svg" target="\_blank">
<img src="/image/post/20150415/LZW_Decompression.svg" width="100%" height="100%">
</a>
