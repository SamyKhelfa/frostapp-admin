import {type IChapter} from "@core/interfaces";
import {emptySplitApi} from "@infra/http";

export const chapterApi = emptySplitApi.injectEndpoints({
    endpoints(builder) => ({
    getChapters: builder.query<IChapter[], void>({
        query: () => ({
        })
    })
})
})