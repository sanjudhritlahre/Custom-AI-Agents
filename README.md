# Custom AI Agent with LangGraph in JavaScript

A lightweight starter project for building a custom AI agent using JavaScript/TypeScript, Bun, and LangGraph. This project demonstrates how to create an agent that can chat with users, interact with tools, and maintain context across a conversation.

## Overview

This repository is designed as a practical foundation for experimenting with AI agents in a modern JavaScript environment. The goal is to provide a simple but extensible setup where you can connect an LLM-powered agent to tools such as web browsing and memory-based conversation handling.

## Tech Stack

- Bun - fast JavaScript runtime and package manager
- JavaScript/TypeScript - application logic and agent workflow code
- LangGraph - orchestration for agent workflows and stateful execution
- dotenv - environment variable management
- Optional LLM provider SDKs - such as OpenAI or similar integrations for model access

## Features

- Chat with an AI agent in a simple interactive flow
- Web browsing capabilities for retrieving live information
- Conversation memory so the agent can remember prior context
- Extensible architecture for adding tools, prompts, and workflows

## Project Setup

### Prerequisites

Make sure you have the following installed:

- Bun
- Node.js (recommended for compatibility with tooling)

### Install Dependencies

From the project root, run:

```bash
bun install
```

### Environment Variables

Create a `.env` file in the project root and add any required API keys or configuration values for your LLM provider.

Example:

```env
OPENAI_API_KEY=your_api_key_here
```

### Run the Project

Start the app with:

```bash
bun run index.ts
```

## Package Installation Examples

If you want to add or expand functionality, you can install additional packages with Bun. For example:

```bash
bun add langgraph
bun add dotenv
bun add @langchain/openai
bun add @langchain/core
```

If you are working with TypeScript support in a more formal setup, you may also want:

```bash
bun add -D typescript @types/node
```

## Future Implementation Suggestions

Here are some strong next steps for this project:

- Add a real web UI using React, Next.js, or a simple frontend framework
- Store conversation history in a database for persistent memory
- Add support for RAG (retrieval-augmented generation) using vector search
- Introduce tool calling for file operations, calendars, or APIs
- Support streaming responses for a more interactive chat experience
- Add authentication and user-specific memory
- Deploy the agent as a web service or API

## Summary

This project is a solid starting point for building a customized AI agent with LangGraph in JavaScript. It combines modern tooling, agent orchestration, and extensible features to help you prototype intelligent workflows quickly.