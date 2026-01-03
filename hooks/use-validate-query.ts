import { APIError } from "@/hooks/errors"
import { useQuery } from '@tanstack/react-query'

const fetchValidateQuery = async (search: string): Promise<boolean> => {
    const response = await fetch(`/api/v1/validate/${encodeURIComponent(search)}`)

    if (response.status !== 204) {
        throw await response.json()
    }

    return true
}

const useValidateQuery = (search: string) => {
    return useQuery({
        queryKey: ['validateQuery', search],
        queryFn: () => fetchValidateQuery(search),
        enabled: search.length > 0,
        placeholderData: (prev) => prev,
        retry: (failureCount, error: APIError | Error): boolean => {
            return !('error' in error && error?.error?.code === 'INVALID_SEARCH_QUERY')
        },
        staleTime: 60 * 1000,
    })
}

export { useValidateQuery, fetchValidateQuery }