# Graph Report - .  (2026-09-21)

## Corpus Check
- Corpus is ~26,854 words - fits in a single context window. You may not need a graph.

## Summary
- 441 nodes · 869 edges · 23 communities (15 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 19
- Community 20
- Community 21
- Community 22

## God Nodes (most connected - your core abstractions)
1. `requireAdmin()` - 39 edges
2. `compilerOptions` - 17 edges
3. `Reveal()` - 16 edges
4. `site` - 14 edges
5. `scripts` - 13 edges
6. `formatDate()` - 11 edges
7. `HomePage()` - 10 edges
8. `PageHero()` - 9 edges
9. `DeleteButton()` - 9 edges
10. `SubmitButton()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `AdminArticlesPage()` --calls--> `formatDate()`  [EXTRACTED]
  app/admin/(dashboard)/articles/page.tsx → lib/utils.ts
- `ReviewRow()` --calls--> `formatDate()`  [EXTRACTED]
  app/admin/(dashboard)/reviews/page.tsx → lib/utils.ts
- `AdminTreatmentsPage()` --calls--> `formatPrice()`  [EXTRACTED]
  app/admin/(dashboard)/treatments/page.tsx → lib/utils.ts
- `generateStaticParams()` --calls--> `getArticleSlugs()`  [EXTRACTED]
  app/(site)/journal/[slug]/page.tsx → lib/queries.ts
- `JournalPage()` --calls--> `getPublishedArticles()`  [EXTRACTED]
  app/(site)/journal/page.tsx → lib/queries.ts

## Import Cycles
- None detected.

## Communities (23 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (58): CertificatesPage(), metadata, ContactPage(), metadata, DoctorsPage(), metadata, JournalPage(), metadata (+50 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (42): AdminDashboard(), getStats(), ReviewRow(), Stars(), createCertificate(), deleteCertificate(), extract(), schema (+34 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (22): ArticleDefaults, Option, CATEGORIES, CertificateDefaults, CertificateForm(), parseHours(), schema, updateClinic() (+14 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (36): bcryptjs, jose, next, dependencies, bcryptjs, jose, next, @prisma/client (+28 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (22): loginAction(), loginSchema, LoginState, logoutAction(), DashboardLayout(), AdminLoginPage(), ALLOWED, POST() (+14 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+19 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (15): display, metadata, sans, AboutPage(), img(), metadata, values, Footer() (+7 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (25): autoprefixer, eslint, eslint-config-next, devDependencies, autoprefixer, eslint, eslint-config-next, postcss (+17 more)

### Community 8 - "Community 8"
Cohesion: 0.20
Nodes (10): AdminTreatmentsPage(), TreatmentForm(), createTreatment(), deleteTreatment(), extract(), parseConcerns(), parseProcess(), schema (+2 more)

### Community 9 - "Community 9"
Cohesion: 0.22
Nodes (8): AdminArticlesPage(), ArticleForm(), createArticle(), deleteArticle(), extract(), schema, toggleArticlePublished(), updateArticle()

### Community 10 - "Community 10"
Cohesion: 0.26
Nodes (8): FacilitiesPage(), metadata, FacilityGrid(), FacilityItem, GalleryGrid(), LightboxImage, LightboxModal(), getPublishedFacilities()

### Community 11 - "Community 11"
Cohesion: 0.24
Nodes (11): "AdminUser", "Article", "ArticleCategory", "ClinicLocation", "Doctor", "Faq", "Media", "SiteSetting" (+3 more)

### Community 12 - "Community 12"
Cohesion: 0.36
Nodes (4): ReviewForm(), ReviewFormState, schema, submitReview()

### Community 13 - "Community 13"
Cohesion: 0.67
Nodes (3): img(), main(), prisma

## Knowledge Gaps
- **123 isolated node(s):** `extends`, `next/core-web-vitals`, `metadata`, `values`, `metadata` (+118 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `requireAdmin()` connect `Community 1` to `Community 8`, `Community 9`, `Community 2`, `Community 4`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `site` connect `Community 6` to `Community 0`, `Community 4`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `getSession()` connect `Community 4` to `Community 1`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `metadata` to the rest of the system?**
  _123 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06775067750677506 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05328005328005328 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07751937984496124 - nodes in this community are weakly interconnected._