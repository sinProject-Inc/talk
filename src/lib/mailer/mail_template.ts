export function get_html(pin_code: string): string {
  const html = `
  <html>
    <body>
      <div style="margin-left: auto;margin-right: auto;width: 100%;max-width: 500px;font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;;">
        <h1 style="margin-top: 2.5rem;margin-bottom: 0.5rem;font-size: 1.875rem;line-height: 2.25rem;font-weight: 600;">Sign in with code</h1>
        <p style="margin-bottom: 1.25rem;font-size: 1.25rem;line-height: 1.75rem;">Enter the following code into the app to sign in.</p>
        <p style="width: 100%;background-color: #F3F4F6;padding-top: 30px;padding-bottom: 30px;text-align: center;font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, &quot;Liberation Mono&quot;, &quot;Courier New&quot;, monospace;font-size: 1.875rem;line-height: 2.25rem;">
          ${pin_code}
        </p>
      </div>
    </body>
  </html>`

  return html
}