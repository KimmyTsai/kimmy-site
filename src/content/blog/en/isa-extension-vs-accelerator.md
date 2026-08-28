---
slug: isa-extension-vs-accelerator
title: Why we extended the ISA instead of bolting on an accelerator
summary: Post-quantum signing spends almost all its time in Keccak. Given two ways to accelerate it, we took the harder one — because of data movement.
pubDate: 2026-05-30
tags: [RISC-V, Post-quantum crypto, Architecture]
draft: false
---

The capstone goal was accelerating SLH-DSA. Profiling left no ambiguity: nearly all the time goes into SHAKE256, and inside that, the Keccak-f[1600] permutation.

The question was how.

## Two roads

**A: a standalone accelerator.** Build a dedicated Keccak IP, hang it off the bus. The CPU writes the state over, kicks it off, waits, reads the result back.

**B: extend the instruction set.** Add registers and functional units inside the CPU core, driven by new instructions.

A is easier. The IP can be verified in isolation, the interface is simple, and you never touch the CPU datapath — and touching the datapath means understanding someone else's core, which for CV32E40P is not a small codebase.

We took B.

## The reason is data movement, not arithmetic

What matters is **call frequency**.

A single SLH-DSA signature invokes Keccak tens of thousands of times. If every one of those calls means:

```
write 1600 bits to the accelerator
start it
poll or wait for an interrupt
read 1600 bits back
```

then the time actually spent computing drowns in bus round-trips. It does not matter how fast the accelerator is — you would be optimising the smaller term in the denominator.

An ISA extension lets the state live in CPU registers. No transfer, no handshake, no polling.

## What we added

- **A 320-bit SIMD register file and ALU.** The width is not arbitrary: it matches one lane plane of the Keccak state (5 × 64 bits).
- **`xor3v`**, a three-input XOR. The theta step is full of chained XORs; folding them into one instruction removes a meaningful number of instructions.
- **`lv` / `sv`**, wide vector load and store.

## The numbers

Keccak-f[1600] itself: ×34.76. SHAKE256: ×23.95.

End-to-end SLH-DSA sign/verify: up to ×13.95.

That gap is not a failure, it's **Amdahl's Law**. We accelerated the hot path and nothing else — hash tree traversal, memory operations, control flow all ran at their original speed. Once the hot path is compressed enough, everything else starts to dominate.

To push further, the next step is not making Keccak faster (there is little left there) but finding out what the second hot spot is.

## The cost

Honestly, road B is expensive:

- You have to understand someone else's CPU core: its pipeline, hazard handling, and how to extend the decoder.
- The toolchain has to follow. The compiler does not know your instructions, so you start out writing inline assembly.
- Verification gets harder. You modified the core itself, so everything that used to pass has to be re-run.

If you only need a working demo, A is the better trade. But if the goal is a design that means something in a real embedded deployment, data movement is the problem you cannot route around.
