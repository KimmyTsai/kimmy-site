---
slug: post-synthesis-lied-to-me
title: Simulation passed. The board disagreed.
summary: A FIFO arbiter cost me two weeks. The bug was not in the RTL — it was in my assumptions about what "simulation" means.
pubDate: 2026-06-20
tags: [Verilog, FPGA, Debugging]
draft: false
---

Functional simulation was entirely green, with waveforms textbook-clean. Then I synthesised, ran post-synthesis simulation, and the outputs started producing values that should not exist.

This is a record of the two weeks that followed.

## The symptom

The module is a FIFO arbiter: several requesters contend for one output channel. Under behavioral simulation the arbitration logic was correct. Against the post-synthesis gate-level netlist, two grant signals would briefly assert together on certain cycles.

*Briefly.* That word turned out to be the whole story.

## I looked in the wrong place first

I spent three days reading RTL. Re-checked the one-hot encoding. Re-checked the priority encoder. Re-checked that reset reached everything. All correct.

Because my working assumption was: **"simulation is right, so the netlist should be right, so the wrong thing must be the logic I wrote."**

That assumption was itself the bug.

## What actually differs

In behavioral simulation, assignments happen essentially instantaneously. In a gate-level netlist every gate has delay, and different paths have **different** delays.

Two paths in my combinational logic converged on the same grant signal. At the behavioral level they update together and no intermediate state exists. At gate level the fast path arrives first and the slow path a few hundred picoseconds later — and during that window the output sits in a state I had never considered possible.

A **glitch**.

Functionally it "doesn't exist", because everything settles before the next clock edge. But anything downstream that is level-sensitive rather than edge-sensitive will happily latch it.

## The fix

The fix itself is boring: register the output of that combinational block so grant only changes on a clock edge. The cost is one cycle of latency, in exchange for an output that does not flicker.

## What I actually took away

1. **"Simulation passed" is not one level, it's several.** Behavioral, post-synthesis, and post-implementation (with real routing delays) each test different things. Skipping the middle layers and going straight to the board means voluntarily giving up a chance to localise the problem.
2. **When simulation and hardware disagree, ask what assumptions differ between them** — not what is wrong with your logic. The first question converges far faster.
3. **Intermediate states in combinational logic are real.** Writing RTL makes it very easy to pretend they aren't.

The same line of thinking saved me again during capstone integration on the PYNQ-Z2. That one was BRAM interface timing, but the shape of the problem was identical.
