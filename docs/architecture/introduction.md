# Introduction

This document captures the **CURRENT STATE** of the Bitcoin Paper Wallet Transaction Creator codebase, with focused emphasis on the **QR scanner functionality** and related components. This is NOT an aspirational document - it documents what exists, including the non-functional QR scanner, technical constraints, and implementation patterns.

## Document Scope

**Primary Focus**: Areas relevant to fixing the QR code scanner for private key input (as defined in PRD v2.2)

**Coverage**:
- QR scanning implementation and dependencies
- UI component architecture
- Security model (online/offline)
- Module loading system
- Related libraries and integration points

**Out of Scope**: Transaction creation logic, blockchain integration, deployment infrastructure (unless directly relevant to QR scanner)

---
