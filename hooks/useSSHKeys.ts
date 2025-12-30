import {useQuery} from '@tanstack/react-query'

interface SSHKey {
    id: string;
    username: string;
    source: string;
    provider: string;
    key: string;
    options: string[];
    comment: string;
    type: string;
    updated_at: string;
}

type SearchResultItem = SSHKey[];

interface SearchResponse {
    entities: SearchResultItem;
    total: number;
    limit: number;
    offset: number;
    duration: number;
}

const fetchSSHKeys = async (search: string, limit = 10, page = 1): Promise<SearchResponse> => {
    const response = await fetch(`/api/v1/search/${encodeURIComponent(search)}?limit=${limit}&offset=${(page-1) * limit}`)
    return await response.json()
}

const useSSHKeys = (search: string, limit: number, page: number) => {
    return useQuery({
        queryKey: ['sshkeys', search, limit, page],
        queryFn: () => fetchSSHKeys(search, limit, page),
        enabled: search.length >= 2,
        placeholderData: (prev) => prev,
        staleTime: 60 * 1000,
    })
}

export {useSSHKeys, fetchSSHKeys}
export type {SSHKey, SearchResultItem, SearchResponse}
