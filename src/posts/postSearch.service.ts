import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import Post from "./post.entity";
import PostSearchBody from "./types/postSearchBody.interface";
import PostSearchResult from "./types/postSearchResponse.interface";

@Injectable()
export default class PostSearchService {
    index = 'posts';

    constructor(private readonly elasticsearchService: ElasticsearchService) { }
}