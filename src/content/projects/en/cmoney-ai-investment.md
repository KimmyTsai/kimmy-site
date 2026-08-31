---
slug: cmoney-ai-investment
title: AI Investment Companion
summary: Built for the CMoney × AWS AI Hackathon — turning a portfolio tracker from a bookkeeping form into something that speaks first.
order: 3
period: 2026.07 – 2026.08
role: Overall application architecture, concept development
stack: [Python, Streamlit, Amazon Bedrock, Claude, Ollama, EasyOCR]
repo: https://github.com/KimmyTsai/CMoney_Hackathon
draft: false
---

## The actual problem

A stock portfolio feature is usually a bookkeeping form: type in a few holdings, glance at the profit and loss, never come back.

The half of that sentence worth attacking is the last clause — **how do you give someone a reason to return?** Our answer was to move the system from answering generic questions to answering the question this particular person wants to ask right now.

## One principle shaped the whole architecture

> **The model transcribes; the program does the arithmetic.**

Every number — weighted average cost, sector weighting, cost percentile, alert thresholds — is computed in a deterministic code layer. The LLM only understands and expresses. We drew that line hard, because getting an investment figure wrong is not the same class of mistake as a chatbot phrasing something awkwardly.

For the same reason, every output is grounded: any number the system says out loud has to trace back to the table it came from.

## What it does

**Lower the cost of getting started.** Beyond manual entry, we used Bedrock's multimodal capability to read screenshots from trading apps and brokerage statements directly, preserving cost, share count, and purchase date per lot. Leave the cost blank and it estimates from the year's average price — because most people genuinely do not remember what they paid.

**Immediate insight cards.** Feedback has to arrive the moment the first holding is added: book return vs total return with dividends, yield on cost, cost-basis percentile, consecutive years of dividends. Nobody should have to enter thirty positions before seeing anything useful.

**Portfolio-level AI diagnosis.** One report for the whole portfolio in a single Bedrock call: investing-style reading, the gap between book and dividend-inclusive returns, sector and market-cap allocation, concentration, averaging-down detection, and identification of leveraged ETFs for what they are.

**A holdings shield.** This is the return mechanism made concrete: four alert engines — sustained institutional buying or selling, annual highs and lows, social-volume spikes with sentiment turning bearish, and ex-dividend events — validated by replaying real 2025 data, so the value of the notifications is demonstrated rather than asserted.

**Anonymous peer comparison.** A deeply underwater position shows how far it trailed the index over the year and how many people were discussing it — catching the emotion with community data instead of just showing a red number.

## Architecture

Streamlit on the front. The primary AI engine is Claude on Amazon Bedrock, handling both the written diagnosis and the screenshot vision work. A second local path — Ollama running `qwen2.5:7b-instruct`, with EasyOCR for text extraction — serves as a privacy mode and offline fallback.

The data is CMoney's official 300-stock demonstration basket across 11 tables covering quotes, institutional flows, returns, momentum, dividends, and social sentiment, with the clock fixed at 2025/12/31.
