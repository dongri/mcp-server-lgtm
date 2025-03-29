#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fetch from "node-fetch";
import type { Response } from "node-fetch";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

interface LgtmApiResponse {
  item: {
    id: number;
    url: string;
    created_at: string;
    updated_at: string;
  };
}

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

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_lgtm",
        description: "Get LGTM image and show markdown code and imageurl.",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "get_lgtm": {
      try {
        const response: Response = await fetch("https://lgtm.lol/api/bot");
        const data = await response.json() as LgtmApiResponse;
        
        if (data && data.item && data.item.url) {
          const imageUrl = data.item.url;
          const imageId = data.item.id;

          return {
            content: [
              {
                type: "text",
                text: `Markdown Code: [![LGTM](https://lgtm.lol/p/${imageId})](https://lgtm.lol/i/${imageId})`
              },
              {
                type: "text",
                text: `View Image URL in img tag: <img src="${imageUrl}" alt="LGTM" />`
              }
            ]
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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
