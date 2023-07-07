import { WordListItem } from "./word-list-item";

export class WordListResponse {
    totalItems?: number;
    totalFreqs?: number;
    searchAttribute?: string;
    items: WordListItem[] = []; 
}