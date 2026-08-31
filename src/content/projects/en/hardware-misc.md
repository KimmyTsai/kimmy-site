---
slug: hardware-misc
title: Coursework in Hardware
summary: Embedded and Verilog coursework — a PIC18 touchpad gaming system, an FPGA ping-pong game, and an exercise in RISC-V assembly.
order: 4
featured: true
period: 2025 – 2026
role: Individual / team
stack: [Verilog, C, XC8, PIC18F4520, FPGA, Python, RISC-V]
draft: false
---

Output from coursework and self-directed practice. They belong together because collectively they are what made the capstone project possible — in particular the lesson that signals jitter, which is not something you meet in front of a screen.

## PIC18F4520 touchpad gaming system

The embedded systems course project, and the most complete thing in this group.

A PIC18F4520 microcontroller paired with a 4-wire resistive touchpad streams touch coordinates to a PC over UART, where Python (pygame) drives two games: an osu!-style rhythm game that needs precise absolute positioning, and a bowling game with friction simulation.

The hardware side carries more than it looks: time-multiplexed ADC scanning (a 4-wire panel has to measure X and Y in alternation), digital filtering, packet framing, and a servo feedback mechanism.

What actually consumed the time was **signal quality**. Raw readings from a resistive panel jitter — badly enough that feeding them straight to a cursor is unusable. Coming from pure software, this is disorienting the first time: the logic is correct, the output is wrong, and the problem is not in the program at all.

→ [PIC18F4520-Driven-Touchpad-Gaming-System](https://github.com/KimmyTsai/PIC18F4520-Driven-Touchpad-Gaming-System)

## FPGA ping-pong game

A digital systems course project: a ping-pong game in Verilog on an FPGA, with VGA output, keypad control, and a seven-segment display and dot matrix showing score and direction.

What makes it interesting is that everything has to happen at once. VGA timing does not wait for you; scanning, input sampling, and score updates each have to finish inside their own clock domain. Intuitions built on sequential programming are no help here.

→ [FPGA-Ping-Pong-Game](https://github.com/KimmyTsai/FPGA-Ping-Pong-Game)

## RISC-V inline assembly

A computer organization exercise: merge sort over a linked list, written in RISC-V inline assembly. It took a lot of debugging to converge, but it forced a real understanding of register allocation and calling conventions — which paid off directly later when reading CV32E40P source for the capstone.

→ [Computer-Organization-PA3](https://github.com/KimmyTsai/Computer-Organization-PA3)
