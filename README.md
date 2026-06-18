# Mentor — Grounded Theory Curation Prototype

Interactive prototype implementing the thesis **GTA-DCM**, **ArtEModel-GT**, and **RITL-C** models for Grounded Theory research artefact curation (MENTOR project).

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Features

- **5-phase workflow**: Problem Statement → Data Acquisition → Data Management → Analysis → Report
- **GTA-DCM domain model**: artefacts, research context, actors, codes, categories, theory
- **RITL-C consensus**: voting on codes, categories, theory, and phase transitions
- **Version history**: commit-style changelog on Problem Statement
- **Analysis**: open coding workspace, theory graph, reflexivity memos
- **Export**: JSON, Markdown report, RO-Crate zip (FAIR-oriented)
- **Persistence**: localStorage

## Stack

React 19, TypeScript, Vite, Tailwind CSS 4, D3, Lucide React

## Seed project

"Curation and Exploration" — sociocultural communication in Montevideo photo murals (constructivist GT), blended with U C1 thesis validation case study data.
