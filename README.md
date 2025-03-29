# mcp-server-lgtm MCP Server

[![smithery badge](https://smithery.ai/badge/@dongri/mcp-server-lgtm)](https://smithery.ai/server/@dongri/mcp-server-lgtm)

A Model Context Protocol server for LGTM images

This is a TypeScript-based MCP server that interacts with the LGTM API. It provides a tool to fetch random LGTM (Looks Good To Me) images that can be used in code reviews and other developer communications.

## Features

### Tools
- `get_lgtm` - Fetch a random LGTM image
  - Returns markdown code for embedding the image
  - Provides the direct image URL for use in various contexts

## Development

Install dependencies:
```bash
npm install
```

Build the server:
```bash
npm run build
```

For development with auto-rebuild:
```bash
npm run watch
```

## Installation

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mcp-server-lgtm": {
      "command": "/path/to/mcp-server-lgtm/build/index.js"
    }
  }
}
```

### Installing via Smithery

To install mcp-server-lgtm MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@dongri/mcp-server-lgtm):

```bash
npx -y @smithery/cli install @dongri/mcp-server-lgtm --client claude
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.
