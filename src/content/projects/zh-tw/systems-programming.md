---
slug: systems-programming
title: 作業系統與系統程式
summary: 用 C 把作業系統課本裡的東西一個一個做出來——shell、檔案系統、kernel module、semaphore。
order: 5
featured: false
period: 2025.10 – 2026.01
role: 個人
stack: [C, Linux, Kernel Module, POSIX]
draft: false
---

作業系統這門課的一系列實作。我把它們放在一起，是因為它們有一個共同的性質：**這些東西你每天都在用，但在自己寫出來之前，你並不真的知道它們怎麼運作。**

## Shell

用 C 實作一個 shell，內建指令與外部指令都要支援，並且能處理用 pipe 串起來的多個指令。

`fork` / `exec` / `wait` 這組東西在課本上看起來很直觀，真的要讓 `a | b | c` 正確運作時才會發現細節全在檔案描述子的管理上——哪個 fd 該關、什麼時候關、關漏了會怎樣（答案是：程式不會錯，它會直接掛在那裡不動）。

→ [Shell-Implementation-In-C](https://github.com/KimmyTsai/Shell-Implementation-In-C)

## 檔案系統

同樣用 C 實作一個檔案系統。做完之後對 inode 這個抽象的感覺完全不一樣了——它不再是一個名詞，而是一組你得自己維護的資料結構。

→ [OSLAB4-File-System-Implementation](https://github.com/KimmyTsai/OSLAB4-File-System-Implementation)

## 多執行緒程式與 Linux kernel module

這個 lab 有兩個部分：多執行緒程式，以及一個真的要編譯進 Linux 核心的 kernel module。

寫 kernel module 最有教育意義的地方是**沒有安全網**。使用者空間的程式寫壞了就是 segfault，核心空間寫壞了是整台機器停住。這件事會讓人重新看待自己平常寫程式時有多依賴作業系統幫忙擦屁股。

→ [OSLab3-Multithreading-Program-Linux-Kernel-Module](https://github.com/KimmyTsai/OSLab3-Multithreading-Program-Linux-Kernel-Module)

## Sender / Receiver 與 semaphore

用 semaphore 做行程間的同步，實作一組 sender 與 receiver。這是整個系列裡最短的一個，但也是第一次真正遇到「程式跑十次有九次是對的」這種問題——競爭條件不會每次都發生，所以它比一般的 bug 更難說服自己已經修好了。

→ [Sender-And-Receiver-Using-Semaphore](https://github.com/KimmyTsai/Sender-And-Receiver-Using-Semaphore)
