import { getEntranceMcqQuestionsData } from "@/action/exams/entrance-mcq-exam";
import { EntranceMcqExamParams } from "@/types/exam/mcq-exam";
import { useQuery } from "@tanstack/react-query";


export function useEntranceMcqQuestionsData (value: EntranceMcqExamParams) {
    return useQuery({
        queryKey: ["getMcqQuestionsData"],
        queryFn: async () => await getEntranceMcqQuestionsData(value),
    })
}