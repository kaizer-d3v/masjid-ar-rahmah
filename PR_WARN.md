## Testing WARN verdict via DB heuristic

Adds SQL schema file — file path pattern matches `/database/` directory which triggers **DB** categorization.

### Heuristic path (no baseline on this base branch):
- `schema.sql` in `src/database/` → category: **DB**
- `hasDbChanges = true` → verdict: **WARN**, conclusion: **neutral**

### Expected check run:
- Category: DB
- Verdict: WARN
- Conclusion: neutral
- Summary should include: ⚠️ Review recommended: significant behavioral changes detected
