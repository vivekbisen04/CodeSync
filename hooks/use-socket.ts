'use client';

import { useContext, useEffect, useCallback } from 'react';
import { useSocket as useSocketContext } from '@/components/providers/socket-provider';
import { SOCKET_EVENTS } from '@/lib/constants';

export function useSocket() {
  return useSocketContext();
}

export function useSocketEvent<T = any>(
  event: string,
  handler: (data: T) => void
) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, [socket, event, handler]);
}

export function useSnippetEvents() {
  const { socket } = useSocket();

  const joinSnippetRoom = useCallback((snippetId: string) => {
    if (socket) {
      socket.emit('join_snippet', snippetId);
    }
  }, [socket]);

  const leaveSnippetRoom = useCallback((snippetId: string) => {
    if (socket) {
      socket.emit('leave_snippet', snippetId);
    }
  }, [socket]);

  const emitSnippetUpdate = useCallback((snippetId: string, data: any) => {
    if (socket) {
      socket.emit(SOCKET_EVENTS.SNIPPET_UPDATED, { snippetId, ...data });
    }
  }, [socket]);

  const emitCommentCreated = useCallback((commentData: any) => {
    if (socket) {
      socket.emit(SOCKET_EVENTS.COMMENT_CREATED, commentData);
    }
  }, [socket]);

  const emitLikeToggle = useCallback((snippetId: string, isLiked: boolean) => {
    if (socket) {
      socket.emit(isLiked ? SOCKET_EVENTS.LIKE_ADDED : SOCKET_EVENTS.LIKE_REMOVED, {
        snippetId,
      });
    }
  }, [socket]);

  return {
    joinSnippetRoom,
    leaveSnippetRoom,
    emitSnippetUpdate,
    emitCommentCreated,
    emitLikeToggle,
  };
}