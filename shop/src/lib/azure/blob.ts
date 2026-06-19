import { BlobServiceClient } from '@azure/storage-blob';

export function isBlobConfigured() {
  return Boolean(process.env.AZURE_STORAGE_CONNECTION_STRING);
}

function getContainerClient() {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING!;
  const container = process.env.AZURE_STORAGE_CONTAINER || 'product-images';
  const client = BlobServiceClient.fromConnectionString(conn);
  return client.getContainerClient(container);
}

export async function uploadProductImage(
  filename: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const container = getContainerClient();
  await container.createIfNotExists({ access: 'blob' });
  const blob = container.getBlockBlobClient(filename);
  await blob.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: contentType },
  });
  return blob.url;
}