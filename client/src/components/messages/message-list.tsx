import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  subject: string;
  content: string;
  sender: {
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  isRead: boolean;
  createdAt: string;
}

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                  !message.isRead ? 'bg-primary/5 border-primary/20' : 'bg-muted border-border'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={message.sender.profileImageUrl} />
                    <AvatarFallback>
                      {message.sender.firstName[0]}{message.sender.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-foreground truncate">
                        {message.sender.firstName} {message.sender.lastName}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </span>
                        {!message.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">{message.subject}</p>
                    <p className="text-sm text-muted-foreground truncate">{message.content}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No messages yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
