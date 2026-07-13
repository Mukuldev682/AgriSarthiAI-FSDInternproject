# AgriSarthi Database Schema

## MongoDB Collections

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  phone: String (required, unique),
  password: String (required),
  createdAt: Date (default: Date.now)
}
```

### Crop Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  nameHindi: String,
  emoji: String (default: '🌾'),
  season: String (required, enum: ['Rabi', 'Kharif', 'Both']),
  description: String,
  diseases: [String] (default: []),
  createdAt: Date (default: Date.now)
}
```

### ChatMessage Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  role: String (required, enum: ['user', 'assistant']),
  text: String (required),
  timestamp: Date (default: Date.now)
}
```

## Schema Diagram

```
┌─────────────────┐
│     User        │
├─────────────────┤
│ _id (ObjectId)  │◄──────────────┐
│ name (String)   │               │
│ phone (String)  │               │
│ password (Str)   │               │
│ createdAt (Date)│               │
└─────────────────┘               │
                                   │
                                   │ (1:N)
                                   │
┌─────────────────┐               │
│  ChatMessage    │               │
├─────────────────┤               │
│ _id (ObjectId)  │               │
│ userId (Ref)    │───────────────┘
│ role (String)   │
│ text (String)   │
│ timestamp (Date)│
└─────────────────┘

┌─────────────────┐
│     Crop        │
├─────────────────┤
│ _id (ObjectId)  │
│ name (String)   │
│ nameHindi (Str) │
│ emoji (String)  │
│ season (String) │
│ description(Str)│
│ diseases ([Str])│
│ createdAt (Date)│
└─────────────────┘
```

## Relationships

- **User → ChatMessage**: One-to-Many (One user can have multiple chat messages)
- **Crop**: Independent collection (no direct relationships, referenced by AI responses)

## Indexes

- **User**: `phone` (unique)
- **ChatMessage**: `{ userId: 1, timestamp: -1 }` (for efficient message queries)
