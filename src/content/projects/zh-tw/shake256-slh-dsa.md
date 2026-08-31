---
slug: shake256-slh-dsa
title: SHAKE-256：為 SLH-DSA 設計的 RISC-V 指令集擴充
summary: 在 CV32E40P 上加一組 320-bit SIMD 指令，把後量子簽章的 Keccak 熱點吃掉，於 PYNQ-Z2 實測驗證。
order: 1
featured: true
period: 2025.09 – 2026.06
role: FPGA 整合、bitstream 燒錄、硬體實測
stack:
  - Verilog
  - RISC-V
  - Vivado
  - Synopsys VCS
  - PYNQ-Z2
  - C
repo: ''
demo: ''
cover: ''
draft: false
---

## 問題

SLH-DSA（原 SPHINCS+）是 NIST 選定的後量子簽章標準之一。它的安全性只依賴雜湊函數，這件事很迷人——但代價是簽章過程要呼叫**極大量**的 SHAKE256。在通用處理器上跑，時間幾乎全部堆在 Keccak-f[1600] 這個 permutation 上。

對嵌入式或 IoT 這種算力有限的場景，這個成本高到不太能接受。

## 做法

我們沒有走「外掛一顆獨立加速器」的路，而是**擴充指令集**：以 OpenHW 的 CV32E40P 為基礎核心，加上

- 一組 **320-bit 的 SIMD 暫存器與 ALU**（正好對應 Keccak state 的一個 lane plane）
- 自訂指令 `xor3v`（三輸入 XOR，對應 theta 步驟）、`lv` / `sv`（寬向量載入儲存）

指令集擴充的好處是資料不必在 CPU 與加速器之間來回搬，省掉的匯流排往返在這種高頻呼叫的場景下非常可觀。

## 系統架構

平台是 Xilinx PYNQ-Z2：ARM 端當 host 負責控制與資料準備，我們自己的 RISC-V 核心當 compute engine，兩者透過**共用的 dual-port BRAM** 溝通。

工具鏈用 Synopsys VCS 做 RTL 模擬、Vivado 做合成與實作、`riscv32-unknown-elf-gcc` 編譯測試韌體。

## 結果

| 項目 | 加速比 |
| --- | --- |
| Keccak-f[1600] | ×34.76 |
| SHAKE256 | ×23.95 |
| SLH-DSA 簽章／驗證（端到端） | 最高 ×13.95 |

端到端的加速比明顯低於單一 primitive，這是預期內的——Amdahl's Law 很誠實，Keccak 以外的部分沒有被加速。

## 我負責的部分

模擬跟上板是兩件事。我負責把設計從 RTL 帶到實際板子上：整合到 PYNQ-Z2 的 block design、處理 BRAM 介面的時序、燒 bitstream、以及在**功能模擬過了但後合成模擬（post-synthesis）對不上**的時候，把差異一路追回去。

這段經驗大概是我整個大學裡最扎實的除錯訓練。
