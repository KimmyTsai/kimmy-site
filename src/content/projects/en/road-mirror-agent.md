---
slug: road-mirror-agent
title: Smart maintenance and intersection warning for road convex mirrors
summary: Using open data and computer vision to find intersections that need mirrors — and turning existing mirrors into road-condition sensing nodes.
order: 2
featured: true
period: Mar 2025 –
role: Concept, system design
stack: [Computer Vision, Open Data, Google Cloud, AI Agent]
draft: false
---

## Why mirrors

Taiwan has a great many unsignalised intersections, and convex mirrors are the cheapest fix — which is why they are scattered everywhere, and why nobody maintains them afterwards. Clouded surfaces, angles knocked out of alignment, rusted mounts: no system tracks any of it. A failed mirror is more dangerous than no mirror at all, because drivers still trust it.

## Three pillars

1. **Maintenance.** Classify mirror condition — clouding, damage, angular drift — and turn "this mirror is broken" into reportable, dispatchable data.
2. **Intersection warning.** Detect oncoming vehicles at unsignalised intersections and warn drivers early, covering the blind spots the mirror itself cannot show.
3. **Road-condition sensing.** The mirror is already mounted at the intersection; let it double as a sensing node reporting traffic and environmental data.

## Where it came from

This did not appear from nowhere. In March 2025 I wrote a project proposal titled "Road convex mirror placement assistance system", with two directions: AI-simulated sightline analysis to compute optimal placement and angle, and open data plus computer vision to identify intersections that **should** have a mirror but do not.

It is now attached to the 2026 DevJam theme, "Agent × Smart City", with the maintenance and sensing layers added on top.

> Work in progress; this page will be updated as development continues.
