# 🎓 LBS Tool – B.Sc. Nursing Admission Analytics & Viability Platform

A specialized educational data analytics and decision-support web application that standardizes multi-year state allotment records, calculates closing cutoffs across reservation quotas, and evaluates candidate admission viability across **180 nursing colleges in Kerala**.

🔗 [Open Live Application](https://lbs-tool.vercel.app/)

---

## 📌 Problem Context & Objectives

State professional nursing admissions conducted by the LBS Centre for Science & Technology involve complex multi-round allotments across heterogeneous reservation categories. Prospective students and academic counselors face significant information asymmetry when trying to assess realistic admission chances based on their normalized 10+2 index scores.

* **Data Normalization:** Ingest, standardize, and clean multi-round historical allotment lists spanning two full admission cycles.
* **Cutoff Benchmark Engineering:** Establish definitive institution-quota cutoff thresholds across all recognized merit categories.
* **Rule-Based Decision Support:** Provide candidate-level viability classification (*Safe*, *Possible*, *Dream*) based on historical mark-delta buffers.
* **Advisory Funnel Integration:** Route evaluated candidates directly to professional education counselors via automated lead structuring.

---

## 🛠️ Technical Stack & Data Pipeline

* **Data Engineering & Analysis:** Python, Pandas
* **Frontend & Application Architecture:** Next.js, React, Tailwind CSS
* **Deployment & Hosting:** Vercel
* **Integration:** Automated WhatsApp URL schema for structured lead routing

---

## 📊 Analytical Scope & Metrics

| Dimension | Scope / Metric |
| :--- | :--- |
| **Allotment Records Processed** | **12,195 raw student allotment records** ingested from official state portals |
| **Admission Cycles Covered** | **2024 and 2025** complete regular allotment rounds |
| **Institutional Coverage** | **180 colleges** across all 14 districts of Kerala (Government, Aided, and Self-Financing) |
| **Cutoff Benchmarks Derived** | **1,426 distinct college-quota closing cutoff baselines** |
| **Quota Normalization** | Consolidated 22 raw allotment designations down to standardized statutory merit quotas (State Merit, EWS, Ezhava, Muslim, SC, ST, Latin Catholic, etc.) |

---

## ⚙️ Decision Logic: The Mark-Delta Model

The application evaluates candidate viability deterministically using a mark-buffer formula:

$$\text{Buffer} = \text{Candidate PCB Index Mark} - \text{Quota Historical Closing Cutoff}$$

* **🟢 SAFE ($\text{Buffer} \ge +8$ marks):** Candidate's index score exceeds the historical closing threshold with a strong safety cushion.
* **🟡 POSSIBLE ($-5 \le \text{Buffer} < +8$ marks):** Candidate sits within a competitive historical variance band.
* **🔴 DREAM ($\text{Buffer} < -5$ marks):** High-reach institution where the historical closing cutoff significantly exceeds the candidate's current score.

---

## 🚀 Key Application Features

1. **Deterministic Viability Classification:** Calculates real-time eligibility across all 180 institutions based on candidate PCB marks, category quota, and district preferences.
2. **Curated 5-Choice Recommendation Set:** Automatically structures a balanced college application preference list anchoring top Government colleges alongside realistic private institutions.
3. **Counselor Lead Dispatch:** Pre-formats the candidate's evaluated profile, score, and matched institutions into an automated dispatch message routed to educational consultancy advisors.
