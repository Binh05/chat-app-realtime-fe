# Cấu trúc thư mục

app/
├─ (tabs)/
│ ├─ \_layout.tsx <- Bottom Tabs
│ ├─ messages/
│ │ ├─ \_layout.tsx <- Stack 1: Messages root
│ │ ├─ index.tsx <- Friend list
│ │ └─ [id]/
│ │ ├─ \_layout.tsx <- Stack 3: Chat detail root
│ │ ├─ index.tsx <- Chat detail
│ │ └─ settings/
│ │ ├─ \_layout.tsx <- Stack 4: chat settings root
│ │ └─ index.tsx <- Chat settings screen
│ └─ profile.tsx
