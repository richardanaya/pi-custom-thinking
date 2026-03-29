# pi-custom-thinking

A pi extension that lets you customize the "Thinking..." loading messages with fun, themed styles inspired by games like The Sims and various creative personas.

## Installation

### Option 1: Install via npm (recommended)

```bash
pi install npm:pi-custom-thinking
```

### Option 2: Install from git

```bash
pi install git:github.com/richardanaya/pi-custom-thinking
```

### Option 3: Local development

Clone or copy this extension to your pi extensions directory:
```bash
# Clone into global extensions
git clone <repo-url> ~/.pi/extensions/pi-custom-thinking
```

Then reload pi to load the extension:
```
/reload
```

## Configuration

Create a `~/.custom-thinking.json` file to customize your thinking messages:

```json
{
  "currentStyle": "philosopher",
  "styles": {
    "my-custom": {
      "name": "My Personal Style",
      "messages": [
        "Pondering the meaning of code...",
        "Consulting the documentation gods...",
        "Brewing a fresh response...",
        "Untangling the logic..."
      ]
    }
  }
}
```

### Configuration Options

- `currentStyle`: The default style to use (built-in or custom)
- `styles`: Define your own custom styles (merged with built-in styles)

## Built-in Styles

| Style | Description |
|-------|-------------|
| `loading` | Generic loading messages |
| `creative` | Artistic, creative-themed messages |
| `tech` | Tech jargon and ML terminology |
| `zen` | Calm, mindful messages |
| `pirate` | Pirate speak |
| `chef` | Cooking-themed messages |
| `wizard` | Fantasy/wizard-themed |
| `space` | Space and sci-fi themed |
| `philosopher` | Deep philosophical contemplations (default) |

## How It Works

The extension hooks into pi's `agent_start` and `turn_start` events to set a custom working message via the `setWorkingMessage` UI API. The message rotates randomly each time the AI starts processing, never showing the same message twice in a row.

## Creating Custom Styles

Add your own styles to `~/.custom-thinking.json`:

```json
{
  "styles": {
    "developer": {
      "name": "Developer Life",
      "messages": [
        "It works on my machine...",
        "Have you tried turning it off and on again?",
        "404: Thoughts not found",
        "Compiling sarcasm...",
        "Waiting for CI/CD..."
      ]
    }
  }
}
```

Your custom styles are merged with the built-in ones, so you can override built-in styles by using the same key.

## License

MIT
