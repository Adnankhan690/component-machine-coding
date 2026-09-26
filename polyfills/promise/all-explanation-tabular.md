JavaScript provides four built-in **Promise combinators** to handle multiple asynchronous operations concurrently. They differ primarily in how they handle fulfillment, rejection, and short-circuiting.

---

### Tabular Comparison

| Promise Method | Fulfills (Succeeds) When... | Rejects (Fails) When... | Return Value / Output | Short-circuit Behavior |
| --- | --- | --- | --- | --- |
| **`Promise.all`** | **All** promises fulfill successfully. | **Any** single promise rejects. | An array of all fulfillment values (in order). | Short-circuits and rejects immediately on the **first rejection**. |
| **`Promise.allSettled`** | **All** promises are settled (either fulfilled or rejected). | **Never** rejects (always fulfills once everything is done). | An array of objects describing each outcome (`{ status: 'fulfilled', value }` or `{ status: 'rejected', reason }`). | Waits for **all** promises to finish regardless of success/failure. |
| **`Promise.race`** | The **first** promise settles (fulfills or rejects). | The **first** promise settles with a rejection. | The value or error of the **first** settled promise. | Short-circuits immediately as the **very first** promise settles. |
| **`Promise.any`** | **At least one** promise fulfills. | **All** promises reject. | The value of the **first fulfilled** promise. | Short-circuits on the **first fulfillment**, or waits until **all** reject (throwing an `AggregateError`). |

---

### Key Behavioral Breakdown

* **`Promise.all` (All or Nothing):** Best used when you need all requests to succeed to proceed (e.g., fetching multiple configuration files). If one fails, the whole batch fails.
* **`Promise.allSettled` (Complete Audit):** Best used when you want to know the outcome of every operation independently, regardless of whether some failed (e.g., running a batch of independent API requests where partial success is acceptable).
* **`Promise.race` (First Across the Finish Line):** Best used when you want the fastest response regardless of success or failure (e.g., setting a timeout race against an API request).
* **`Promise.any` (First Success Wins):** Best used when you have redundant sources or mirrors and only need **one** of them to succeed (e.g., fetching data from multiple redundant CDNs until one responds successfully).