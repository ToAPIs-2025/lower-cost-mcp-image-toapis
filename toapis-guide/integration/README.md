# MCP Image reuse recipe

The optional `toapis-image-client.mjs` follows the upstream `ImageClient.generateImage()` result shape. Its factory was invoked in Node.js for all three published image cases. The image-data buffer, PNG signature, model metadata and saved output were checked.

Start the Python bridge, then run `node integration/example.mjs`. Use the same separate `BRIDGE_TOKEN` in both processes. Set `TOAPIS_IMAGE_MODEL` to an enabled exact model ID and change `TOAPIS_RUN_ID` only when deliberately requesting a new paid image.

This fork keeps the upstream provider registry and default MCP configuration intact. Maintainer review is needed before adding `toapis` to the public provider enum, credential validation and tool schema. End-to-end MCP `generate_image`, prompt enhancement, reference editing and quality-preset UI are not claimed as passed. The contributed adapter is text-to-image / 1K / PNG only; the `fast` client preset selects each guide's explicit API tier, not a universal provider quality level.

