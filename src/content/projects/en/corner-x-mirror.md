---
slug: corner-x-mirror
title: Corner.X — A Data Network for Street Mirrors
summary: Turning the convex traffic mirrors nobody maintains into a ranked, dispatchable inventory, using street-view imagery and open accident data.
order: 2
featured: true
period: Proposal 2025.03 · DevJam 2026.08
role: Problem framing, system design
stack: [Python, Google Cloud, BigQuery, Vertex AI, Gemini, Cloud Run, Street View API]
repo: https://github.com/KimmyTsai/corner-x-mirror
draft: false
---

## Why mirrors

Taiwan has a great many unsignalised intersections, and a convex mirror is the cheapest fix available. So they are everywhere — and then nobody looks after them. Clouded glass, brackets knocked out of alignment, rusted posts: no system tracks any of it.

A failed mirror is more dangerous than no mirror at all, because drivers still trust it.

## Two scores, not one

This is the core design decision. "Where should a mirror go?" and "Which mirror needs repair?" are different questions with different inputs, different actions, and different owners. Forcing them into a single score does neither of them well.

| | Installation need | Maintenance need |
| --- | --- | --- |
| Subject | Intersections with no mirror | Sites that already have one |
| Input | Accident data, intersection geometry, occlusion, sensitive facilities | Street-view assessment × site risk |
| Action | New installation | Dispatch a repair crew |

The maintenance priority formula lives in `schema.sql`:

```
priority_score = condition_score × (0.5 + risk_score / 100)
```

Given two equally dirty mirrors, the one on a primary-school walking route gets fixed first. **That single line is the difference between this system and a plain image classifier** — deciding whether a mirror is dirty is a computer vision problem; deciding which one to fix first is a risk-ranking problem.

## No inventory? Build one

We started from the assumption that we could obtain each city's open data on mirror locations. It turned out most municipalities simply do not publish one.

So `pipeline/detect.py` sweeps street-view imagery and builds the coordinate inventory itself. This stopped being a fallback and became the most interesting part of the project: **to govern a class of assets, you first need a way to enumerate them when no one hands you the list.**

Assessment runs in two stages, because doing it in one pass costs too much:

1. **Stage 1** — `detect.py` scans wide-angle street view to locate mirror coordinates
2. **Stage 2** — `inspection.py` pulls a zoomed close-up per coordinate and sends it to Gemini for condition assessment

`validate.py` runs precision / recall separately, so the numbers are not just our own claim.

## The shape of the system

BigQuery holds the data, with two scoring views — `v_installation_need` and `v_maintenance_priority` — mapping directly onto the two questions above. The API runs on Cloud Run. The front end has two doors: a map for administrators, and a mobile page where the public uploads a photo and location.

That public reporting path deliberately does more than collect photos: free text is converted into structured facts, and doubles as a calibration signal for the model's assessments.

Accident data comes from Taipei City's open casualty-incident records.

## Grown out of a project proposal

This did not start as a hackathon idea. In March 2025 I wrote a proposal for a "road mirror siting assistance system", built around two directions: using sight-line analysis to compute optimal placement and angle, and combining open data with computer vision to find intersections that *should* have a mirror but do not.

In August 2026 the DevJam theme "Agent × Smart City" gave us a reason to add the maintenance and sensing layers on top — and that became Corner.X.

> Work in progress; this page will change as the project does.
