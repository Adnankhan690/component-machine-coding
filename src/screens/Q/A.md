# Q1. Handling CSP While Embedding a Page with Inline Styles

To mitigate XSS attacks, we enforce a Content Security Policy (CSP) across the application.

A global CSP is applied with `style-src 'self'` to restrict styles to trusted sources.

We need to embed another HTML page within our application using an `<iframe>`.
The embedded page contains inline styles, which are blocked by the global CSP.

We must allow this embedded content to render correctly without weakening global CSP protections.

## Proposed Solutions

### Solution 1: Use CSP Nonce (Recommended Approach)

This approach allows inline styles securely without relaxing the global CSP.

1. Generate a random nonce value per request.
2. Add the nonce to the CSP header:

   ```text
   style-src 'self' 'nonce-{nonce}';
   ```

3. Inject the same nonce into the inline styles of the embedded HTML:

   ```html
   <style nonce="{nonce}"></style>
   ```

4. If the content is embedded using `iframe srcdoc`, ensure the nonce is injected into the `srcdoc` HTML (the nonce attribute on the `<iframe>` itself is optional and not required).

✅ This method preserves CSP strength while allowing trusted inline styles.

### Solution 2: Route-Specific CSP Override (Less Secure)

This approach relaxes CSP rules for a specific, trusted route.

```nginx
location /template {
    add_header Content-Security-Policy "
        frame-src https://trusted-iframe.com;
        frame-ancestors 'none';
        style-src 'unsafe-inline';
    " always;
}
```

- `/template` is a dedicated route for rendering the embedded page.
- Inline styles are allowed using `'unsafe-inline'` for this route only.
- This approach should be used only when nonce-based injection is not feasible, as it weakens CSP protections.

## Recommendation

- **Prefer Solution 1 (Nonce-based CSP)** for better security and compliance with CSP best practices.
- Use **Solution 2** only as a fallback when modifying the embedded HTML is not possible.
