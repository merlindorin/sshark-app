import { APIError } from "@/hooks/errors"
import { useQuery } from '@tanstack/react-query'

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

const fetchSSHKeys = async (search: string, limit = 10, offset = 0): Promise<SearchResponse> => {
    const response = await fetch(`/api/v1/search/${encodeURIComponent(search)}?limit=${limit}&offset=${(offset) * limit}`)

    if (response.status !== 200) {
        throw await response.json()
    }

    return await response.json()
}

const useSshKeys = (search: string, limit?: number, offset?: number) => {
    return useQuery({
        queryKey: ['sshkeys', search, limit, offset],
        queryFn: () => fetchSSHKeys(search, limit, offset),
        enabled: search.length >= 2,
        placeholderData: (prev) => prev,
        retry: (failureCount, error: APIError | Error): boolean => {
            return !('error' in error && ['INVALID_SEARCH_QUERY', 'INVALID_PATH_PARAM', 'INVALID_QUERY_PARAM'].includes(error?.error?.code))
        },
        staleTime: 60 * 1000,
    })
}

export { useSshKeys, fetchSSHKeys }
export type { SSHKey, SearchResultItem, SearchResponse }
