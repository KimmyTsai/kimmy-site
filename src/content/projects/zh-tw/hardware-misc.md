---
slug: hardware-misc
title: 課程硬體作品集
summary: 嵌入式、Verilog 與演算法硬體化的一系列課程作品——NTT、FIFO arbiter、PIC18 伺服控制。
order: 3
featured: false
period: 2025 – 2026
role: 個人／小組
stack: [Verilog, XC8, PIC18F4520, C, RISC-V]
draft: false
---

一些課程與自主練習的產出，放在一起是因為它們共同構成了我後來能接畢業專題的基礎。

## 256-point NTT 硬體模組

Number Theoretic Transform 是格密碼（lattice-based cryptography）的核心運算。這個模組實作 256 點的 NTT，處理模數運算與 butterfly 結構的管線化。做完之後對「為什麼密碼學的硬體實作值得單獨開一門課」有了具體的體感。

## FIFO Arbiter

一個看起來很單純、實際上讓我卡最久的模組。**功能模擬全過，後合成模擬卻對不上**——最後追到的是模擬時序與實際閘延遲之間的假設落差。這是我第一次真正理解「模擬過了」不等於「會動」。

## PIC18F4520 伺服馬達 × 觸控板

嵌入式系統課的專題：用觸控板輸入控制伺服馬達，中間是 PWM 產生、Timer0 中斷、以及一層防彈跳邏輯。XC8 / C 開發。純軟體的人第一次遇到「訊號會抖」這件事的震撼教育。

## RISC-V inline assembly：linked list merge sort

計算機組織課的練習，用 RISC-V inline assembly 實作鏈結串列的合併排序。多次除錯才收斂，但把暫存器配置與 calling convention 真正弄懂了。
