# Executive Summary

## What This Application Does

A **100% client-side web application** that creates Bitcoin transactions from paper wallets. Users work offline for security, manually entering transaction details and private keys to generate signed Bitcoin transactions.

## Current State

- **Status**: Functional for core transaction creation; QR scanner feature non-functional
- **Architecture**: Static HTML/CSS/JavaScript (no framework, no backend)
- **Deployment**: Can be served from any web server or run locally
- **Security Model**: Enforces offline usage for private key entry

## Critical Issue (PRD Scope)

**QR Scanner for Private Keys**: Implemented but broken. Users cannot scan paper wallet QR codes, forcing manual 51-52 character private key entry.

---
