#!/usr/bin/env node

/**
 * This is an MCP server that provides LGTM image URLs.
 * It implements a tool to fetch random LGTM images from the LGTM API.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fetch from "node-fetch";
import type { Response } from "node-fetch";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Type for LGTM API response
 */
interface LgtmApiResponse {
  item: {
    id: number;
    url: string;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create an MCP server with capabilities for tools (to get LGTM images).
 */
const server = new Server(
  {
    name: "mcp-server-lgtm",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handler that lists available tools.
 * Exposes a single "get_lgtm" tool that fetches LGTM images.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_lgtm",
        description: "Get a random LGTM image URL",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      }
    ]
  };
});

/**
 * Handler for the get_lgtm tool.
 * Fetches a random LGTM image from the API and returns the URL.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "get_lgtm": {
      try {
        const response: Response = await fetch("https://lgtm.lol/api/bot");
        const data = await response.json() as LgtmApiResponse;
        
        if (data && data.item && data.item.url) {
          return {
            content: [{
              type: "text",
              text: data.item.url
            }]
          };
        } else {
          throw new Error("Invalid response from LGTM API");
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to fetch LGTM image: ${errorMessage}`);
      }
    }

    default:
      throw new Error("Unknown tool");
  }
});

/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
