import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertPostSchema, InsertPost } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SiTiktok, SiInstagram } from "react-icons/si";
import { Loader2, ImagePlus } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  const [imagePreview, setImagePreview] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<InsertPost>({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      title: "",
      content: "",
      platform: "tiktok",
      imageUrl: "",
      author: "Usuário Anônimo",
      authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: InsertPost) => {
      return await apiRequest("POST", "/api/posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Post criado!",
        description: "Seu post foi publicado com sucesso.",
      });
      form.reset();
      setImagePreview("");
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Erro ao criar post",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPost) => {
    createPostMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]" data-testid="dialog-create-post">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] bg-clip-text text-transparent">
            Criar Novo Post
          </DialogTitle>
          <DialogDescription>
            Compartilhe as últimas novidades sobre TikTok ou Instagram
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plataforma</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-platform">
                        <SelectValue placeholder="Selecione a plataforma" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tiktok" data-testid="select-platform-tiktok">
                        <div className="flex items-center gap-2">
                          <SiTiktok className="w-4 h-4" />
                          TikTok
                        </div>
                      </SelectItem>
                      <SelectItem value="instagram" data-testid="select-platform-instagram">
                        <div className="flex items-center gap-2">
                          <SiInstagram className="w-4 h-4" />
                          Instagram
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Nova funcionalidade no TikTok..."
                      {...field}
                      data-testid="input-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Compartilhe os detalhes da notícia..."
                      className="min-h-[120px] resize-none"
                      {...field}
                      data-testid="input-content"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem (opcional)</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input
                        placeholder="https://exemplo.com/imagem.jpg"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setImagePreview(e.target.value);
                        }}
                        data-testid="input-image-url"
                      />
                      {imagePreview && (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-card-border">
                          <img 
                            src={imagePreview} 
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={() => setImagePreview("")}
                          />
                        </div>
                      )}
                      {!imagePreview && (
                        <div className="w-full aspect-video rounded-lg border-2 border-dashed border-muted flex items-center justify-center">
                          <div className="text-center">
                            <ImagePlus className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Preview da imagem aparecerá aqui
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createPostMutation.isPending}
                className="bg-gradient-to-r from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] border-0"
                data-testid="button-submit"
              >
                {createPostMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  "Publicar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
