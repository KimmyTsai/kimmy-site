---
slug: shake256-slh-dsa
title: 'SHACK-256: a RISC-V ISA extension for SLH-DSA'
summary: 320-bit SIMD instructions on CV32E40P that swallow the Keccak hot path of post-quantum signatures, validated on a PYNQ-Z2.
order: 1
featured: true
period: Sep 2025 – Jun 2026
role: FPGA integration, bitstream programming, hardware testing
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

## The problem

SLH-DSA (formerly SPHINCS+) is one of the post-quantum signature schemes standardised by NIST. Its security rests on hash functions alone — elegant, but the price is an enormous number of SHAKE256 calls per signature. On a general-purpose core, essentially all of that time lands inside the Keccak-f[1600] permutation.

For embedded and IoT targets, that cost is hard to swallow.

## The approach

Rather than bolting on a standalone accelerator, we **extended the instruction set**. Starting from OpenHW's CV32E40P core, we added:

- a **320-bit SIMD register file and ALU**, sized to a lane plane of the Keccak state
- custom instructions `xor3v` (three-input XOR, matching the theta step) and `lv` / `sv` (wide vector load and store)

Extending the ISA means data never has to shuttle between CPU and accelerator. In a workload that calls the primitive this often, the bus round-trips you avoid dominate.

## System architecture

The platform is a Xilinx PYNQ-Z2. The ARM side acts as host — control and data staging — while our RISC-V core is the compute engine. The two communicate through **shared dual-port BRAM**.

Toolchain: Synopsys VCS for RTL simulation, Vivado for synthesis and implementation, `riscv32-unknown-elf-gcc` for the test firmware.

## Results

| Workload | Speedup |
| --- | --- |
| Keccak-f[1600] | ×34.76 |
| SHAKE256 | ×23.95 |
| SLH-DSA sign / verify (end to end) | up to ×13.95 |

End-to-end speedup is well below the primitive-level numbers, which is exactly what you would expect — Amdahl's Law is honest, and everything outside Keccak was never accelerated.

## My part

Simulation and silicon are two different things. I owned the path from RTL to a working board: integrating into the PYNQ-Z2 block design, getting the BRAM interface timing right, programming bitstreams, and chasing down the cases where **functional simulation passed but post-synthesis simulation disagreed**.

That was the most substantial debugging training of my degree.
