export interface SearchResultItemDto {
  type: 'ingredient' | 'dish';
  id: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
}

export interface SearchResponseDto {
  query: string;
  results: SearchResultItemDto[];
}
