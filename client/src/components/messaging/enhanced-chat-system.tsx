import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Advanced3DLayout, Enhanced3DCard } from '@/components/3d/advanced-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  MessageSquare, 
  Users, 
  Search, 
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Circle,
  CheckCheck,
  Clock
} from 'lucide-react';

interface ChatSystemProps {
  userId: string;
  userRole: string;
}

export function EnhancedChatSystem({ userId, userRole }: ChatSystemProps) {
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch chat rooms
  const { data: chatRooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ['/api/chat/rooms', userId],
    queryFn: () => apiRequest(`/api/chat/rooms?userId=${userId}`)
  });

  // Fetch messages for selected room
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/chat/messages', selectedRoom?.id],
    queryFn: () => apiRequest(`/api/chat/messages?roomId=${selectedRoom.id}`),
    enabled: !!selectedRoom?.id
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (messageData: any) => apiRequest('/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages', selectedRoom?.id] });
      setMessageText('');
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedRoom) return;

    sendMessageMutation.mutate({
      roomId: selectedRoom.id,
      senderId: userId,
      content: messageText,
      messageType: 'text'
    });
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredRooms = chatRooms.filter((room: any) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      {/* Chat Rooms Sidebar */}
      <Advanced3DLayout variant="holographic" className="w-80 p-4">
        <Card className="h-full bg-white/10 dark:bg-black/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Messages
              </CardTitle>
              <Button size="sm" variant="ghost">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/20 border-white/30"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2 p-4">
                <AnimatePresence>
                  {filteredRooms.map((room: any, index: number) => (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          selectedRoom?.id === room.id 
                            ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300' 
                            : 'bg-white/20 hover:bg-white/30 border-white/20'
                        }`}
                        onClick={() => setSelectedRoom(room)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                  {room.type === 'class' ? <Users className="w-5 h-5" /> : room.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium truncate">{room.name}</h4>
                                <span className="text-xs text-gray-500">
                                  {room.lastMessageTime ? new Date(room.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-sm text-gray-500 truncate">
                                  {room.lastMessage || 'No messages yet'}
                                </p>
                                {room.unreadCount > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    {room.unreadCount}
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-1 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {room.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </Advanced3DLayout>

      {/* Chat Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <Advanced3DLayout variant="floating" className="p-4">
              <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-xl border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                          {selectedRoom.type === 'class' ? <Users className="w-5 h-5" /> : selectedRoom.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{selectedRoom.name}</h3>
                        <p className="text-sm text-gray-500">{selectedRoom.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Advanced3DLayout>

            {/* Messages Area */}
            <div className="flex-1 p-4">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((message: any, index: number) => {
                      const isOwnMessage = message.senderId === userId;
                      
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                            <div className="flex items-end gap-2">
                              {!isOwnMessage && (
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                                    {message.senderName?.slice(0, 2).toUpperCase() || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              
                              <Enhanced3DCard
                                className={`max-w-full ${
                                  isOwnMessage 
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                                    : 'bg-white dark:bg-gray-800'
                                }`}
                                glowColor={isOwnMessage ? 'blue' : 'purple'}
                              >
                                <div className="p-3">
                                  {!isOwnMessage && (
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                                      {message.senderName} {message.senderLastName}
                                    </p>
                                  )}
                                  <p className="text-sm">{message.content}</p>
                                  
                                  <div className={`flex items-center justify-end gap-1 mt-2 ${
                                    isOwnMessage ? 'text-blue-100' : 'text-gray-400'
                                  }`}>
                                    <span className="text-xs">
                                      {new Date(message.createdAt).toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })}
                                    </span>
                                    {isOwnMessage && (
                                      <CheckCheck className="w-3 h-3" />
                                    )}
                                  </div>
                                </div>
                              </Enhanced3DCard>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Message Input */}
            <Advanced3DLayout variant="morphing" className="p-4">
              <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-xl border-white/20">
                <CardContent className="p-4">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <Button type="button" size="sm" variant="ghost">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    
                    <div className="flex-1 relative">
                      <Input
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type a message..."
                        className="pr-10 bg-white/20 border-white/30"
                      />
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="ghost" 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        <Smile className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={!messageText.trim() || sendMessageMutation.isPending}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </Advanced3DLayout>
          </>
        ) : (
          /* No Chat Selected State */
          <div className="flex-1 flex items-center justify-center">
            <Advanced3DLayout variant="holographic">
              <div className="text-center p-8">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500">
                  Choose a chat room from the sidebar to start messaging
                </p>
              </div>
            </Advanced3DLayout>
          </div>
        )}
      </div>
    </div>
  );
}