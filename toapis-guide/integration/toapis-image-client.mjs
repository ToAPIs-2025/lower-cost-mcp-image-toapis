// Optional ImageClient implementation. Existing MCP provider registration is unchanged.
export function createToAPIsImageClient({baseURL,token,model='gpt-image-2-vip',runId='default'}) {
  const url=new URL(baseURL);
  if(url.protocol!=='http:' || url.hostname!=='127.0.0.1' || url.pathname.replace(/\/$/,'')!=='/v1') throw new Error('Use the local bridge http://127.0.0.1:<port>/v1');
  if(!['gpt-image-2-vip','gpt-image-2','gpt-image-2.5-flare'].includes(model)) throw new Error('Unsupported model preset');
  return { async generateImage(params) {
    try {
      if(params.inputImages?.length || params.useGoogleSearch || params.imageSize && params.imageSize!=='1K' || params.preferredOutputFormat && params.preferredOutputFormat!=='png') throw new Error('This contribution enables text-to-image, 1K and PNG only');
      if(params.quality && params.quality!=='fast') throw new Error('Only the inspected fast preset is enabled; API tier is explicit in the guide');
      const size=params.aspectRatio==='16:9'?'1536x864':params.aspectRatio && params.aspectRatio!=='1:1'?null:'1024x1024';
      if(!size) throw new Error('Only 1:1 and 16:9 are enabled');
      const response=await fetch(baseURL.replace(/\/$/,'')+'/images/generations',{method:'POST',headers:{'Authorization':'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({model,prompt:params.prompt,size,n:1,response_format:'b64_json',run_id:runId}),signal:params.signal ?? AbortSignal.timeout(900000)});
      if(!response.ok) throw new Error('Local media bridge returned HTTP '+response.status+'; inspect saved task before another call');
      const data=await response.json();const imageData=Buffer.from(data.data?.[0]?.b64_json ?? '','base64');
      if(!imageData.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) throw new Error('Expected actual PNG output');
      return {success:true,data:{imageData,metadata:{model,provider:'toapis',prompt:params.prompt,mimeType:'image/png',timestamp:new Date(),inputImageProvided:false}},cost:data.billing};
    } catch(error) {return {success:false,error:error instanceof Error?error:new Error('Image request failed')}}
  }};
}
