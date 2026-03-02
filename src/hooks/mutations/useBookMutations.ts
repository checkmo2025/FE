import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookService } from "@/services/bookService";
import { bookKeys } from "../queries/useBookQueries";

export const useToggleBookLikeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (isbn: string) => bookService.toggleLike(isbn),
        onSuccess: (data, isbn) => {
            // Update the liked status in search results, recommended books, or book details
            queryClient.invalidateQueries({ queryKey: bookKeys.all });
        },
    });
};
