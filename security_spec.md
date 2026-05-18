# Security Specification - Javis Portfolio Blog

## Data Invariants
1. A Blog Post must have a title, content, authorId, and createdAt.
2. Only the owner (admin) can create, update, or delete blog posts.
3. Public users can only read 'published' blog posts.
4. The admin can read all blog posts (including drafts).

## The Dirty Dozen Payloads
1. **Unauthorized Creation**: Attempt to create a blog post as an unauthenticated user. (Expect: Denied)
2. **Identity Spoofing**: Attempt to create a blog post with an authorId different from the authenticated user's UID. (Expect: Denied)
3. **Draft Leak**: Attempt to read an unpublished (published: false) blog post as a non-admin user. (Expect: Denied)
4. **Malicious Update**: Attempt to update a blog post title as a non-admin user. (Expect: Denied)
5. **Shadow Field Injection**: Attempt to create a blog post with an extra "isVerified: true" field not in schema. (Expect: Denied)
6. **Large Field Attack**: Attempt to create a blog post with a title exceeding 500 characters. (Expect: Denied)
7. **Invalid ID**: Attempt to create a blog post with a non-alphanumeric ID. (Expect: Denied)
8. **Unauthorized Deletion**: Attempt to delete a blog post as a non-admin user. (Expect: Denied)
9. **Creation with Old Timestamp**: Attempt to create a blog post with a `createdAt` in the past. (Expect: Denied)
10. **State Shortcut**: Attempt to update `createdAt` after creation. (Expect: Denied)
11. **PII Leak**: (N/A for this app, but ensures admin-only visibility for any future private data).
12. **Blanket List Read**: Attempt to query all blog posts without filtering for `published: true` as an unauthenticated user. (Expect: Denied)

## Test Runner (firestore.rules.test.ts)
```typescript
// To be implemented if tests are required
```
