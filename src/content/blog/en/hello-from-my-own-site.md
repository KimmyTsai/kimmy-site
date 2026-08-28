---
slug: hello-from-my-own-site
title: Taking my work off the hackathon servers
summary: Almost everything I built used to live on Streamlit or Cloud Run, and then quietly died after the contest. Doing it differently this time.
pubDate: 2026-08-28
tags: [Meta]
draft: false
---

Over the past two years I have written a fair number of websites, but nearly all of them existed for a hackathon: conjured up in three days, demoed, then left alone. Some ran on Streamlit, some got wrapped in a container and pushed to Cloud Run.

And then they started to die. Free tiers ran out, dependency versions drifted, and environment variables I set casually at 3am became unrecoverable. Six months later the link opens onto a cold-start failure page.

The problem is not Streamlit, and not Cloud Run — both are good tools. The problem is that I was using **the way you run an application** to carry **something that was meant to persist**.

## What I'm doing instead

This site is static. Posts are Markdown, stored in Git; every change rebuilds into plain HTML served from a CDN. No server has to stay awake, no container cold-starts, nothing silently expires while I'm not looking.

Put differently: **it does not break just because I ignored it for three months.**

To publish, I log into an admin panel in the browser — but underneath, that still commits a Markdown file to the repository. The content stays mine. If the platform disappears tomorrow, I rebuild the same files somewhere else.

## What will be here

- Hardware debugging notes, especially the "simulation passed but the board disagreed" genre
- Technical decision records for projects, including why I *didn't* take the other road
- The complete contest log, including the ones I didn't place in

That last one is deliberate. A page that lists only wins looks better, but it isn't what the work actually looks like.
