---
slug: hardware-misc
title: Coursework hardware portfolio
summary: Embedded, Verilog and algorithm-to-hardware coursework — NTT, a FIFO arbiter, PIC18 servo control.
order: 3
featured: false
period: 2025 – 2026
role: Individual / small team
stack: [Verilog, XC8, PIC18F4520, C, RISC-V]
draft: false
---

A set of coursework and self-directed builds, grouped together because collectively they are what made the capstone possible.

## 256-point NTT hardware module

The Number Theoretic Transform is the core operation of lattice-based cryptography. This module implements a 256-point NTT, handling modular arithmetic and pipelining the butterfly structure. Finishing it gave me a concrete sense of why cryptographic hardware implementation deserves a course of its own.

## FIFO arbiter

A module that looked trivial and cost me the most time. **Functional simulation passed cleanly; post-synthesis simulation did not agree** — the root cause turned out to be a gap between my timing assumptions and real gate delays. It was the first time I properly understood that "simulation passes" is not "it works".

## PIC18F4520: servo motor × touchpad

Embedded systems course project: touchpad input driving a servo motor, with PWM generation, a Timer0 interrupt, and a debounce layer in between. Developed in XC8 / C. A useful shock for someone whose signals had previously always been clean.

## RISC-V inline assembly: linked list merge sort

A computer organization exercise implementing merge sort over a linked list in RISC-V inline assembly. It took several debugging passes to converge, but register allocation and the calling convention finally stopped being abstractions.
