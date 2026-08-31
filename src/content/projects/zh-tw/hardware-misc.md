---
slug: hardware-misc
title: 課程硬體作品集
summary: 嵌入式與 Verilog 的課程作品——PIC18 觸控板遊戲系統、FPGA 彈球遊戲，以及一次 RISC-V 組語練習。
order: 4
period: 2025 – 2026
role: 個人／小組
stack: [Verilog, C, XC8, PIC18F4520, FPGA, Python, RISC-V]
draft: false
---

一些課程與自主練習的產出。放在一起是因為它們共同構成了我後來能接畢業專題的基礎——尤其是「訊號會抖」這件事，純軟體的人不會在螢幕前遇到它。

## PIC18F4520 觸控板遊戲系統

嵌入式系統課的專題，也是這一批裡我做得最完整的一個。

用 PIC18F4520 微控制器搭配 4 線式電阻式觸控板，透過 UART 把觸控座標即時傳到 PC 端，再用 Python（pygame）做出兩款遊戲：一款是需要高精度絕對座標控制的 osu! 節奏遊戲，另一款是有物理摩擦力模擬的保齡球遊戲。

硬體端要處理的東西比想像中多：ADC 分時掃描（四線觸控板要輪流量 X、Y）、數位濾波、封包通訊，以及伺服馬達的回饋機制。

真正花掉時間的是**訊號品質**。電阻式觸控板的原始讀值會抖，抖到直接拿去畫游標會完全不能用。純軟體背景的人第一次遇到這件事會有點錯愕——程式邏輯完全正確，但輸出就是不對，因為問題根本不在程式裡。

→ [PIC18F4520-Driven-Touchpad-Gaming-System](https://github.com/KimmyTsai/PIC18F4520-Driven-Touchpad-Gaming-System)

## FPGA 彈球遊戲

數位系統課的作品。用 Verilog 在 FPGA 上實作一個彈球遊戲：VGA 輸出畫面，Keypad 控制方向，七段顯示器與 dot matrix 分別顯示分數與方向。

有趣的地方在於這是一個「所有東西都必須同時發生」的系統。VGA 的時序不會等你，畫面掃描、輸入取樣、分數更新全部得在各自的時脈域裡把事情做完。寫慣循序程式的直覺在這裡幫不上忙。

→ [FPGA-Ping-Pong-Game](https://github.com/KimmyTsai/FPGA-Ping-Pong-Game)

## RISC-V inline assembly

計算機組織課的練習，用 RISC-V inline assembly 實作鏈結串列的合併排序。除錯除了很多次才收斂，但把暫存器配置與 calling convention 真正弄懂了——後來在畢業專題上讀 CV32E40P 的程式碼時，這段經驗直接派上用場。

→ [Computer-Organization-PA3](https://github.com/KimmyTsai/Computer-Organization-PA3)
