import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Comment, InsertComment } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CommentsSectionProps {
  postId: string;
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: [`/api/comments?postId=${postId}`],
  });

  const createCommentMutation = useMutation({
    mutationFn: async (data: InsertComment) => {
      const response = await apiRequest("POST", "/api/comments", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/comments?postId=${postId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setNewComment("");
    },
    onError: () => {
      toast({
        title: "Erro ao comentar",
        description: "Não foi possível adicionar seu comentário. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    createCommentMutation.mutate({
      postId,
      author: "Usuário Anônimo",
      authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
      content: newComment,
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=current`} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2">
          <Textarea
            placeholder="Adicione um comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[60px] resize-none"
            data-testid={`input-comment-${postId}`}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newComment.trim() || createCommentMutation.isPending}
            className="bg-gradient-to-br from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] border-0"
            data-testid={`button-submit-comment-${postId}`}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <>
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            ))}
          </>
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3" data-testid={`comment-${comment.id}`}>
              <Avatar className="w-8 h-8">
                <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                <AvatarFallback>
                  {comment.author.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-foreground" data-testid={`text-comment-author-${comment.id}`}>
                    {comment.author}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
                <p className="text-sm text-foreground" data-testid={`text-comment-content-${comment.id}`}>
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4" data-testid={`text-no-comments-${postId}`}>
            Nenhum comentário ainda. Seja o primeiro!
          </p>
        )}
      </div>
    </div>
  );
}
