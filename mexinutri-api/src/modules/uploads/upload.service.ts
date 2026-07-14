import { getSupabaseClient } from '../../config/supabase';

const BUCKET_NAME = 'dishes';

export class UploadService {
  public async uploadDishImage(
    dishId: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    const extension = this.getExtensionFromMime(mimeType);
    const fileName = `${dishId}.${extension}`;

    const supabase = getSupabaseClient();
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    const { data } = getSupabaseClient().storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  private getExtensionFromMime(mimeType: string): string {
    const mimeMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    };

    return mimeMap[mimeType] ?? 'png';
  }
}