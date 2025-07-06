import { AwsClient } from 'aws4fetch';

export default {
  async fetch(request, env, ctx) {
    const key = new URL(request.url).pathname.slice(1);
	if (!key) {
	  return new Response("Key is required", { status: 400 });
	}
    const aws = new AwsClient({
      accessKeyId: env.C2_READONLY_ACCESS_KEY,
      secretAccessKey: env.C2_READONLY_SECRET_KEY,
      service: 's3',
      region: env.C2_REGION,
    });

    const s3url = `${env.C2_ENDPOINT}/${env.C2_BUCKET_NAME}/${key}`;
    const resp = await aws.fetch(s3url);

    return new Response(resp.body, {
      status: resp.status,
      headers: {
        ...resp.headers,
        "Cache-Control": "public, max-age=86400"
      }
    });
  }
}