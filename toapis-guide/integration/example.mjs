import { createToAPIsImageClient } from './toapis-image-client.mjs';
import { writeFile } from 'node:fs/promises';
const client=createToAPIsImageClient({baseURL:'http://127.0.0.1:8769/v1',token:process.env.BRIDGE_TOKEN,model:process.env.TOAPIS_IMAGE_MODEL||'gpt-image-2-vip',runId:process.env.TOAPIS_RUN_ID||'recipe-tart-v1'});
const result=await client.generateImage({prompt:'A handmade lemon tart on a ceramic plate, warm cafe photography, no text.',imageSize:'1K',aspectRatio:'1:1',quality:'fast',preferredOutputFormat:'png'});
if(!result.success)throw result.error;
await writeFile('tart.png',result.data.imageData);
console.log(JSON.stringify({model:result.data.metadata.model,cost:result.cost}));
