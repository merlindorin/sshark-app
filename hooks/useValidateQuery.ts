import {useQuery} from '@tanstack/react-query'

interface ValidateResponse {
    query: string
    is_valid: boolean
    message: string
    explanation: string
}

interface ValidationResult {
    isValid: boolean
    message: string
}

const fetchValidateQuery = async (search: string): Promise<ValidationResult> => {
    const response = await fetch(`/api/v1/validate/${encodeURIComponent(search)}`)
    const data: ValidateResponse = await response.json()
    return {
        isValid: data.is_valid,
        message: data.is_valid ? data.message : data.explanation || data.message,
    }
}

const useValidateQuery = (search: string) => {
    return useQuery({
        queryKey: ['validateQuery', search],
        queryFn: () => fetchValidateQuery(search),
        enabled: search.length >= 2,
        placeholderData: (prev) => prev,
        staleTime: 60 * 1000,
    })
}

export {useValidateQuery, fetchValidateQuery}
export type {ValidationResult}
