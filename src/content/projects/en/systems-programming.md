---
slug: systems-programming
title: Operating Systems & Systems Programming
summary: Building the operating systems textbook one piece at a time in C — a shell, a file system, a kernel module, semaphores.
order: 5
featured: false
period: 2025.10 – 2026.01
role: Individual
stack: [C, Linux, Kernel Module, POSIX]
draft: false
---

A series of implementations from the operating systems course. They belong together because they share a property: **you use all of these every day, and you do not really know how any of them work until you have written one.**

## A shell

A shell in C, supporting both builtin and external commands, and able to handle several commands joined by pipes.

`fork` / `exec` / `wait` look straightforward in a textbook. Making `a | b | c` actually work is where you discover the detail lives entirely in file descriptor management — which fd to close, when to close it, and what happens if you miss one (answer: the program does not fail, it simply hangs there forever).

→ [Shell-Implementation-In-C](https://github.com/KimmyTsai/Shell-Implementation-In-C)

## A file system

A file system, also in C. Finishing it changed how the inode abstraction feels entirely — it stops being a noun and becomes a data structure you are responsible for maintaining.

→ [OSLAB4-File-System-Implementation](https://github.com/KimmyTsai/OSLAB4-File-System-Implementation)

## Multithreading and a Linux kernel module

Two parts: a multithreaded program, and a kernel module that genuinely compiles into the Linux kernel.

The instructive thing about kernel modules is that **there is no safety net**. Break a userspace program and you get a segfault. Break something in kernel space and the machine stops. It makes you reconsider how much your ordinary programming relies on the operating system cleaning up after you.

→ [OSLab3-Multithreading-Program-Linux-Kernel-Module](https://github.com/KimmyTsai/OSLab3-Multithreading-Program-Linux-Kernel-Module)

## Sender / receiver with semaphores

Inter-process synchronisation using semaphores, implemented as a sender and receiver pair. The shortest item in the series, and the first place I met the problem where a program is correct nine runs out of ten — race conditions do not fire every time, which makes them much harder to convince yourself you have actually fixed.

→ [Sender-And-Receiver-Using-Semaphore](https://github.com/KimmyTsai/Sender-And-Receiver-Using-Semaphore)
