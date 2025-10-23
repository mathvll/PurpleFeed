import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { SiTiktok, SiInstagram } from "react-icons/si";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { CommentsSection } from "./comments-section";
import { useToast } from "@/hooks/use-toast";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/posts/${post.id}/like`, {
        userId: "current-user", // Simple user ID for now
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setIsLiked(!isLiked);
    },
    onError: () => {
      toast({
        title: "Erro ao curtir",
        description: "Não foi possível curtir este post. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copiado!",
      description: "O link do post foi copiado para a área de transferência.",
    });
  };

  const platformIcon = post.platform === "tiktok" ? (
    <SiTiktok className="w-4 h-4" />
  ) : (
    <SiInstagram className="w-4 h-4" />
  );

  const platformColor = post.platform === "tiktok" 
    ? "bg-gradient-to-r from-[#FF0050] to-[#00F2EA]" 
    : "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]";

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-post-${post.id}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar className="w-10 h-10 ring-2 ring-primary/20">
            <AvatarImage src={post.authorAvatar} alt={post.author} />
            <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] text-white">
              {post.author.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate" data-testid={`text-author-${post.id}`}>
              {post.author}
            </p>
            <p className="text-sm text-muted-foreground" data-testid={`text-timestamp-${post.id}`}>
              {formatDistanceToNow(new Date(post.createdAt), { 
                addSuffix: true,
                locale: ptBR 
              })}
            </p>
          </div>
        </div>
        <Badge 
          className={`${platformColor} text-white border-0 gap-1.5`}
          data-testid={`badge-platform-${post.id}`}
        >
          {platformIcon}
          {post.platform === "tiktok" ? "TikTok" : "Instagram"}
        </Badge>
      </CardHeader>

      {post.imageUrl && (
        <div className="relative w-full aspect-video overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-full object-cover"
            data-testid={`img-post-${post.id}`}
          />
        </div>
      )}

      <CardContent className="pt-4">
        <h3 className="text-xl font-bold text-foreground mb-2 font-[family-name:var(--font-heading)]" data-testid={`text-title-${post.id}`}>
          {post.title}
        </h3>
        <p className="text-muted-foreground line-clamp-3" data-testid={`text-content-${post.id}`}>
          {post.content}
        </p>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center gap-2 pt-2">
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 ${isLiked ? 'text-red-500' : ''}`}
          onClick={handleLike}
          disabled={likeMutation.isPending}
          data-testid={`button-like-${post.id}`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          <span data-testid={`text-likes-${post.id}`}>{post.likes}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => setShowComments(!showComments)}
          data-testid={`button-comments-${post.id}`}
        >
          <MessageCircle className="w-4 h-4" />
          <span data-testid={`text-comment-count-${post.id}`}>{post.commentCount}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={handleShare}
          data-testid={`button-share-${post.id}`}
        >
          <Share2 className="w-4 h-4" />
          Compartilhar
        </Button>
      </CardFooter>

      {showComments && (
        <div className="border-t border-card-border">
          <CommentsSection postId={post.id} />
        </div>
      )}
    </Card>
  );
}
