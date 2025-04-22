
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Paperclip, User } from "lucide-react";

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  authorRole: string;
  timestamp: string;
  attachments: Attachment[];
  replies?: Comment[];
}

// Mock data for the comments
const mockComments: Comment[] = [
  {
    id: "comment-1",
    text: "Please provide more details about the expense. What was the purpose of the business trip?",
    author: "Jane Smith",
    authorRole: "Finance Manager",
    timestamp: "2023-04-16 14:30",
    attachments: [],
    replies: [
      {
        id: "reply-1",
        text: "The business trip was to attend the annual industry conference and meet with potential clients.",
        author: "John Doe",
        authorRole: "Sales Representative",
        timestamp: "2023-04-16 15:45",
        attachments: [
          {
            id: "attach-1",
            name: "Conference_Agenda.pdf",
            url: "#",
            type: "application/pdf",
            size: 1240000
          }
        ]
      }
    ]
  },
  {
    id: "comment-2",
    text: "The hotel expense seems high. Did you use the corporate rate?",
    author: "Michael Chen",
    authorRole: "CEO",
    timestamp: "2023-04-17 09:15",
    attachments: [],
    replies: [
      {
        id: "reply-2",
        text: "Yes, I used the corporate rate. The hotel prices were higher due to the conference being in the city at the same time.",
        author: "John Doe",
        authorRole: "Sales Representative",
        timestamp: "2023-04-17 10:20",
        attachments: [
          {
            id: "attach-2",
            name: "Hotel_Receipt.pdf",
            url: "#",
            type: "application/pdf",
            size: 890000
          }
        ]
      }
    ]
  }
];

interface CommentSectionProps {
  expenseId: string;
}

export function CommentSection({ expenseId }: CommentSectionProps) {
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [comments, setComments] = useState<Comment[]>(mockComments);

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...filesArray]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      text: commentText,
      author: "Current User",
      authorRole: "Employee",
      timestamp: new Date().toLocaleString(),
      attachments: attachments.map((file, index) => ({
        id: `attach-${Date.now()}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size
      })),
      replies: []
    };

    if (replyingTo) {
      const updatedComments = comments.map(comment => {
        if (comment.id === replyingTo) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newComment]
          };
        }
        return comment;
      });
      setComments(updatedComments);
    } else {
      setComments(prev => [...prev, newComment]);
    }

    // Reset the form
    setCommentText("");
    setAttachments([]);
    setReplyingTo(null);
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <Card className="w-full shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Comments
        </CardTitle>
      </CardHeader>
      <ScrollArea className="h-[480px]">
        <CardContent className="p-4">
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{comment.author}</span>
                      <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded">
                        {comment.authorRole}
                      </span>
                      <span className="text-xs text-slate-500">{comment.timestamp}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{comment.text}</p>
                    
                    {comment.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <h4 className="text-xs font-medium text-slate-600 dark:text-slate-400">Attachments:</h4>
                        {comment.attachments.map((attachment) => (
                          <div 
                            key={attachment.id} 
                            className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700"
                          >
                            <Paperclip className="h-4 w-4 text-slate-500" />
                            <div className="flex-1 truncate text-xs">
                              <a href={attachment.url} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                {attachment.name}
                              </a>
                              <span className="text-slate-500 ml-1">({formatFileSize(attachment.size)})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-0 h-auto"
                      onClick={() => handleReply(comment.id)}
                    >
                      Reply
                    </Button>
                    
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3 space-y-3 pl-4 border-l-2 border-slate-100 dark:border-slate-700">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="pt-2">
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                <User className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{reply.author}</span>
                                  <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded">
                                    {reply.authorRole}
                                  </span>
                                  <span className="text-xs text-slate-500">{reply.timestamp}</span>
                                </div>
                                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{reply.text}</p>
                                
                                {reply.attachments.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    <h4 className="text-xs font-medium text-slate-600 dark:text-slate-400">Attachments:</h4>
                                    {reply.attachments.map((attachment) => (
                                      <div 
                                        key={attachment.id} 
                                        className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700"
                                      >
                                        <Paperclip className="h-4 w-4 text-slate-500" />
                                        <div className="flex-1 truncate text-xs">
                                          <a href={attachment.url} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                            {attachment.name}
                                          </a>
                                          <span className="text-slate-500 ml-1">({formatFileSize(attachment.size)})</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium mb-2">
              {replyingTo ? "Reply to comment" : "Add a comment"}
            </h3>
            
            <Textarea
              placeholder="Type your comment here..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full resize-none mb-2 bg-white dark:bg-slate-900"
            />
            
            {attachments.length > 0 && (
              <div className="mb-3 space-y-2">
                <h4 className="text-xs font-medium">Attachments:</h4>
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 truncate">
                      <Paperclip className="h-4 w-4 text-slate-500" />
                      <span className="text-xs truncate">{file.name}</span>
                      <span className="text-xs text-slate-500">({formatFileSize(file.size)})</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 text-slate-500 hover:text-red-500"
                      onClick={() => handleRemoveAttachment(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleAttachmentChange}
                  />
                  <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    <Paperclip className="h-4 w-4" />
                    <span>Attach files</span>
                  </div>
                </label>
              </div>
              
              <div className="flex gap-2">
                {replyingTo && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setReplyingTo(null)}
                  >
                    Cancel
                  </Button>
                )}
                <Button 
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                >
                  {replyingTo ? "Reply" : "Comment"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
