---
slug: java-toolkit
title: Java Coursework
summary: A year of Java output — a TF-IDF search engine, a stock scraper and analysis tool, a Mermaid-to-Java code generator, and a card game.
order: 6
featured: false
period: '2024'
role: Individual / team
stack: [Java, jsoup, OOP]
draft: false
---

A series of pieces from the 2024 programming courses. Looking back, what they have in common is that **every one of them turns one format into another** — documents into an index, HTML into data, a class diagram into code. I did not notice at the time, but it is fairly close to what I have kept doing since.

## TF-IDF search engine

A simple search engine using TF-IDF (term frequency–inverse document frequency) to weight keywords, then search and rank. Split into two programs: `BuildIndex.java` builds the index and serialises it; `TFIDFSearch.java` loads it and answers queries.

Separating index construction from querying is the most valuable part of this assignment — it was the first concrete encounter with the idea of paying a cost once, in advance.

→ [Search-with-TF-IDF](https://github.com/KimmyTsai/Search-with-TF-IDF)

## Stock scraper and analysis toolkit

Uses `jsoup` to scrape stock prices into a CSV, then analyses what has accumulated: five-day moving averages, standard deviation, the three most volatile stocks over a given window, and regression lines.

Scraping and analysis are two modes of one program (`mode 0` scrapes, `mode 1` analyses), with the CSV on disk acting as the interface between them.

→ [Powerful-Toolkit-in-Java-Using-HTML-Parser-to-Crawl-Internet-Data](https://github.com/KimmyTsai/Powerful-Toolkit-in-Java-Using-HTML-Parser-to-Crawl-Internet-Data)

## Mermaid class diagram to Java

Takes Mermaid `classDiagram` syntax and emits the corresponding Java classes — fields, method signatures, and access modifiers generated automatically.

Writing it amounts to building a small parser, and it was the first time I had to take seriously that syntax and semantics are two different things.

→ [Code-Generator-for-Mermaid-Class-Diagram](https://github.com/KimmyTsai/Code-Generator-for-Mermaid-Class-Diagram)

## Card adventure game

The final project for the second programming course: a card game paying tribute to *Slay the Spire*, with deck building, an adventure mode, and card combos.

It is the largest codebase in this group, and where it first became clear that **object orientation is not something that exists for exams** — once enemies, cards, and status effects each have a dozen variations, inheritance and polymorphism stop being abstract nouns and become the only thing keeping the program standing.

→ [Slay-the-Spire-Java-game](https://github.com/KimmyTsai/Slay-the-Spire-Java-game)
