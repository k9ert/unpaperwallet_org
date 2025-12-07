# Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Browser blocks camera without HTTPS | High | Use HTTPS in production, localhost in dev |
| Module loading fails in some browsers | High | Test fix across all target browsers |
| Poor camera quality affects detection | Medium | Document minimum camera requirements |
| Different browsers handle camera APIs differently | Medium | Test early on each browser |

---
