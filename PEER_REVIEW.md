# Mandatory Peer Code Review (Week 7)

This document contains draft reviews for two classmates' repositories as required by the Week 7 deliverables. Each review is at least 150 words and structured with an architectural observation, a specific code suggestion, and an open question.

---

## Peer Review 1: Crop Yield Predictor Application

### Architectural Observation
The application successfully decouples AI operations by introducing a dedicated service module (`services/aiService.js`) to handle the API connection. This abstraction layer prevents controller clutter and isolates the generative logic. However, I observed that the backend application initializes the OpenAI client client-side inside each route handler instead of holding a single, global client instance. This can lead to resource leaks and slow response times since a new TCP handshake is established for every endpoint request. I recommend initializing the OpenAI instance globally inside a startup config file and injecting it or importing it where needed.

### Specific Code Suggestion
In the file `routes/predictions.js` (around line 42), the endpoint directly forwards the raw user inputs to the prompt constructor without parsing or cleansing the inputs first. A potential improvement is to integrate a validation library like Zod to validate inputs such as predicted rainfall or soil pH limits. For example:
```javascript
const inputSchema = z.object({
  soilPh: z.number().min(0).max(14),
  rainfall: z.number().nonnegative(),
});
```
This ensures security against injection attacks and prevents sending garbage inputs to the OpenAI API, saving tokens and avoiding API validation failures.

### Question
How do you plan to handle rate-limiting and timeouts if multiple users query the prediction service simultaneously, and have you considered caching frequent predictions in a Redis cache?

---

## Peer Review 2: AgroConnect Community Portal

### Architectural Observation
I analyzed the community-forum backend architecture and noticed a robust use of mongoose models (`models/Post.js`, `models/Comment.js`) which properly structure the forum topics. However, the AI-driven tagging feature operates entirely synchronously within the post creation lifecycle. When a user submits a new post, the backend blocks the HTTP response while it awaits the external AI model's tagging results. If the AI service experiences latency or downtime, it could bottleneck the forum post submissions. Moving the auto-tagging process into an asynchronous background job queue (e.g., using BullMQ) would keep the user interface responsive.

### Specific Code Suggestion
In the file `controllers/postController.js` (near line 78), the AI service error handler catches API exceptions but does not fail gracefully. It returns a generic `500 Server Error`, which blocks the user from posting completely. I suggest wrapping the AI tagging call in a separate `try-catch` block and allowing the post to be created even if the tagging fails:
```javascript
let tags = [];
try {
  tags = await generateTags(postContent);
} catch (aiError) {
  console.error("Auto-tagging failed:", aiError.message);
  // Post will still be created with empty tags or a 'pending-review' tag
}
```
This keeps the core posting functionality intact regardless of the external API's status.

### Question
Have you tested how the AI tagger handles posts written in regional dialects or mixed languages (Hinglish/Hindi), and how do you filter out inappropriate tag suggestions?
