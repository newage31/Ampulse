"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Conversation, Message, OperateurSocial } from '../types';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Paperclip, 
  MoreHorizontal,
  ArrowLeft,
  User,
  Clock,
  Check,
  CheckCheck,
  AlertCircle,
  FileText
} from 'lucide-react';

interface MessagerieProps {
  conversations: Conversation[];
  messages: Message[];
  operateurs: OperateurSocial[];
  onSendMessage: (conversationId: number, contenu: string) => void;
}

export default function Messagerie({ conversations, messages, operateurs, onSendMessage }: MessagerieProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filteredConversations = conversations.filter(conv => 
    conv.operateurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.sujet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const conversationMessages = selectedConversation 
    ? messages.filter(msg => msg.conversationId === selectedConversation.id)
    : [];

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      onSendMessage(selectedConversation.id, newMessage);
      setNewMessage('');
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'envoye': return <Check className="h-4 w-4 text-gray-400" />;
      case 'lu': return <CheckCheck className="h-4 w-4 text-blue-500" />;
      case 'repondu': return <CheckCheck className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'urgente': return 'bg-red-100 text-red-800';
      case 'importante': return 'bg-orange-100 text-orange-800';
      case 'normale': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex">
      {/* Liste des conversations */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Messagerie
            </h2>
            <Badge variant="secondary">
              {conversations.filter(c => c.nonLus > 0).length} non lus
            </Badge>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher une conversation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {conversation.operateurNom}
                    </h3>
                    {conversation.nonLus > 0 && (
                      <Badge className="bg-red-500 text-white text-xs">
                        {conversation.nonLus}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.sujet}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {conversation.derniereMessage}
                  </p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <div>{conversation.dateDernierMessage}</div>
                  <div className="mt-1">{conversation.nombreMessages} messages</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de messages */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* En-tête de la conversation */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <h3 className="font-semibold">{selectedConversation.operateurNom}</h3>
                    <p className="text-sm text-gray-600">{selectedConversation.sujet}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPrioriteColor('normale')}>
                    {selectedConversation.statut === 'active' ? 'Active' : 'Terminée'}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversationMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.expediteurType === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${
                    message.expediteurType === 'admin' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  } rounded-lg p-3`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {message.expediteurNom}
                      </span>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(message.statut)}
                        <span className="text-xs opacity-70">
                          {message.dateEnvoi}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-2">{message.contenu}</p>
                    
                    {message.pieceJointe && (
                      <div className="flex items-center space-x-2 text-xs opacity-70">
                        <FileText className="h-3 w-3" />
                        <span>{message.pieceJointe}</span>
                      </div>
                    )}
                    
                    {message.priorite !== 'normale' && (
                      <Badge className={`text-xs mt-2 ${
                        message.expediteurType === 'admin' 
                          ? 'bg-white text-blue-500' 
                          : getPrioriteColor(message.priorite)
                      }`}>
                        {message.priorite === 'urgente' ? 'Urgent' : 'Important'}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Zone de saisie */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Textarea
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewMessage(e.target.value)}
                    className="min-h-[60px] resize-none"
                    onKeyPress={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sélectionnez une conversation
              </h3>
              <p className="text-gray-600">
                Choisissez une conversation dans la liste pour commencer à échanger des messages.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 